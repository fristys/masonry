/**
 * Debounces a method by a certain amount of time in ms
 */
export function debounce<T extends Function>(cb: T, wait = 25) {
  let h: any = 0;

  const callable = (...args: any) => {
    clearTimeout(h);
    h = setTimeout(() => cb(...args), wait);
  };

  return <T>(<any>callable);
}
