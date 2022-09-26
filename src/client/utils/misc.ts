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

const isImageUrl = (url: string) => {
  return ['.png', '.jpg', '.jpeg', '.gif'].some((imgType) => url.includes(imgType));
};

export const isYoutubeUrl = (url: string) => {
  return ['youtube', 'youtu.be'].some((str) => url?.includes(str));
};

export const checkContentType = (url: string | null) => {
  if (!url) {
    return null;
  }

  switch (true) {
    case isYoutubeUrl(url):
      return 'youtube';
    case isImageUrl(url):
      return 'image';
    default:
      return null;
  }
};

export const getYoutubeTitle = async (url: string): Promise<string> =>
  fetch(`https://noembed.com/embed?dataType=json&url=${url}`)
    .then((res) => res.json())
    .then((data) => data.title);
