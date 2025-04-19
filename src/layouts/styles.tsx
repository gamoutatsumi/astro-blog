import { useEffect } from "react";

export const Styles = () => {
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (async () => {
      await import("bootstrap");
    })();
  }, []);
};
