import { reduce, reduceSync, Funnel, UFunnel, Pipe } from "../src/index.js";

const rearr = [
  (x: number) => x === 1,
  (x: boolean) => (x ? 1 : 0) + 2,
  (x: number) => (x === 3 ? `` : `false`),
  (x: string) => x.length === 0,
] as const;

describe(`Functions`, function () {
  describe(`reduceSync`, function () {
    it(`should pass`, function () {
      const r = reduceSync(1, rearr);

      expect(r).to.be.true;
    });
  });
  describe(`reduce`, function () {
    it(`should pass`, async function () {
      const r = await reduce(1, rearr);

      expect(r).to.be.true;
    });
  });
  describe(`Funnel->Pipe->UFunnel`, function () {
    it(`should pass`, function (callback) {
      const pipe = new Pipe(rearr);

      // Automatically type inferred
      const funnel = new Funnel(pipe);
      const ufunnel = new UFunnel(pipe);

      // Add a listener
      ufunnel.on((x) => {
        expect(x).to.be.true;
        callback();
      });

      // Insert item from the top of the funnel
      funnel.emit(1);

      // You can also call pipes directly
      // expect(pipe.call(1)).to.be.true;
    });
  });
});
