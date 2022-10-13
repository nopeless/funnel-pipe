// eslint-disable-next-line import/extensions
import { reduce } from "../src/index.js";

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

    expect(r).to.be.a.instanceOf(Promise);

    r.then((v) => {
      expect(v).to.be.true;
      cb();
    });
  });
});
