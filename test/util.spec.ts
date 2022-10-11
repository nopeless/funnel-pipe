import { EitherFactory, then } from "../src/util.js";

describe(`Util`, function () {
  describe(`EitherFactory`, function () {
    const f = EitherFactory((x: number) => {
      if (x === 0) throw new Error(`divide by 0`);
      return 1 / x;
    });
    const g = EitherFactory(async (x: number) => {
      if (x === 0) throw new Error(`divide by 0`);
      return 1 / x;
    });

    it(`Should work (sync)`, function () {
      expect(f(1)[0]).to.equal(1);
      expect(f(1)[1]).to.equal(undefined);

      expect(f(0)[0]).to.equal(undefined);
      expect(f(0)[1]).to.be.an.instanceof(Error);
    });
    it(`Should work (async)`, async function () {
      expect((await g(1))[0]).to.equal(1);
      expect((await g(1))[1]).to.equal(undefined);

      expect((await g(0))[0]).to.equal(undefined);
      expect((await g(0))[1]).to.be.an.instanceof(Error);
    });
  });
  describe(`then`, function () {
    it(`should work`, async function () {
      const f = (x: number) => x + 1;

      expect(then(1, f)).to.equal(2);
      expect(await then(1, async () => 2)).to.equal(2);
      expect(await then(Promise.resolve(1), f)).to.equal(2);
      expect(await then(Promise.resolve(1), () => 2)).to.equal(2);
      expect(await then(Promise.resolve(1), async () => 2)).to.equal(2);
    });
  });
});
