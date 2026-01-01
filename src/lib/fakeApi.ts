export function fakeApi<T>(data: T, delay = 1000): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
}
