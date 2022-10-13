import {
  reduce,
  Funnel,
  UFunnel,
  Pipe,
  // ErrorPipe,
  // CatchPipe,
  // PROCESSORS,
} from "../src/index.js";
import { Message } from "./fixtures/monads.js";

const rearr = [
  (x: number) => x === 1,
  (x: boolean) => (x ? 1 : 0) + 2,
  (x: number) => (x === 3 ? `` : `false`),
  (x: string) => x.length === 0,
] as const;

const rearrAsync = [
  async (x: number) => x === 1,
  async (x: boolean) => (x ? 1 : 0) + 2,
  async (x: number) => (x === 3 ? `` : `false`),
  async (x: string) => x.length === 0,
] as const;

describe(`main example`, function () {
  it(`should work`, async function () {
    const d = [
      async (x: number) => (x === 1 ? `` : false),
      (x: boolean | string) => (x ? 1 : 0) + 2,
      async (x: number) => (x === 3 ? `` : `false`),
      (x: string) => x.length === 0,
    ] as const;
    const pipe = new Pipe(d);

    const res = pipe.in(3);
    typeof res; // Promise
    const resolved = await res;
    typeof resolved;

    const pipe1 = Pipe.Fn((x: number) => x);

    type j = typeof pipe1 extends Pipe<infer R> ? R[0] : never;

    expect(pipe1.in(1)).to.equal(1);
  });
});

describe(`Library`, function () {
  describe(`Funnel->Pipe->UFunnel`, function () {
    it(`should pass`, function (callback) {
      const pipe = new Pipe(rearr);
      expect(pipe.in(1)).to.be.true;

      // Automatically type inferred
      const funnel = new Funnel(pipe);

      const ufunnel = new UFunnel(pipe);

      pipe.out = ufunnel;

      // Add a listener
      ufunnel.once((x) => {
        expect(x).to.be.true;
        callback();
      });

      // Insert item from the top of the funnel
      funnel.emit(1);

      // You can also call pipes
      expect(pipe.in(1)).to.be.true;

      // Intuitively and by definition, the .out property is equal to the pipe
      expect(funnel.out).to.equal(pipe);

      // Typescript automatically picks up properties for nested outs
      expect(funnel.out && funnel.out.out).to.equal(ufunnel);
    });
    it(`should pass (await)`, async function () {
      const pipe = new Pipe(rearrAsync);

      // Automatically type inferred
      const funnel = new Funnel(pipe);
      const ufunnel = new UFunnel(pipe);

      let resolve: null | ((v?: unknown) => void) = null;
      const expectPromise = new Promise((r) => {
        resolve = r;
      });

      // Add a listener
      ufunnel.once((x) => {
        expect(x).to.be.true;
        resolve && resolve();
      });

      // Insert item from the top of the funnel
      funnel.emit(1);

      await Promise.all([
        expectPromise,
        // You can also call pipes
        pipe.in(1).then((v) => expect(v).to.be.true),
      ]);
    });
  });
  /*
  describe(`ErrorPipe`, function () {
    it(`instanciate with array`, function () {
      const spy = chai.spy((_e: Error) => 0);

      const e = new Error(`error`);

      const epipe = new ErrorPipe(
        [
          (x: number) => x === 1,
          (x: boolean) => {
            if (x) {
              throw e;
            }
            return 3;
          },
        ] as const,
        42
      );

      expect(epipe.in(2)).to.equal(3);
      epipe.error = Pipe.Fn(spy);
      expect(epipe.in(1)).to.equal(42);
      expect(spy).to.have.been.called.with(e);
    });
    it(`instanciate with pipe`, function () {
      const spy = chai.spy((_e: Error) => 0);

      const e = new Error(`error`);

      const epipe = new ErrorPipe(
        new Pipe([
          (x: number) => x === 1,
          (x: boolean) => {
            if (x) {
              throw e;
            }
            return 3;
          },
        ] as const),
        42
      );

      expect(epipe.in(2)).to.equal(3);
      epipe.error = Pipe.Fn(spy);
      expect(epipe.in(1)).to.equal(42);
      expect(spy).to.have.been.called.with(e);
    });
  });
  describe(`CatchPipe`, function () {
    it(`instanciate with array`, function () {
      const spy = chai.spy((ee: Error) => {
        if (ee === e) {
          return `ok`;
        }
        return `not ok`;
      });

      const e = new Error(`error`);

      const epipe = new CatchPipe(
        [
          (x: number) => x + 1,
          (x: number) => {
            if (x === 1) {
              throw e;
            } else if (x === 2) {
              throw new Error(`unknown error`);
            }
            return `final`;
          },
        ] as const,
        spy
      );

      expect(epipe.in(2)).to.equal(`final`);
      expect(epipe.in(1)).to.equal(`not ok`);
      expect(epipe.in(0)).to.equal(`ok`);
      expect(spy).to.have.been.called.with(e);
    });
    it(`instanciate with pipe`, function () {
      const spy = chai.spy((ee: Error) => {
        if (ee === e) {
          return `ok`;
        }
        return `not ok`;
      });

      const e = new Error(`error`);

      const epipe = new CatchPipe(
        new Pipe([
          (x: number) => x + 1,
          (x: number) => {
            if (x === 1) {
              throw e;
            } else if (x === 2) {
              throw new Error(`unknown error`);
            }
            return `final`;
          },
        ] as const),
        spy
      );

      expect(epipe.in(2)).to.equal(`final`);
      expect(epipe.in(1)).to.equal(`not ok`);
      expect(epipe.in(0)).to.equal(`ok`);
      expect(spy).to.have.been.called.with(e);
    });
  });
  describe(`Monad processing logging`, function () {
    it(`should work`, function () {
      const input = new Message(`You suck`);

      const trollPipe = new Pipe(
        [
          Pipe.Fn((m: Message) => {
            m.message = m.message.toUpperCase();
            return m;
          }, `UpperCase`).fn,
          Pipe.Fn((m: Message) => {
            m.message = `${m.message}!!!`;
            return m;
          }, `Shout!`).fn,
        ] as const,
        `trollPipe`
      );

      const addDisclaimer = new Pipe(
        [
          Pipe.Fn((m: Message) => {
            m.message = `<The following is a prank> ${m.message}`;
            return m;
          }, `Add fancy flairs`).fn,
          Pipe.Fn((m: Message) => {
            m.message = `${m.message} (JK its just a prank)`;
            return m;
          }, `Say its a prank`).fn,
        ] as const,
        `Add disclaimer`
      );

      const troll = new Pipe(
        [trollPipe.fn, addDisclaimer.fn] as const,
        `You've been trolled`
      );

      const res = troll.in(input);

      expect(res.message).to.equal(
        `<The following is a prank> YOU SUCK!!! (JK its just a prank)`
      );

      console.log((res as any)[PROCESSORS]);
    });
  });
  */
});
