export const capitalize = (str: string): string =>
  str.includes('/')
    ? str.replace(`/${str.charAt(1)}`, str.charAt(1).toUpperCase())
    : str.charAt(0).toUpperCase() + str.slice(1);

export const createPostSlugs = (id: string, title: string) => {
  const shortenedPostId = id.slice(0, 8);
  const underscoredTitle = title.replace(/ /g, '_').toLowerCase();

  return `${shortenedPostId}-${[underscoredTitle]}`;
};
