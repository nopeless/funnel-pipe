import { reduce, Funnel, UFunnel, Pipe } from "../src/index.js";

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

describe(`Functions`, function () {
  describe(`reduce (sync)`, function () {
    it(`should pass`, function () {
      const r = reduce(1, rearr);

      expect(r).to.be.true;
    });
  });
  describe(`reduce (async)`, function () {
    it(`should pass (await)`, async function () {
      const r = await reduce(1, rearrAsync);

      expect(r).to.be.true;
    });
    it(`should pass (then callback)`, function (cb) {
      const r = reduce(1, rearrAsync);

      r.then((v) => {
        expect(v).to.be.true;
        cb();
      });
    });
  });
  describe(`Funnel->Pipe->UFunnel`, function () {
    it(`should pass`, function (callback) {
      const pipe = new Pipe(rearr);
      expect(pipe.in(1)).to.be.true;

      // Automatically type inferred
      const funnel = new Funnel(pipe);

      // Supports deferred type inference
      funnel.out = pipe;
      const _funnel = funnel as Funnel<typeof pipe>;

      const ufunnel = new UFunnel(pipe);

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
});
