import { isPromise } from "./util.js";

/**
 * Reduces the array using initial value recursively
 */
function reduce<Arr extends readonly Fn[]>(
  x: Param0<Arr[0]>,
  arr: ValidateTransducers<Arr>
): Reduce<Param0<Arr[0]>, Arr> {
  if (arr.length === 0) return x;
  const [f, ..._r] = arr as readonly [...ValidateTransducers<Arr>];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const r = _r as any;
  const y = (f as Arr[0])(x) as ReturnType<Arr[0]>;
  if (isPromise(y)) {
    // We know its a promise
    return y.then((y: Awaited<ReturnType<Arr[0]>>) => reduce(y, r)) as Reduce<
      Param0<Arr[0]>,
      Arr
    >;
  }
  return reduce(y, r) as Reduce<Param0<Arr[0]>, Arr>;
}

export { reduce };
