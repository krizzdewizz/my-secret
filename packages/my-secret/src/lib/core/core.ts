export type OrThrow<T> = { orThrow: <T>(msg?: string) => T };
export type Success<T> = { outcome: 'ok'; value: T } & OrThrow<T>;
export type Failure = {
  outcome: 'error';
  error: any;
  value: never;
} & OrThrow<never>;
export type FailureWithMoreInfo<T> = {
  outcome: 'error';
  error: string;
  value: never;
  moreInfo: T;
} & OrThrow<never>;
export type Result<T> = Success<T> | Failure;

export const ok = <T>(value: T): Success<T> => ({
  outcome: 'ok',
  value,
  orThrow: () => value as unknown as any
});

export const error = <T, V = unknown>(
  error: string,
  moreInfo?: V
): FailureWithMoreInfo<V> => {
  return new (class {
    readonly outcome = 'error';
    readonly error = error;
    readonly moreInfo = moreInfo as unknown as any;

    get value(): never {
      throw new Error('an error does not have a value');
    }

    orThrow(msg?: string): never {
      throw new Error(msg || this.error);
    }
  })();
};
