type Key = 'editingPost' | 'creatingPost';

export const useLocalStorage = <A>(key: Key) => {
  const setLsItem = (value: A) => {
    const stringifiedValue = typeof value === 'string' ? value : JSON.stringify(value);
    localStorage.setItem(key, stringifiedValue);
  };
  const getLsItem = (): A | null => {
    const currentItem = localStorage.getItem(key);
    if (!currentItem) {
      return null;
    }
    return JSON.parse(currentItem);
  };
  const removeLsItem = () => {
    localStorage.removeItem(key);
  };

  return { setLsItem, getLsItem, removeLsItem };
};
