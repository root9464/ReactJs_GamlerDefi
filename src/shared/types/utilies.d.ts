/* eslint-disable @typescript-eslint/no-explicit-any */
export type Mask<Keys extends PropertyKey> = {
  [K in Keys]?: true;
};
export type Flatten<T> = Identity<{
  [k in keyof T]: T[k];
}>;
export type Identity<T> = T;
export type SomeObject = Record<PropertyKey, any>;

export type Extend<A extends SomeObject, B extends SomeObject> = Flatten<
  keyof A & keyof B extends never
    ? A & B
    : {
        [K in keyof A as K extends keyof B ? never : K]: A[K];
      } & {
        [K in keyof B]: B[K];
      }
>;
