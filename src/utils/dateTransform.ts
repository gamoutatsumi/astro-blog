export const dateTransform = (date: Date, withTime?: boolean) =>
  `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${
    withTime ? `${date.getHours()}:${date.getMinutes()}` : ""
  }`;
