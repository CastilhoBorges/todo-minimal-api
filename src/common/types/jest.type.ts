export type ProviderTest<
  T extends Record<string, new (...args: any[]) => any>,
> = {
  [K in keyof T]: InstanceType<T[K]>;
};
