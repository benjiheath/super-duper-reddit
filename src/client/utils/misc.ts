export const capitalize = (str: string): string =>
  str.includes('/')
    ? str.replace(`/${str.charAt(1)}`, str.charAt(1).toUpperCase())
    : str.charAt(0).toUpperCase() + str.slice(1);

export const obscureEmail = (email: string): string => {
  const emailID = email.slice(0, email.indexOf('@'));
  const numStars = emailID.length - 3;
  const visibleChars = email.slice(numStars);
  const obscuredEmail = visibleChars.padStart(email.length, '*');
  return obscuredEmail;
};

export const getIdType = (id: string): 'email' | 'username' => {
  return id.includes('@') ? 'email' : 'username';
};

export const createPostSlugs = (id: string, title: string) => {
  const shortenedPostId = id.slice(0, 8);
  const underscoredTitle = title.replace(/ /g, '_').toLowerCase();

  return `${shortenedPostId}/${[underscoredTitle]}`;
};
