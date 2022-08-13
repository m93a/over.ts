const isWhitespace = (ch: string) => /\s/.test(ch);
const isLetter = (ch: string) => /\p{Letter}/u.test(ch);
const isComma = (ch: string) => ch === ",";
const isArrow = (c1: string, c2: string) => c1 === "-" && c2 === ">";

export function signatureToArgumentGuard(
  typeGuards: Record<string, (x: unknown) => boolean>,
  signature: string
): (args: unknown[]) => boolean {
  const guards: Array<(x: any) => boolean> = [];

  enum ParserState {
    Start,
    BeforeWord,
    Word,
    AfterWord,
    Done,
  }
  let state = ParserState.Start;

  loop: for (let pos = 0; pos < signature.length; ) {
    const ch = signature[pos];
    const ch2 = signature[pos + 1];
    switch (state) {
      case ParserState.Start:
        if (isWhitespace(ch)) pos++;
        else if (isLetter(ch)) state = ParserState.Word;
        else if (isArrow(ch, ch2)) state = ParserState.Done;
        else if (isComma(ch))
          throw new SyntaxError(`Unexpected comma at position ${pos}.`);
        else
          throw new SyntaxError(
            `Unexpected character at position ${pos}: ${ch}`
          );
        break;

      case ParserState.Word:
        const wordStart = pos;
        while (isLetter(signature[pos]) && pos < signature.length) pos++;
        const word = signature.substring(wordStart, pos);
        const guard = typeGuards[word];
        if (guard === undefined)
          throw new TypeError(`Unknown type at position ${pos}:  ${word}`);
        guards.push(guard);
        state = ParserState.AfterWord;
        break;

      case ParserState.AfterWord:
        if (isWhitespace(ch)) pos++;
        else if (isComma(ch)) {
          pos++;
          state = ParserState.BeforeWord;
        } else if (isArrow(ch, ch2)) state = ParserState.Done;
        else if (isLetter(ch))
          throw new SyntaxError(`Unexpected identifier at positon ${pos}.`);
        else
          throw new SyntaxError(
            `Unexpected character at position ${pos}: ${ch}`
          );
        break;

      case ParserState.BeforeWord:
        if (isWhitespace(ch)) pos++;
        else if (isLetter(ch)) state = ParserState.Word;
        else if (isArrow(ch, ch2))
          throw new SyntaxError(
            `Unexpected trailing comma at position ${pos}.`
          );
        else if (isComma(ch))
          throw new SyntaxError(`Duplicit comma at position ${pos}.`);
        else
          throw new SyntaxError(
            `Unexpected character at position ${pos}: ${ch}`
          );
        break;

      case ParserState.Done:
        break loop;
    }
  }
  if (state !== ParserState.Done)
    throw new SyntaxError(`Unexpected end of string, missing return type.`);

  return (args: unknown[]) =>
    args.length <= guards.length && guards.every((g, i) => g(args[i]));
}

export function signatureToReturnGuard(
  typeGuards: Record<string, (x: unknown) => boolean>,
  signature: string
): (args: unknown) => boolean {
  let pos = signature.indexOf("->");
  if (pos === -1)
    throw new SyntaxError("Unexpected end of string, missing return type.");
  pos += 2; // skip to the end of the arrow

  while (isWhitespace(signature[pos])) pos++;
  if (pos === signature.length)
    throw new SyntaxError("Unexpected end of string, missing return type.");

  const word = signature.substring(pos).trimEnd();
  const guard = typeGuards[word];

  if (guard === undefined)
    throw new TypeError(`Unknown type at position ${pos}:  ${word}`);

  return guard;
}
