import { Param0, Equals } from "tsafe";

type ShouldEqual<T, U> = T extends U ? (U extends T ? T : never) : never;

// class Funnel<T, T | K> {
//   public middlewares: [(_: T) => T];
//   public collector: (_: T) => K;
//   constructor({
//     middlewares,
//     collector,
//   }: {
//     middlewares: [(_: T) => T];
//     collector?: (_: T) => K;
//   }) {
//     this.middlewares = middlewares;
//     this.collector = collector ?? ((x: T) => x);
//   }
// }

const t = [
  (_: number) => ``,
  (_: string) => true,
  (_: boolean) => new Date(),
] as const;

// type Walk<In, Arr> = Arr extends [infer FirstFunc, ...infer R]
//   ? FirstFunc extends (x: In) => infer Out
//     ? R extends []
//       ? Out
//       : Walk<Out, R>
//     : 1
//   : Arr;

type InvalidFunction = never;

type Chainable<Arr extends readonly unknown[]> = Arr extends readonly []
  ? Arr
  : Equals<Reduce<unknown, Arr>, never> extends true
  ? Arr
  : never;

// type Accepts<T> = T extends unknown ? [(_: T) => unknown] : never;
// type Accepts<T, R extends []> =
//   | readonly [(_: T) => unknown, ...R]
//   | readonly [];

// function reduce<T, R extends readonly []>(v: T, arr: R): T;
// function reduce<T, R extends readonly [] | Accepts<T, Tail<R>>(
//   v: T,
//   arr: R
// ): Reduce<T, R> {
//   if (arr.length === 0) return v as Reduce<T, R>;
//   const [first, ...rest] = arr;
//   type ret = ReturnType<typeof first>;
//   type red = readonly [typeof first];
//   return reduce<ret>(first(v), rest);
//   // return reduce<ReturnType<typeof arr[0]>, Tail<R>>(first(v), rest);
// }

type Reduce<In, Arr> = Arr extends readonly []
  ? In
  : Arr extends readonly [infer FirstFunc, ...infer R]
  ? FirstFunc extends (x: In) => infer Out
    ? R extends readonly []
      ? Out
      : Reduce<Out, R>
    : never
  : never;

function reduce<In, Arr extends readonly unknown[]>(
  x: In,
  arr: Equals<Arr, Chainable<Arr>> extends true ? Arr : never
): Reduce<In, Arr> {
  const [first, ...rest] = arr;
  if (first === undefined) return x as Reduce<In, Arr>;

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return reduce(first(x), rest) as Reduce<In, Arr>;
}

// function reduce<T, R extends readonly []>(v: T, arr: R): T;
// function reduce<T, R extends readonly [(x: T) => unknown, ...Tail<R>]>(
//   v: T,
//   arr: R
// ) {
//   if (arr.length === 0) return v;
//   const [first, ...rest] = arr;
//   if (first === undefined) throw new Error(`This error is impossible`);
//   if (rest.length === 0) return first(v);
//   const rr = rest as Tail<R>;
//   return reduce<ReturnType<typeof first>, Tail<R>>(first(v), rr);
// }

// function fold<T, R extends readonly []>(x: T, arr: R): T;
// function fold<T, R extends readonly [T]>(x: T, arr: R): T;
// function fold<T, R extends readonly [] | readonly [T, ...Tail<R>]>(
//   x: T,
//   [first, ...rest]: R
// ): T {
//   // const [first, ...rest] = arr;
//   if (first === undefined || first === null) return x;
//   if (rest.length === 0) return first;
//   const rr = rest as Tail<R>;
//   return fold<T, typeof rr>(first, rr);
// }

// function fold<T, R>(
//   x: T,
//   arr: R extends readonly [...infer Init, infer Last] ? R : never
// ) {
//   const [last, init] = [arr.pop(), ...arr];
// }

const foldl = <A, B>(f: (x: A, acc: B) => B, acc: B, [h, ...t]: A[]): B =>
  h === undefined ? acc : foldl(f, f(h, acc), t);

// function fl<A,B>(v: T, arr:)

type r = Reduce<number, typeof t>;
// type rx = Chainable<typeof t>;
const res = reduce(1, t);
type r2 = typeof t[0];

const r = reduce(1, [(x: number) => x + 1, (x: number) => x + 2] as const);

const arr = [] as const;
type Zero<A extends readonly unknown[]> = A[0];
type r3 = Zero<typeof arr>;

type Tail<V> = V extends readonly []
  ? readonly []
  : V extends readonly [infer _]
  ? readonly []
  : V extends readonly [infer _, ...infer B]
  ? B
  : never;

const cd = [] as const;
type ro = Readonly<[]>;
type r10 = Tail<ro>;

type r4 = Tail<typeof cd>;

interface IFunnel<T, K> {
  middlewares: [(_: T) => T];
  collector: (_: T) => K;
}

class Funnel<T, K = T> implements IFunnel<T, K> {
  middlewares: [(_: T) => T];
  collector: (_: T) => K;
  constructor(
    options:
      | {
          middlewares: [(_: T) => T];
        }
      | {
          middlewares: [(_: T) => T];
          collector: (_: T) => K;
        }
  ) {
    this.middlewares = options.middlewares;
    if (`collector` in options) {
      this.collector = options.collector;
    } else {
      this.collector = (x: T) => x as ShouldEqual<K, T>;
    }
  }
}

const funnel1 = new Funnel({
  middlewares: [(x: number) => x],
  collector: (x: number) => x.toString(),
});

const funnel2 = new Funnel({
  middlewares: [(x: number) => x],
});
