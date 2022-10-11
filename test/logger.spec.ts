import { BasePipe, Pipe } from "../src/index.js";
import { Message } from "./fixtures/index.js";

class Logger<T> extends BasePipe<T, void> {
  constructor(logger: (x: T) => void) {
    super([logger]);
  }
}

class MessageLength<T extends Message> extends BasePipe<T, number> {
  constructor() {
    super([(x) => x.message.length]);
  }
}

describe(`Logger class`, function () {
  it(`using .out`, function () {
    const spy = chai.spy();
    const messageLength = new MessageLength();
    const logger = new Logger<number>(spy);
    messageLength.out = logger;
    messageLength.in(new Message(`Hello World!`));
    expect(spy).to.have.been.called.with(12);
  });
  it(`using 'fn' chaining`, function () {
    const spy = chai.spy();
    const messageLength = new MessageLength();
    const logger = new Logger<number>(spy);
    messageLength.out = logger;

    const p = new Pipe([messageLength.fn, logger.fn] as const);

    p.in(new Message(`Hello World!`));
    expect(spy).to.have.been.called.with(12);
  });
  it(`add numbers`, function () {
    const spy = chai.spy();
    const logger = new Logger<number>(spy);
    const add2 = Pipe.Fn((x: number) => x + 2);
    add2.out = logger;
    add2.in(1);
    expect(spy).to.have.been.called.with(3);
  });
});
