import { Equals } from "tsafe";
import { Chainable, Reduce } from "./global.js";

/**
 * Reduces the array using initial value recursively
 */
async function reduce<In, Arr extends readonly unknown[]>(
  x: In,
  arr: Equals<Arr, Chainable<Arr>> extends true ? Arr : never
): Promise<Reduce<In, Arr>> {
  const [first, ...rest] = arr;
  if (first === undefined) return x as Reduce<In, Arr>;

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return reduce(await first(x), rest) as Reduce<In, Arr>;
}

/**
 * Reduces the array using initial value recursively
 */

function reduceSync<In, Arr extends readonly unknown[]>(
  x: In,
  arr: Equals<Arr, Chainable<Arr>> extends true ? Arr : never
): Reduce<In, Arr> {
  const [first, ...rest] = arr;
  if (first === undefined) return x as Reduce<In, Arr>;

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return reduceSync(first(x), rest) as Reduce<In, Arr>;
}

export { reduce, reduceSync };
