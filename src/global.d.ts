import { Equals } from "tsafe";

// type Reduce<In, Arr> = Arr extends readonly []
//   ? In
//   : Arr extends readonly [infer FirstFunc, ...infer R]
//   ? FirstFunc extends (x: In) => infer Out
//     ? R extends readonly []
//       ? Out
//       : Reduce<Out, R>
//     : never
//   : never;

type Unpromised<T> = T extends Promise<infer U> ? Unpromised<U> : T;

// type DualPromise<T> = T | Promise<T>;

// type j = DualPromise<number>;
// type k = Unpromised<j>;

// type j = Unpromised<Promise<Promise<number>>>;
// type k = Unpromised<number>;

type ReduceAsync<In, Arr extends readonly unknown[]> = Arr extends readonly []
  ? In
  : Arr extends readonly [infer FirstFunc, ...infer R]
  ? FirstFunc extends (x: In) => infer Out
    ? R extends readonly []
      ? Out
      : ReduceAsync<Unpromised<Out>, R>
    : never
  : never;

type Chainable<Arr extends readonly unknown[]> = Arr extends readonly []
  ? Arr
  : Equals<ReduceAsync<unknown, Arr>, never> extends true
  ? Arr
  : never;

type HasAsyncInChain<Arr extends readonly unknown[]> = Arr extends readonly []
  ? false
  : Arr extends readonly [infer FirstFunc, ...infer R]
  ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
    FirstFunc extends (x: any) => Promise<unknown>
    ? true
    : HasAsyncInChain<R>
  : never;

/**
 * T and U are not Promises
 */
interface IPipeIn<T, U = T> {
  /**
   * @param x - The value to pipe in.
   * @returns The final processed value corresponding to the piped in value.
   * Return null if it is undeterministic
   */
  in(x: T): null | U;
}

interface IPipeInAny<T> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  in(x: T): any;
}

interface IPipeOut<U> {
  out: null | IPipeIn<U>;
}
