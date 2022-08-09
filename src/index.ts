
export interface Options {
    checkResult?: boolean;
}

export function useTypes<BaseTypes extends Record<string, unknown>>(
    typeGuards: {
        [K in keyof BaseTypes]: (x: unknown) => x is BaseTypes[K]
    },
    options?: Options,
) {
    type K = string & keyof BaseTypes;

    type ResolveType<T extends K> = BaseTypes[T];

    type ResolveTuple<T> =
        T extends K ? [ResolveType<T>] :
        T extends `${infer L extends K}, ${infer M extends K}` ? [ResolveType<L>, ResolveType<M>] :
        T extends `${infer L extends K}, ${infer M extends K}, ${infer N extends K}` ? [ResolveType<L>, ResolveType<M>, ResolveType<N>] :
        never;

    type ResolveFunction<T> =
        T extends `${infer Args} -> ${infer L extends K}`
        ? (...args: ResolveTuple<Args>) => ResolveType<L>
        : never;

    type UnionToIntersection<U> =
        (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;


    return function typed<T extends string>(
        implementations: { [L in T]: ResolveFunction<L> }
    ): UnionToIntersection<ResolveFunction<T>> {

        // TODO implementation here
        return (() => { throw new Error(); }) as any;
    }
}
