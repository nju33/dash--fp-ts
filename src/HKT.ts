export interface HKT<URI, A> {
  readonly _URI: URI
  readonly _A: A
}

export interface HKT2<URI, L, A> extends HKT<URI, A> {
  readonly _L: L
}

// type-level dictionary for HKTs with one type parameter
export interface URI2HKT<A> {}

export type HKTS = keyof URI2HKT<any>

// type-level dictionary for HKTs with two type parameters
export interface URI2HKT2<L, A> {}

export type HKT2S = keyof URI2HKT2<any, any>
