function isPromise<T>(v: T | Promise<T>): v is Promise<T> {
  return (
    typeof v === `object` &&
    v !== null &&
    `then` in v &&
    typeof v.then === `function`
  );
}

export { isPromise };
