import { Pipe } from "src/base-components";
import { assert, Equals } from "tsafe";

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
  Equals<
    never,
    Reduce<number, [(x: number) => string | number, (x: number) => number]>
  >
>();

assert<Equals<ValidateTransducers<readonly [Fn]>, readonly [Fn]>>();

type smallestFn = (x: unknown) => never;

assert<
  Equals<ValidateTransducers<readonly [smallestFn]>, readonly [smallestFn]>
>();

function _wat<F extends Fn>(fn: F, name?: string) {
  return new Pipe<readonly [F]>([fn] as const, name);
}
