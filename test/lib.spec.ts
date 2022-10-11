import { Emitter } from "../lib/emitter/index.js";
import { pc } from "many-callbacks";

describe(`emitter`, function () {
  it(`should work`, function (callback) {
    const emitter = new Emitter();

    emitter.on((x) => {
      expect(x).to.equal(1);
      callback();
    });

    emitter.emit(1);
  });
  it(`should work with 2 listeners`, async function () {
    const emitter = new Emitter();

    const [p, cb1, cb2] = pc();

    emitter.on((x) => {
      expect(x).to.equal(1);
      cb1();
    });

    emitter.on((x) => {
      expect(x).to.equal(1);
      cb2();
    });

    emitter.emit(1);

    await p;
  });
});
