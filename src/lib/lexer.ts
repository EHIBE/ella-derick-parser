import type { Language } from './diagnostics';
import { createDiagnostic } from './diagnostics';
import type { Diagnostic } from './diagnostics';

export type TokenType =
  | 'Keyword'
  | 'Type'
  | 'Identifier'
  | 'Variable'
  | 'Number'
  | 'StringLiteral'
  | 'Operator'
  | 'Punctuation'
  | 'Comment'
  | 'Newline'
  | 'Indent'
  | 'Dedent'
  | 'PhpOpenTag'
  | 'PhpCloseTag'
  | 'Unknown';

export type Token = {
  type: TokenType;
  value: string;
  line: number;
  column: number;
};

export type LexResult = {
  tokens: Token[];
  diagnostics: Diagnostic[];
};

const CPP_KEYWORDS = new Set([
  'if',
  'else',
  'for',
  'while',
  'return',
  'true',
  'false',
  'nullptr'
]);

const CPP_TYPES = new Set([
  'int',
  'bool',
  'char',
  'string',
  'vector',
  'unordered_map',
  'stack',
  'void',
  'float',
  'double'
]);

const PHP_KEYWORDS = new Set([
  'if',
  'else',
  'elseif',
  'foreach',
  'for',
  'while',
  'return',
  'function',
  'true',
  'false',
  'null',
  'as'
]);

const PHP_TYPES = new Set([
  'int',
  'bool',
  'string',
  'float',
  'array',
  'void'
]);

const PYTHON_KEYWORDS = new Set([
  'def',
  'if',
  'elif',
  'else',
  'for',
  'while',
  'return',
  'in',
  'not',
  'and',
  'or',
  'is',
  'True',
  'False',
  'None'
]);

const PYTHON_TYPES = new Set([
  'int',
  'bool',
  'str',
  'float',
  'list',
  'dict',
  'set',
  'tuple'
]);

const MULTI_CHAR_OPERATORS = [
  '===',
  '!==',
  '==',
  '!=',
  '<=',
  '>=',
  '&&',
  '||',
  '->',
  '=>',
  '::',
  '+=',
  '-=',
  '*=',
  '/=',
  '%=',
  '++',
  '--'
];

const SINGLE_CHAR_OPERATORS = new Set([
  '+',
  '-',
  '*',
  '/',
  '%',
  '<',
  '>',
  '=',
  '!',
  '&',
  '|',
  ':',
  '?'
]);

const PUNCTUATIONS = new Set([
  ';',
  ',',
  '.',
  '(',
  ')',
  '{',
  '}',
  '[',
  ']'
]);

function isDigit(char: string): boolean {
  return /[0-9]/.test(char);
}

function isIdentifierStart(char: string, lang: Language): boolean {
  if (lang === 'php') {
    return /[a-zA-Z_$]/.test(char);
  }

  return /[a-zA-Z_]/.test(char);
}

function isIdentifierPart(char: string, lang: Language): boolean {
  if (lang === 'php') {
    return /[a-zA-Z0-9_$]/.test(char);
  }

  return /[a-zA-Z0-9_]/.test(char);
}

function resolveWordType(word: string, lang: Language): TokenType {
  if (lang === 'cpp') {
    if (CPP_TYPES.has(word)) {
      return 'Type';
    }

    if (CPP_KEYWORDS.has(word)) {
      return 'Keyword';
    }

    return 'Identifier';
  }

  if (lang === 'php') {
    if (word.startsWith('$')) {
      return 'Variable';
    }

    if (PHP_TYPES.has(word)) {
      return 'Type';
    }

    if (PHP_KEYWORDS.has(word)) {
      return 'Keyword';
    }

    return 'Identifier';
  }

  if (PYTHON_TYPES.has(word)) {
    return 'Type';
  }

  if (PYTHON_KEYWORDS.has(word)) {
    return 'Keyword';
  }

  return 'Identifier';
}

