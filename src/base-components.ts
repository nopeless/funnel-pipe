import { reduce } from "./reduce.js";
import { Emitter } from "../lib/emitter/index.js";
import { isPromise, EitherFactory, then } from "./util.js";

const PROCESSORS = Symbol(`funnel.js:processors`);

interface Monad {
  [PROCESSORS]?: Processors;
}

interface IPipe<In = unknown, Out = unknown, ReturnOfIn = Out | Promise<Out>>
  extends IPipeIn<In, ReturnOfIn>,
    IPipeOut<Out> {}

type __Out<Arr extends readonly Fn[]> = Monad &
  Exclude<Awaited<Reduce<Param0<Arr[0]>, Arr>>, undefined>;

class Pipe<
  Arr extends readonly Fn[],
  // Used for more type inference if the user wants
  OutPipe extends IPipeIn<__Out<Arr>> = IPipeIn<__Out<Arr>>
> implements IPipe<Param0<Arr[0]>, __Out<Arr>, Reduce<Param0<Arr[0]>, Arr>>
{
  public name = `Anonymous Pipe`;
  public out: OutPipe | null = null;

  constructor(public transducers: ValidateTransducers<Arr>, name?: string) {
    if (name) this.name = name;
  }

  /**
   * Returns #in() method but bound to this instance
   */
  public get fn() {
    return this.in.bind(this);
  }

  public in(x: Param0<Arr[0]> & Monad): Reduce<Param0<Arr[0]>, Arr> {
    const r = EitherFactory(reduce<Arr>)(x, this.transducers);
    return then(
      // Make monad
      r,
      // Handle
      ([_res, rej]) => {
        const res = _res as __Out<Arr>;
        if (rej === undefined) {
          this.out?.in(res);
          return res;
        }
        throw rej;
      }
    ) as Reduce<Param0<Arr[0]>, Arr>;
  }

  static Fn<F extends Fn>(fn: F, name?: string) {
    type j = F;
    // TODO I have no idea why this won't work here
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return new Pipe<readonly [F]>([fn] as const, name);
  }
}

class BasePipe<In, Out = In> extends Pipe<[(x: In) => Out]> {
  constructor(...args: ConstructorParameters<typeof Pipe<[(x: In) => Out]>>) {
    super(...args);
  }
}

type __IPipeIn__T<P> = P extends IPipeIn<infer T, unknown> ? T : never;
type __IPipeOut__T<P> = P extends IPipeOut<infer T> ? T : never;

class Funnel<P extends IPipeIn<unknown>>
  extends Emitter<__IPipeIn__T<P>>
  implements IPipeOut<__IPipeIn__T<P>>
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

class UFunnel<P extends IPipeOut<unknown>>
  extends Emitter<__IPipeOut__T<P>>
  implements IPipeIn<__IPipeOut__T<P>>
{
  // public out: P | null = null;
  constructor(pipe?: P) {
    super();

    if (pipe) pipe.out = this;

    this.in = this.in.bind(this);
  }
  public in(arg: __IPipeOut__T<P>): __IPipeOut__T<P> {
    this.emit(arg);
    return arg;
  }
}

export {
  IPipe,
  Pipe,
  // ErrorPipe,
  // CatchPipe,
  BasePipe,
  Funnel,
  UFunnel,
  PROCESSORS,
};
