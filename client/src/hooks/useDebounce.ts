export default function useDebounce() {
  let delay: NodeJS.Timeout;
  return (runnable: Function, timeout: number = 250) => {
    clearTimeout(delay);
    delay = setTimeout(() => {
      runnable();
    }, timeout);
  };
}
