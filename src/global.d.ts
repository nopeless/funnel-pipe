import { Equals } from "tsafe";

type Reduce<In, Arr> = Arr extends readonly []
  ? In
  : Arr extends readonly [infer FirstFunc, ...infer R]
  ? FirstFunc extends (x: In) => infer Out
    ? R extends readonly []
      ? Out
      : Reduce<Out, R>
    : never
  : never;

type Chainable<Arr extends readonly unknown[]> = Arr extends readonly []
  ? Arr
  : Equals<Reduce<unknown, Arr>, never> extends true
  ? Arr
  : never;

interface IPipeIn<T> {
  in(x: T): unknown;
}

interface IPipeOut<U> {
  out: null | IPipeIn<U>;
}

interface PipeEnd<T, U = T> {
  call(x: T): Promise<U> | U;
}

interface DPipe<T, U = T> extends IPipeIn<T>, IPipeOut<U>, PipeEnd<T, U> {}
