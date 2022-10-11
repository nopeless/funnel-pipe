function isPromise(v: unknown): v is Promise<unknown> {
  return (
    typeof v === `object` &&
    v !== null &&
    `then` in v &&
    typeof (v as { then: unknown }).then === `function`
  );
}

type AwaitedReturnMonad<F extends Fn> = isAsync<F> extends true
  ? Promise<
      readonly [Awaited<ReturnType<F>>, undefined] | readonly [undefined, Error]
    >
  : readonly [ReturnType<F>, undefined] | readonly [undefined, Error];

/**
 * Monadify a function
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function EitherFactory<F extends (...args: any) => unknown>(
  f: F
): (...args: Parameters<F>) => AwaitedReturnMonad<F> {
  return function (...args: Parameters<F>) {
    try {
      const res = Reflect.apply(f, undefined, args) as ReturnType<F>;
      if (isPromise(res)) {
        return res
          .then((v) => {
            return [v as Awaited<ReturnType<F>>, undefined] as const;
          })
          .catch((e: Error) => {
            return [undefined, e] as const;
          });
      }
      return [res, undefined] as const;
    } catch (e) {
      const rej = e as unknown as Error;
      return [undefined, rej] as const;
    }
  } as (...args: Parameters<F>) => AwaitedReturnMonad<F>;
}

/**
 * Synchronously applies a .then as if a non-promise is a Promise
 * Asynchronously applies a .then as expected
 */
function then<V, R>(
  v: V,
  f: (x: Awaited<V>) => R
): isPromise<V> extends true
  ? Promise<Awaited<R>>
  : isPromise<R> extends true
  ? R
  : R {
  if (isPromise(v)) {
    // This should just work
    // I don't care about type checking that much for this as unit tests will cover anyway
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return v.then(f as any) as any;
  } else {
    // This should also just work
    // We have to assert v is Awaited<V>, which is unnecessary
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return f(v as Awaited<typeof v>) as any;
  }
}

export { isPromise, EitherFactory, then };
