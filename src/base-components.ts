import { Equals, Param0 } from "tsafe";
import {
  Chainable,
  HasAsyncInChain,
  IPipeIn,
  IPipeOut,
  MaybePromise,
  ReduceAsync,
  Unpromised,
} from "./global.js";
import { reduce } from "./reduce.js";
import { Emitter } from "../lib/emitter/index.js";
import { isPromise } from "util/types";

interface IPipe<In, Out, OutOfIn = MaybePromise<Out>>
  extends IPipeIn<In, OutOfIn>,
    IPipeOut<Unpromised<Out> | Out> {}

class Pipe<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Arr extends readonly [(ffi: any) => any, ...((dli: any) => any)[]],
  In = Param0<Arr[0]>,
  Out = ReduceAsync<In, Arr>
> implements
    IPipe<In, Out, HasAsyncInChain<Arr> extends true ? Promise<Out> : Out>
{
  public out: IPipeIn<Unpromised<Out> | Out> | null = null;
  constructor(
    public readonly middlewares: Equals<Arr, Chainable<Arr>> extends true
      ? In extends never
        ? never
        : Out extends never
        ? never
        : Arr
      : never
  ) {}

  public in(x: In): HasAsyncInChain<Arr> extends true ? Promise<Out> : Out {
    const r = reduce(x, this.middlewares);
    if (isPromise(r)) {
      r.then((r) => this.out?.in(r as Unpromised<Out>));
      return r as HasAsyncInChain<Arr> extends true ? Promise<Out> : Out;
    }
    this.out?.in(r as Unpromised<Out>);
    return r as HasAsyncInChain<Arr> extends true ? Promise<Out> : Out;
  }
}

type GetIn<P> = P extends IPipeIn<infer In, infer _> ? In : never;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
class Funnel<P extends IPipeIn<unknown, any>, T = GetIn<P>>
  extends Emitter<T>
  implements IPipeOut<T>
{
  public out: P | null = null;
  constructor(pipe?: P) {
    super();

    if (pipe) this.out = pipe;

    this.on((arg) => {
      if (this.out) this.out.in(arg);
    });
  }
}

class UFunnel<T> extends Emitter<T> implements IPipeIn<T> {
  constructor(pipe?: IPipeOut<T>) {
    super();

    if (pipe) pipe.out = this;

    this.in = this.in.bind(this);
  }
  public in(arg: T): T {
    this.emit(arg);
    return arg;
  }
}

export { IPipe, Pipe, Funnel, UFunnel };
