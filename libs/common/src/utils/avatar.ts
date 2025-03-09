export const generateCustomAvatarUrl = (
  first_name: string,
  last_name: string,
) => {
  return `https://avatar.iran.liara.run/username?username=${first_name.replace(" ", "")}+${last_name.replace(" ", "")}`;
};
