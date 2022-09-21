import { Equals, Param0 } from "tsafe";
import { Chainable, IPipeIn, IPipeOut, Reduce } from "./global.js";
import { reduce, reduceSync } from "./reduce.js";
import { Emitter } from "../lib/emitter/index.js";

class Pipe<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Arr extends readonly [(ffi: any) => any, ...((dli: any) => any)[]],
  In = Param0<Arr[0]>,
  Out = Reduce<In, Arr>
> implements IPipeOut<Out>, IPipeIn<In>
{
  public out: IPipeIn<Out> | null = null;
  constructor(
    public readonly middlewares: Equals<Arr, Chainable<Arr>> extends true
      ? In extends never
        ? never
        : Out extends never
        ? never
        : Arr
      : never
  ) {}

  public async inAsync(x: In): Promise<Out> {
    const r = (await reduce(x, this.middlewares)) as Out;
    if (this.out) this.out.in(r);
    return r;
  }

  public in(x: In): Out {
    const r = reduceSync(x, this.middlewares) as Out;
    if (this.out) this.out.in(r);
    return r;
  }
}

class Funnel<T> extends Emitter<T> implements IPipeOut<T> {
  public out: IPipeIn<T> | null = null;
  constructor(pipe?: IPipeIn<T>) {
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

export { Pipe, Funnel, UFunnel };
