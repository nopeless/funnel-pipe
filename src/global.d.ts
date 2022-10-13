type NeverVoid<T> = isVoid<T> extends true ? never : any;

type Fn = (...args: never[]) => unknown;

type isAsync<T> = T extends (...args: never[]) => Promise<unknown>
  ? true
  : false;
type isPromise<T> = T extends Promise<unknown> ? true : false;
type isVoid<T> = T extends void ? true : false;
type isNever<T> = [T] extends [never] ? true : false;

type Param0<T extends Fn> = Parameters<T> extends readonly []
  ? never
  : Parameters<T>[0];

type Tail<T extends readonly [unknown, ...unknown[]]> = T extends [
  unknown,
  ...infer R
]
  ? R
  : never;

type Reduce<In, Arr extends readonly Fn[]> = Arr extends readonly []
  ? In
  : Arr extends readonly [infer F extends Fn, ...infer R extends Fn[]]
  ? F extends (x: In) => unknown
    ? // For some reason, you have to use ReturnType here
      // Or else the type inference does not work
      ReturnType<F> extends Promise<infer AwaitedRet>
      ? Promise<Awaited<Reduce<AwaitedRet, R>>>
      : Reduce<ReturnType<F>, R>
    : never
  : Arr extends Array<infer F extends Fn>
  ? F extends (x: In) => In
    ? In
    : never
  : never;

type ValidateTransducers<
  Arr extends readonly Fn[],
  In = Param0<Arr[0]>
> = Arr extends readonly []
  ? Arr
  : Arr extends readonly [infer F extends Fn, ...infer R extends readonly Fn[]]
  ? F extends (x: In) => unknown
    ? R extends ValidateTransducers<R, Awaited<ReturnType<F>>>
      ? Arr
      : readonly [F, ...ValidateTransducers<R, Awaited<ReturnType<F>>>]
    : readonly [(x: In) => ReturnType<F>, ...R]
  : Arr extends Array<infer F extends Fn>
  ? F extends (x: In) => In
    ? Arr
    : Array<(x: In) => In>
  : never;

/**
 * T and U are not Promises
 */
interface IPipeIn<T, U = void> {
  /**
   * @param x - The value to pipe in.
   * @returns The final processed value corresponding to the piped in value.
   */
  in(x: T): U;
}

interface ___IPipe<In = unknown, Out = unknown, ReturnOfIn = Out | Promise<Out>>
  extends IPipeIn<In, ReturnOfIn>,
    IPipeOut<Out> {}

type Processors = [___IPipe, Processors][];

interface IPipeOut<U> {
  out: IPipeIn<U> | null;
}
