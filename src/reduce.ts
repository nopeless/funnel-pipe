import { Equals } from "tsafe";
import { Chainable, HasAsyncInChain, ReduceAsync } from "./global.js";
import { isPromise } from "./util.js";

/**
 * Reduces the array using initial value recursively
 */
function reduce<In, Arr extends readonly unknown[]>(
  x: In,
  arr: Equals<Arr, Chainable<Arr>> extends true
    ? ReduceAsync<In, Arr> extends never
      ? never
      : Arr
    : never
): HasAsyncInChain<Arr> extends true
  ? Promise<ReduceAsync<In, Arr>>
  : ReduceAsync<In, Arr> {
  // I did not feel like strict typing this entire function because it is not worth it

  const [first, ...rest] = arr;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (first === undefined) return x as Reduce<In, Arr>;

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const result = first(x);
  if (isPromise(result)) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return result.then((result) => reduce(result, rest)) as Promise<
      ReduceAsync<In, Arr>
    >;
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return reduce(result, rest) as Reduce<In, Arr>;
}

// const rearr = [
//   (x: number) => x === 1,
//   (x: boolean) => (x ? 1 : 0) + 2,
//   (x: number) => (x === 3 ? `` : `false`),
//   (x: string) => x.length === 0,
// ] as const;

// const rr = [
//   // 0
//   async (_x: string) => 3,
//   // 1
//   (x: number) => x === 1,
// ] as const;

// // type Unpromised<T> = T extends Promise<infer U> ? Unpromised<U> : T;

// type k = ReduceAsync<string, typeof rr>;
// type j = Reduce<string, typeof rr>;

// const r = reduce(1, rearr);

// console.log(r);

export { reduce };
