import { signatureToArgumentGuard, signatureToReturnGuard } from "./parser";

export interface Options {
    checkResult?: boolean;
    allowSuperfluousArguments: boolean;
}

export function useTypes<BaseTypes extends Record<string, unknown>>(
    typeGuards: {
        [K in keyof BaseTypes]: (x: unknown) => x is BaseTypes[K]
    },
    options?: Partial<Options>,
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


    const { checkResult, allowSuperfluousArguments } = options ?? {};

    return function typed<T extends string>(
        implementations: { [L in T]: ResolveFunction<L> }
    ): UnionToIntersection<ResolveFunction<T>> {

        const signatures = Object.keys(implementations);
        const argsGuards = signatures.map(s => signatureToArgumentGuard(typeGuards, s, allowSuperfluousArguments));
        let impls = signatures.map<(...a: any[]) => any>(s => implementations[s]);

        if (checkResult) {
            const resultGuards = signatures.map(s => signatureToReturnGuard(typeGuards, s));
            impls = impls.map((f, i) => (...a: any[]) => {
                const result = f(...a);
                if (resultGuards[i](result)) return result;
                else throw new TypeError("Internal error – the returned value did not match the expected type.");
            });
        }

        return <any>((...a: any[]) => {
            const i = argsGuards.findIndex(g => g(a));
            if (i !== -1) return impls[i](...a);
            else throw new TypeError("The provided arguments did not match any supported signature.");
        });
    }
}
