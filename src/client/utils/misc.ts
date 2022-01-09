import { DateTime } from 'luxon';

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

export const getTimeAgo = (date: string) => {
  const dateISO = new Date(Date.parse(date)).toISOString();
  const now = DateTime.local();
  const past = DateTime.fromISO(dateISO);

  const rel = past.toRelative({ base: now });
  return rel;
};

export const checkIfUrlIsImg = (url: string | null) => {
  if (url?.endsWith('.png') || url?.endsWith('.jpg') || url?.endsWith('.jpeg') || url?.endsWith('.gif')) {
    return true;
  } else {
    return false;
  }
};
