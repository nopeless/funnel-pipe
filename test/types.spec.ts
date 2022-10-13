import { Pipe } from "src/base-components";
import { assert, Equals } from "tsafe";

describe(`Types`, function () {
  it(`should compile`, function () {
    // passing
    1 + 1;
  });
});

const p = new Pipe([] as const);

assert<isAsync<() => Promise<unknown>>>();
assert<isAsync<(x: number) => Promise<unknown>>>();
assert<isPromise<Promise<unknown>>>();

assert<(() => 1) extends Fn ? true : false>();
assert<((x: number) => void) extends Fn ? true : false>();
assert<((x: number, y: string) => 1) extends Fn ? true : false>();
assert<((x: number | string) => never) extends Fn ? true : false>();

assert<Equals<Param0<(x: number) => void>, number>>();
assert<Equals<Param0<(x: number | string) => void>, number | string>>();
assert<Equals<Param0<() => void>, never>>();

assert<Equals<number, Reduce<number, []>>>();
assert<Equals<number, Reduce<number, [(x: number) => number]>>>();

assert<
  Equals<number, Reduce<number, [(x: number) => string, (x: string) => number]>>
>();

assert<
  Equals<
    number,
    Reduce<number, [(x: number) => string, (x: number | string) => number]>
  >
>();

assert<
  ((x: number) => number) extends (x: number) => string | number ? true : false
>();

assert<
  ((x: number | string) => number) extends (x: number) => number ? true : false
>();

assert<Equals<never, Reduce<number | string, [(x: number) => number]>>>();

type a2 = Reduce<
  number,
  readonly [(x: number) => string | number, (x: number) => number]
>;

assert<Equals<never, a2>>();

type a3 = Reduce<
  number,
  readonly [
    (x: number) => string | number,
    (x: number | string) => Promise<number>
  ]
>;

assert<Equals<Promise<number>, a3>>();

type a4 = Reduce<
  number,
  readonly [
    (x: number) => Promise<string | number>,
    (x: number | string) => Promise<number>
  ]
>;

assert<Equals<Promise<number>, a4>>();

assert<Equals<ValidateTransducers<readonly [Fn]>, readonly [Fn]>>();

type smallestFn = (x: unknown) => never;

assert<
  Equals<ValidateTransducers<readonly [smallestFn]>, readonly [smallestFn]>
>();

const arr1 = [1, 2, 3] as const;
const [, ...b] = arr1;
type btype = typeof b;
assert<Equals<[2, 3], btype>>();

function _f1<F extends Fn>() {
  assert<F extends (x: Param0<F>) => unknown ? true : false>();
  // Why does the below error?
  assert<
    readonly [F] extends readonly [(x: Param0<F>) => unknown] ? true : false
  >();
}
