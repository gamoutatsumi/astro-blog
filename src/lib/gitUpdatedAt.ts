import simpleGit from "simple-git";

const cache = new Map<string, Date | undefined>();
const git = simpleGit({ baseDir: process.cwd() });

export const getGitUpdatedAt = async (
  filePath: string,
): Promise<Date | undefined> => {
  if (cache.has(filePath)) {
    return cache.get(filePath);
  }

  try {
    const log = await git.log({ file: filePath, maxCount: 1 });
    const latestDate = log.latest?.date ? new Date(log.latest.date) : undefined;
    const updatedAt =
      latestDate && !Number.isNaN(latestDate.getTime())
        ? latestDate
        : undefined;

    cache.set(filePath, updatedAt);
    return updatedAt;
  } catch {
    cache.set(filePath, undefined);
    return undefined;
  }
};

export const getUpdatedDate = async (
  filePath: string,
  publishDate: Date,
): Promise<Date> => {
  const gitUpdatedAt = await getGitUpdatedAt(filePath);
  return gitUpdatedAt && gitUpdatedAt >= publishDate
    ? gitUpdatedAt
    : publishDate;
};
