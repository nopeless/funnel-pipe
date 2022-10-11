type NeverVoid<T> = isVoid<T> extends true ? never : any;

type Fn = (x: never) => unknown;

type isAsync<T> = T extends (...args: any) => Promise<any> ? true : false;
type isPromise<T> = T extends Promise<any> ? true : false;
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
    ? isAsync<F> extends true
      ? Reduce<Awaited<ReturnType<F>>, R> extends Promise<unknown>
        ? Reduce<Awaited<ReturnType<F>>, R>
        : Promise<Reduce<Awaited<ReturnType<F>>, R>>
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

type InFT<T> = (x: T) => unknown;
type InFTT<T> = (x: T) => T;

type ValidateTransducers2<
  Arr extends readonly Fn[],
  InF extends (x: Param0<Arr[0]>) => unknown = (x: Param0<Arr[0]>) => unknown
> = Arr extends readonly []
  ? Arr
  : Arr extends readonly [infer F extends Fn, ...infer R extends readonly Fn[]]
  ? F extends InF
    ? R extends ValidateTransducers2<R, (x: Awaited<ReturnType<F>>) => unknown>
      ? Arr
      : readonly [
          F,
          ...ValidateTransducers2<R, (x: Awaited<ReturnType<F>>) => unknown>
        ]
    : readonly [InF & (() => ReturnType<F>), ...R]
  : Arr extends Array<infer F extends Fn>
  ? F extends InF & (() => Param0<Arr[number]>)
    ? Arr
    : Array<InF & (() => Param0<F>)>
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
