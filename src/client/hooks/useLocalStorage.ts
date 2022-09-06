export const useLocalStorage = <A>(key: string) => {
  const setItem = (value: A) => {
    const stringifiedValue = typeof value === 'string' ? value : JSON.stringify(value);
    localStorage.setItem(key, stringifiedValue);
  };
  const getItem = (): A | null => {
    const currentItem = localStorage.getItem(key);
    if (!currentItem) {
      return null;
    }
    return JSON.parse(currentItem);
  };
  const removeItem = () => {
    localStorage.removeItem(key);
  };

  return { setItem, getItem, removeItem };
};
