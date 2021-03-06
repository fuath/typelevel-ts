import {
  AnyTuple,
  Equals,
  Exact,
  Omit,
  Overwrite,
  Diff,
  RowLacks,
  DeepReadonly,
  KeysOfType,
  TaggedUnionMember,
  RequiredKeys,
  OptionalKeys
} from '../src'

//
// Equals
//

type Equals1 = Equals<string, string> // $ExpectType "T"
type Equals2 = Equals<string, number> // $ExpectType "F"
type Equals3 = Equals<'a' | 'b', 'a' | 'b'> // $ExpectType "T"
type Equals4 = Equals<'a' | 'b', 'a' | 'c'> // $ExpectType "F"
type Equals5 = Equals<Array<string>, Array<string>> // $ExpectType "T"
type Equals6 = Equals<Array<string>, Array<number>> // $ExpectType "F"
type Equals7 = Equals<any[], [number][]> // $ExpectType "F"
type Equals8 = Equals<any[], unknown[]> // $ExpectType "F"
type Equals9 = Equals<Map<number, any>, Map<any, number>> // $ExpectType "F"
type Equals10 = Equals<{ a: string } & { b: number }, { a: string; b: number }> // $ExpectType "T"

//
// Omit
//

type Omit1 = Equals<Omit<{ a: string; b: number }, 'a'>, { b: number }> // $ExpectType "T"
type Omit2 = Equals<Omit<{ a: string; b: number }, 'a' | 'b'>, {}> // $ExpectType "T"
type Omit3 = Equals<Omit<{ a: string; b: number }, 'a' | 'c'>, { b: number }> // $ExpectType "T"

//
// Overwrite
//

type Overwrite1 = Equals<Overwrite<{ a: string; b: number }, { b: boolean }>, { a: string; b: boolean }> // $ExpectType "T"
type Overwrite2 = Equals<Overwrite<{ a: string }, { b: boolean }>, { a: string; b: boolean }> // $ExpectType "T"
type Overwrite3 = Equals<Overwrite<{ a: string; b: number }, { b?: boolean }>, { a: string; b?: boolean }> // $ExpectType "T"

//
// Diff
//

type Diff1 = Equals<Diff<{ a: string; b: number }, 'b'>, { a: string; b?: number }> // $ExpectType "T"

//
// RowLacks
//

declare function rowlacks1(x: RowLacks<{ a: string; b: number }, 'a'>): void
// $ExpectError
rowlacks1({ a: 'foo', b: 1 })
declare function rowlacks2(x: RowLacks<{ a: string; b: number }, 'c'>): void
rowlacks2({ a: 'foo', b: 1 })

//
// Exact
//

declare function exactf1<T extends Exact<{ a: string }, T>>(a: T): void
declare const exact1: { a: string }
declare const exact2: { a: string; b: number }
declare const exact3: { a: string; b: any }
exactf1(exact1)
// $ExpectError
exactf1(exact2)
// $ExpectError
exactf1(exact3)

//
// KeysOfType
//
type KeysOfType1 = Equals<KeysOfType<{ a: string; b: never }, never>, 'b'> // $ExpectType "T"
type KeysOfType2 = Equals<KeysOfType<{ a: string; b: string }, string>, 'a' | 'b'> // $ExpectType "T"
type KeysOfType3 = Equals<KeysOfType<{ a: string; b: string | boolean }, string>, 'a'> // $ExpectType "T"
type KeysOfType4 = Equals<KeysOfType<{ a: string; b?: string }, string>, 'a'> // $ExpectType "T"

//
// AnyTuple
//

declare function anytuplef1<T extends AnyTuple>(x: T): T
declare const anytuple1: [number]
declare const anytuple2: [number, string]
declare const anytuple3: [number, string, boolean]
declare const anytuple4: Array<number>
anytuplef1(anytuple1)
anytuplef1(anytuple2)
anytuplef1(anytuple3)
// $ExpectError
anytuplef1(anytuple4)

//
// DeepReadonly
//

interface Foo {
  bar: {
    baz: string
    quux: Array<{ barbaz: number }>
  }
}

type ReadonlyFoo = DeepReadonly<Foo>
type DeepReadonly1 = ReadonlyFoo['bar'] // $ExpectType DeepReadonlyObject<{ baz: string; quux: { barbaz: number; }[]; }>
type DeepReadonly2 = ReadonlyFoo['bar']['quux'] // $ExpectType DeepReadonlyArray<{ barbaz: number; }>
type DeepReadonly3 = ReadonlyFoo['bar']['quux'][number] // $ExpectType DeepReadonlyObject<{ barbaz: number; }>
declare const readonly1: ReadonlyFoo
// $ExpectError
readonly1.bar.quux[1].barbaz = 1

//
// TaggedUnionMember
//

type TaggedUnionMemberA = { tag: 'A'; a: string }
type TaggedUnionMemberB = { tag: 'B'; b: number }
type TaggedUnionMemberC = TaggedUnionMemberA | TaggedUnionMemberB
type TaggedUnionMember1 = Equals<TaggedUnionMember<TaggedUnionMemberC, 'tag', 'A'>, TaggedUnionMemberA> // $ExpectType "T"

//
// RequiredKeys
//

type BarForRequired = {
  a: number
  b: Date
  x?: string
  y?: Date
}

type BarRequiredKeys = RequiredKeys<BarForRequired> // $ExpectType "a" | "b"
type RequiredKeysIndexSignature = RequiredKeys<{ [x: string]: any; a: number; b: Date; x?: string; y?: Date }> // $ExpectType "a" | "b"
type RequiredKeysEmpty = RequiredKeys<{}> // $ExpectType never

//
// OptionalKeys
//

type BarForOptional = {
  a: number
  b: Date
  x?: string
  y?: Date
}

type BarOptionalKeys = OptionalKeys<BarForOptional> // $ExpectType "x" | "y"
type OptionalKeysIndexSignature = OptionalKeys<{ [x: string]: any; a: number; b: Date; x?: string; y?: Date }> // $ExpectType "x" | "y"
type OptionalKeysEmpty = OptionalKeys<{}> // $ExpectType never
