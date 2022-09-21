import { DPipe, IPipeIn, IPipeOut } from "./global.js";

class IntervalProducer<T> implements IPipeOut<T> {
  public out: IPipeIn<T> | null = null;
  public readonly interval: ReturnType<typeof setInterval>;
  protected counter = 0;
  constructor(func: (counter?: number) => T, interval: number) {
    this.interval = setInterval(() => {
      if (this.out) this.out.in(func(this.counter++));
    }, interval);
  }
}

// class Tank<T> implements DPipe<T> {
//   public out: IPipeIn<T> | null = null;
//   public in(x: T): void {}
// }

export { IntervalProducer };
