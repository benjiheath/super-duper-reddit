export const capitalize = (str: string): string =>
  str.includes('/')
    ? str.replace(`/${str.charAt(1)}`, str.charAt(1).toUpperCase())
    : str.charAt(0).toUpperCase() + str.slice(1);
