export const generateNumberCode = (codeLength = 6) => {
  return Array.from({ length: codeLength }, () =>
    Math.floor(Math.random() * 10),
  ).join("");
};