export function tokenize(input: string, lang: Language): LexResult {
  const tokens: Token[] = [];
  const diagnostics: Diagnostic[] = [];

  let cursor = 0;
  let line = 1;
  let column = 1;

  const indentStack: number[] = [0];
  let atLineStart = true;

  function pushToken(type: TokenType, value: string, tokenLine = line, tokenColumn = column): void {
    tokens.push({
      type,
      value,
      line: tokenLine,
      column: tokenColumn
    });
  }

  function advance(count = 1): void {
    for (let i = 0; i < count; i++) {
      if (input[cursor] === '\n') {
        line++;
        column = 1;
        atLineStart = true;
      } else {
        column++;
      }

      cursor++;
    }
  }

  while (cursor < input.length) {
    const char = input[cursor];

    if (atLineStart && lang === 'python') {
      let spaces = 0;
      let tabs = 0;
      const startColumn = column;

      while (cursor < input.length && (input[cursor] === ' ' || input[cursor] === '\t')) {
        if (input[cursor] === ' ') {
          spaces++;
        } else {
          tabs++;
        }

        advance();
      }

      const nextChar = input[cursor];

      if (nextChar === '\n' || nextChar === '#' || nextChar === undefined) {
        //
      } else {
        if (tabs > 0) {
          diagnostics.push(
            createDiagnostic(
              'Style Warning',
              'warning',
              'Python indentation should use spaces consistently, not tabs.',
              line,
              startColumn
            )
          );
        }

        if (spaces % 4 !== 0) {
          diagnostics.push(
            createDiagnostic(
              'Syntax Error',
              'error',
              'Python indentation is not a multiple of 4 spaces.',
              line,
              startColumn
            )
          );
        }

        const currentIndent = indentStack[indentStack.length - 1];
        if (spaces > currentIndent) {
          indentStack.push(spaces);
          pushToken('Indent', '<INDENT>', line, startColumn);
        } else if (spaces < currentIndent) {
          while (indentStack.length > 1 && spaces < indentStack[indentStack.length - 1]) {
            indentStack.pop();
            pushToken('Dedent', '<DEDENT>', line, startColumn);
          }

          if (spaces !== indentStack[indentStack.length - 1]) {
            diagnostics.push(
              createDiagnostic(
                'Syntax Error',
                'error',
                'Python dedent does not match any outer indentation level.',
                line,
                startColumn
              )
            );
          }
        }
      }

      atLineStart = false;
      continue;
    }

    if (char === '\r') {
      advance();
      continue;
    }

    if (char === '\n') {
      pushToken('Newline', '\\n', line, column);
      advance();
      continue;
    }

    if (/\s/.test(char)) {
      atLineStart = false;
      advance();
      continue;
    }

    if (lang === 'php' && input.slice(cursor, cursor + 5) === '<?php') {
      pushToken('PhpOpenTag', '<?php', line, column);
      advance(5);
      atLineStart = false;
      continue;
    }

    if (lang === 'php' && input.slice(cursor, cursor + 2) === '?>') {
      pushToken('PhpCloseTag', '?>', line, column);
      advance(2);
      atLineStart = false;
      continue;
    }

    if (lang === 'cpp' && input.slice(cursor, cursor + 2) === '//') {
      const startLine = line;
      const startColumn = column;
      let value = '';

      while (cursor < input.length && input[cursor] !== '\n') {
        value += input[cursor];
        advance();
      }

      pushToken('Comment', value, startLine, startColumn);
      atLineStart = false;
      continue;
    }

    if ((lang === 'cpp' || lang === 'php') && input.slice(cursor, cursor + 2) === '/*') {
      const startLine = line;
      const startColumn = column;
      let value = '/*';
      advance(2);

      let closed = false;
      while (cursor < input.length) {
        if (input.slice(cursor, cursor + 2) === '*/') {
          value += '*/';
          advance(2);
          closed = true;
          break;
        }

        value += input[cursor];
        advance();
      }

      if (!closed) {
        diagnostics.push(
          createDiagnostic(
            'Lexical Error',
            'error',
            'Unterminated block comment.',
            startLine,
            startColumn
          )
        );
      }

      pushToken('Comment', value, startLine, startColumn);
      atLineStart = false;
      continue;
    }

    if (lang === 'python' && char === '#') {
      const startLine = line;
      const startColumn = column;
      let value = '';

      while (cursor < input.length && input[cursor] !== '\n') {
        value += input[cursor];
        advance();
      }

      pushToken('Comment', value, startLine, startColumn);
      atLineStart = false;
      continue;
    }

    if (char === '"' || char === '\'') {
      const quote = char;
      const startLine = line;
      const startColumn = column;
      let value = quote;
      advance();

      let escaped = false;
      let terminated = false;

      while (cursor < input.length) {
        const current = input[cursor];

        if (!escaped && current === '\n') {
          break;
        }

        value += current;

        if (escaped) {
          escaped = false;
          advance();
          continue;
        }

        if (current === '\\') {
          escaped = true;
          advance();
          continue;
        }

        if (current === quote) {
          terminated = true;
          advance();
          break;
        }

        advance();
      }

      if (!terminated) {
        diagnostics.push(
          createDiagnostic(
            'Lexical Error',
            'error',
            'Unterminated string literal.',
            startLine,
            startColumn
          )
        );
      }

      pushToken('StringLiteral', value, startLine, startColumn);
      atLineStart = false;
      continue;
    }

    if (isDigit(char)) {
      const startLine = line;
      const startColumn = column;
      let value = '';
      let dotCount = 0;

      while (cursor < input.length && /[0-9.]/.test(input[cursor])) {
        if (input[cursor] === '.') {
          dotCount++;
        }

        value += input[cursor];
        advance();
      }

      if (dotCount > 1) {
        diagnostics.push(
          createDiagnostic(
            'Lexical Error',
            'error',
            `Invalid number literal '${value}'.`,
            startLine,
            startColumn
          )
        );
      }

      pushToken('Number', value, startLine, startColumn);
      atLineStart = false;
      continue;
    }

    const matchedOperator = MULTI_CHAR_OPERATORS.find(operator =>
      input.slice(cursor, cursor + operator.length) === operator
    );

    if (matchedOperator) {
      pushToken('Operator', matchedOperator, line, column);
      advance(matchedOperator.length);
      atLineStart = false;
      continue;
    }

    if (SINGLE_CHAR_OPERATORS.has(char)) {
      pushToken('Operator', char, line, column);
      advance();
      atLineStart = false;
      continue;
    }

    if (PUNCTUATIONS.has(char)) {
      pushToken('Punctuation', char, line, column);
      advance();
      atLineStart = false;
      continue;
    }

    if (isIdentifierStart(char, lang)) {
      const startLine = line;
      const startColumn = column;
      let value = '';

      while (cursor < input.length && isIdentifierPart(input[cursor], lang)) {
        value += input[cursor];
        advance();
      }

      pushToken(resolveWordType(value, lang), value, startLine, startColumn);
      atLineStart = false;
      continue;
    }

    diagnostics.push(
      createDiagnostic(
        'Lexical Error',
        'error',
        `Invalid character '${char}'.`,
        line,
        column
      )
    );

    pushToken('Unknown', char, line, column);
    advance();
    atLineStart = false;
  }

  if (lang === 'python') {
    while (indentStack.length > 1) {
      indentStack.pop();
      pushToken('Dedent', '<DEDENT>', line, column);
    }
  }

  return {
    tokens,
    diagnostics
  };
}
