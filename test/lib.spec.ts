import { Emitter } from "../lib/emitter/index.js";

describe(`emitter`, function () {
  it(`should work`, function (callback) {
    const emitter = new Emitter();

    emitter.on((x) => {
      expect(x).to.equal(1);
      callback();
    });

    emitter.emit(1);
  });
});
