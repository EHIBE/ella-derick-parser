import type { Language, ParseResult, Diagnostic } from './diagnostics';
import { createDiagnostic } from './diagnostics';
import type { Token } from './lexer';

type Scope = Set<string>;

function isIgnorable(token: Token): boolean {
  return token.type === 'Comment' || token.type === 'Newline';
}

function previousNonIgnorable(tokens: Token[], index: number): Token | undefined {
  for (let i = index - 1; i >= 0; i--) {
    if (!isIgnorable(tokens[i])) {
      return tokens[i];
    }
  }

  return undefined;
}

function nextNonIgnorable(tokens: Token[], index: number): Token | undefined {
  for (let i = index + 1; i < tokens.length; i++) {
    if (!isIgnorable(tokens[i])) {
      return tokens[i];
    }
  }

  return undefined;
}

function nextNonIgnorableIndex(tokens: Token[], index: number): number {
  for (let i = index + 1; i < tokens.length; i++) {
    if (!isIgnorable(tokens[i])) {
      return i;
    }
  }

  return -1;
}

function previousNonIgnorableIndex(tokens: Token[], index: number): number {
  for (let i = index - 1; i >= 0; i--) {
    if (!isIgnorable(tokens[i])) {
      return i;
    }
  }

  return -1;
}

function collectLineTokens(tokens: Token[]): Map<number, Token[]> {
  const map = new Map<number, Token[]>();

  for (const token of tokens) {
    if (!map.has(token.line)) {
      map.set(token.line, []);
    }

    map.get(token.line)?.push(token);
  }

  return map;
}

function isLiteralOrIdentifier(token: Token | undefined): boolean {
  if (!token) {
    return false;
  }

  if (
    token.type === 'Identifier' ||
    token.type === 'Variable' ||
    token.type === 'Number' ||
    token.type === 'StringLiteral'
  ) {
    return true;
  }

  return [')', ']', '}'].includes(token.value);
}

function isExpressionStarter(token: Token | undefined): boolean {
  if (!token) {
    return false;
  }

  if (
    token.type === 'Identifier' ||
    token.type === 'Variable' ||
    token.type === 'Number' ||
    token.type === 'StringLiteral' ||
    token.type === 'Type'
  ) {
    return true;
  }

  if (token.type === 'Keyword' && ['true', 'false', 'null', 'True', 'False', 'None', 'return', 'not'].includes(token.value)) {
    return true;
  }

  return ['(', '[', '{', '+', '-', '!'].includes(token.value);
}

function findMatchingTemplateOpen(tokens: Token[], closeIndex: number): number {
  let depth = 0;

  for (let i = closeIndex; i >= 0; i--) {
    const token = tokens[i];

    if (isIgnorable(token) || token.type !== 'Operator') {
      continue;
    }

    if (token.value === '>') {
      depth++;
      continue;
    }

    if (token.value === '<') {
      depth--;

      if (depth === 0) {
        return i;
      }
    }
  }

  return -1;
}

function isTypeLikeToken(token: Token | undefined): boolean {
  if (!token) {
    return false;
  }

  return token.type === 'Type' || token.type === 'Identifier';
}

function isCppTemplateAngle(tokens: Token[], index: number): boolean {
  const token = tokens[index];

  if (token.type !== 'Operator') {
    return false;
  }

  if (token.value === '<') {
    const prev = previousNonIgnorable(tokens, index);
    const next = nextNonIgnorable(tokens, index);

    if (!isTypeLikeToken(prev) || !isTypeLikeToken(next)) {
      return false;
    }

    let depth = 1;

    for (let i = index + 1; i < tokens.length; i++) {
      const current = tokens[i];

      if (isIgnorable(current) || current.type !== 'Operator') {
        continue;
      }

      if (current.value === '<') {
        depth++;
        continue;
      }

      if (current.value === '>') {
        depth--;

        if (depth === 0) {
          return true;
        }
      }
    }

    return false;
  }

  if (token.value === '>') {
    const openIndex = findMatchingTemplateOpen(tokens, index);

    if (openIndex === -1) {
      return false;
    }

    const openToken = tokens[openIndex];
    const prevOfOpen = previousNonIgnorable(tokens, openIndex);
    const nextOfOpen = nextNonIgnorable(tokens, openIndex);

    if (!isTypeLikeToken(prevOfOpen) || !isTypeLikeToken(nextOfOpen)) {
      return false;
    }

    const prev = previousNonIgnorable(tokens, index);
    const next = nextNonIgnorable(tokens, index);

    if (!prev) {
      return false;
    }

    const validNext =
      !next ||
      next.type === 'Identifier' ||
      next.type === 'Variable' ||
      next.type === 'Type' ||
      ['&', '*', ',', ';', '(', ')', '{', '}', '[', ']', '='].includes(next.value);

    const validPrev =
      prev.type === 'Type' ||
      prev.type === 'Identifier' ||
      prev.type === 'Number' ||
      [']', ')', '>'].includes(prev.value);

    return validPrev && validNext && openToken.value === '<';
  }

  return false;
}

function addBalancedDelimiterDiagnostics(tokens: Token[], diagnostics: Diagnostic[]): void {
  const stack: Token[] = [];
  const pairs: Record<string, string> = {
    ')': '(',
    ']': '[',
    '}': '{'
  };

  for (const token of tokens) {
    if (isIgnorable(token)) {
      continue;
    }

    if (['(', '[', '{'].includes(token.value)) {
      stack.push(token);
      continue;
    }

    if ([')', ']', '}'].includes(token.value)) {
      const last = stack[stack.length - 1];

      if (!last) {
        diagnostics.push(
          createDiagnostic(
            'Syntax Error',
            'error',
            `Unmatched closing '${token.value}'.`,
            token.line,
            token.column
          )
        );
        continue;
      }

      if (last.value !== pairs[token.value]) {
        diagnostics.push(
          createDiagnostic(
            'Syntax Error',
            'error',
            `Mismatched delimiter. Expected closing pair for '${last.value}' but found '${token.value}'.`,
            token.line,
            token.column
          )
        );
        stack.pop();
        continue;
      }

      stack.pop();
    }
  }

  for (const unmatched of stack) {
    diagnostics.push(
      createDiagnostic(
        'Syntax Error',
        'error',
        `Missing closing delimiter for '${unmatched.value}'.`,
        unmatched.line,
        unmatched.column
      )
    );
  }
}

function addOperatorPlacementDiagnostics(tokens: Token[], diagnostics: Diagnostic[], lang: Language): void {
  const binaryOperators = new Set([
    '+',
    '-',
    '*',
    '/',
    '%',
    '==',
    '!=',
    '===',
    '!==',
    '<',
    '>',
    '<=',
    '>=',
    '&&',
    '||',
    '=',
    '+=',
    '-=',
    '*=',
    '/=',
    '%='
  ]);

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    if (isIgnorable(token) || token.type !== 'Operator') {
      continue;
    }

    if (!binaryOperators.has(token.value)) {
      continue;
    }

    if (lang === 'cpp' && (token.value === '<' || token.value === '>') && isCppTemplateAngle(tokens, i)) {
      continue;
    }

    const prev = previousNonIgnorable(tokens, i);
    const next = nextNonIgnorable(tokens, i);

    if (token.value === '-' || token.value === '+') {
      if (!prev || ['(', '[', '{', ',', ':', '=', 'return'].includes(prev.value)) {
        continue;
      }
    }

    if (!prev) {
      diagnostics.push(
        createDiagnostic(
          'Syntax Error',
          'error',
          `Operator '${token.value}' cannot start an expression here.`,
          token.line,
          token.column
        )
      );
      continue;
    }

    if (!next) {
      diagnostics.push(
        createDiagnostic(
          'Syntax Error',
          'error',
          `Operator '${token.value}' cannot terminate an expression.`,
          token.line,
          token.column
        )
      );
      continue;
    }

    if (!isLiteralOrIdentifier(prev) && ![')', ']', '}'].includes(prev.value)) {
      diagnostics.push(
        createDiagnostic(
          'Syntax Error',
          'error',
          `Invalid token before operator '${token.value}'.`,
          token.line,
          token.column
        )
      );
    }

    if (!isExpressionStarter(next)) {
      diagnostics.push(
        createDiagnostic(
          'Syntax Error',
          'error',
          `Invalid token after operator '${token.value}'.`,
          token.line,
          token.column
        )
      );
    }
  }

  if (lang === 'python') {
    for (const token of tokens) {
      if (token.type === 'Punctuation' && token.value === ';') {
        diagnostics.push(
          createDiagnostic(
            'Style Warning',
            'warning',
            'Semicolons are legal in Python but should be avoided in standard style.',
            token.line,
            token.column
          )
        );
      }
    }
  }
}

function addPhpStructureDiagnostics(tokens: Token[], diagnostics: Diagnostic[]): void {
  const meaningful = tokens.filter(token => !isIgnorable(token));

  if (meaningful.length === 0) {
    diagnostics.push(
      createDiagnostic(
        'Syntax Error',
        'error',
        'Empty input stream.',
        1,
        1
      )
    );
    return;
  }

  if (meaningful[0]?.type !== 'PhpOpenTag') {
    diagnostics.push(
      createDiagnostic(
        'Syntax Error',
        'error',
        "PHP code must begin with '<?php'.",
        meaningful[0].line,
        meaningful[0].column
      )
    );
  }

  const last = meaningful[meaningful.length - 1];
  if (last?.type !== 'PhpCloseTag') {
    diagnostics.push(
      createDiagnostic(
        'Syntax Error',
        'error',
        "PHP code must terminate with '?>'.",
        last.line,
        last.column
      )
    );
  }
}

function addMissingTerminatorDiagnostics(tokens: Token[], diagnostics: Diagnostic[], lang: Language): void {
  const lines = collectLineTokens(tokens);

  for (const [lineNumber, lineTokens] of lines.entries()) {
    const meaningful = lineTokens.filter(token => !isIgnorable(token));

    if (meaningful.length === 0) {
      continue;
    }

    const first = meaningful[0];
    const last = meaningful[meaningful.length - 1];

    if (lang === 'cpp' || lang === 'php') {
      const exemptFirstValues = new Set([
        'if',
        'else',
        'for',
        'while',
        'foreach',
        'function',
        '<?php',
        '?>'
      ]);

      const allowedEndings = new Set([
        ';',
        '{',
        '}',
        ':',
        '<?php',
        '?>'
      ]);

      if (exemptFirstValues.has(first.value)) {
        if (!allowedEndings.has(last.value) && first.value !== 'else') {
          diagnostics.push(
            createDiagnostic(
              'Syntax Error',
              'error',
              'Control or declaration statement has invalid line termination.',
              lineNumber,
              last.column
            )
          );
        }

        continue;
      }

      if (!allowedEndings.has(last.value)) {
        diagnostics.push(
          createDiagnostic(
            'Syntax Error',
            'error',
            "Statement appears to be missing a terminating ';'.",
            lineNumber,
            last.column
          )
        );
      }
    }

    if (lang === 'python') {
      const needsColon = new Set(['def', 'if', 'elif', 'else', 'for', 'while']);

      if (needsColon.has(first.value) && last.value !== ':') {
        diagnostics.push(
          createDiagnostic(
            'Syntax Error',
            'error',
            `Expected ':' at the end of '${first.value}' statement.`,
            lineNumber,
            last.column
          )
        );
      }
    }
  }
}

function addPythonIndentationBlockDiagnostics(tokens: Token[], diagnostics: Diagnostic[]): void {
  const lines = collectLineTokens(tokens);
  const sortedLines = [...lines.keys()].sort((a, b) => a - b);

  for (let index = 0; index < sortedLines.length; index++) {
    const lineNumber = sortedLines[index];
    const lineTokens = (lines.get(lineNumber) ?? []).filter(token => !isIgnorable(token));

    if (lineTokens.length === 0) {
      continue;
    }

    const first = lineTokens[0];
    const last = lineTokens[lineTokens.length - 1];

    if (['def', 'if', 'elif', 'else', 'for', 'while'].includes(first.value) && last.value === ':') {
      const nextLineNumber = sortedLines[index + 1];
      if (!nextLineNumber) {
        diagnostics.push(
          createDiagnostic(
            'Syntax Error',
            'error',
            `Expected an indented block after '${first.value}'.`,
            first.line,
            first.column
          )
        );
        continue;
      }

      const nextLineTokens = lines.get(nextLineNumber) ?? [];
      const hasIndent = nextLineTokens.some(token => token.type === 'Indent');

      if (!hasIndent) {
        diagnostics.push(
          createDiagnostic(
            'Syntax Error',
            'error',
            `Expected an indented block after '${first.value}'.`,
            nextLineNumber,
            1
          )
        );
      }
    }
  }
}

function addPhpVariableRules(tokens: Token[], diagnostics: Diagnostic[]): void {
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    if (token.type !== 'Identifier') {
      continue;
    }

    const prev = previousNonIgnorable(tokens, i);
    const next = nextNonIgnorable(tokens, i);

    if (prev?.value === 'function') {
      continue;
    }

    if (prev?.value === '->' || prev?.value === '::' || prev?.value === '.') {
      continue;
    }

    if (
      next?.value === '=' ||
      next?.value === '=>' ||
      prev?.value === 'as' ||
      next?.value === ',' ||
      next?.value === ')'
    ) {
      diagnostics.push(
        createDiagnostic(
          'Semantic Error',
          'error',
          `PHP variables must be prefixed with '$'. Found '${token.value}'.`,
          token.line,
          token.column
        )
      );
    }
  }
}

function addFunctionDefinitionDiagnostics(tokens: Token[], diagnostics: Diagnostic[], lang: Language): void {
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    if (lang === 'php' && token.value === 'function') {
      const nameIndex = nextNonIgnorableIndex(tokens, i);
      const afterNameIndex = nameIndex !== -1 ? nextNonIgnorableIndex(tokens, nameIndex) : -1;
      const name = nameIndex !== -1 ? tokens[nameIndex] : undefined;
      const afterName = afterNameIndex !== -1 ? tokens[afterNameIndex] : undefined;

      if (!name || name.type !== 'Identifier') {
        diagnostics.push(
          createDiagnostic(
            'Syntax Error',
            'error',
            'Function declaration must include a valid function name.',
            token.line,
            token.column
          )
        );
      }

      if (!afterName || afterName.value !== '(') {
        diagnostics.push(
          createDiagnostic(
            'Syntax Error',
            'error',
            'Function declaration must include a parameter list.',
            token.line,
            token.column
          )
        );
      }
    }

    if (lang === 'python' && token.value === 'def') {
      const nameIndex = nextNonIgnorableIndex(tokens, i);
      const afterNameIndex = nameIndex !== -1 ? nextNonIgnorableIndex(tokens, nameIndex) : -1;
      const name = nameIndex !== -1 ? tokens[nameIndex] : undefined;
      const afterName = afterNameIndex !== -1 ? tokens[afterNameIndex] : undefined;

      if (!name || name.type !== 'Identifier') {
        diagnostics.push(
          createDiagnostic(
            'Syntax Error',
            'error',
            'Python function definition must include a valid function name.',
            token.line,
            token.column
          )
        );
      }

      if (!afterName || afterName.value !== '(') {
        diagnostics.push(
          createDiagnostic(
            'Syntax Error',
            'error',
            'Python function definition must include a parameter list.',
            token.line,
            token.column
          )
        );
      }
    }
  }
}

function declareCppFunctionParameters(
  tokens: Token[],
  openParenIndex: number,
  declare: (name: string) => void
): void {
  let depth = 0;

  for (let i = openParenIndex; i < tokens.length; i++) {
    const token = tokens[i];

    if (isIgnorable(token)) {
      continue;
    }

    if (token.value === '(') {
      depth++;
      continue;
    }

    if (token.value === ')') {
      depth--;
      if (depth === 0) {
        break;
      }
      continue;
    }

    if (depth !== 1 || token.type !== 'Identifier') {
      continue;
    }

    const prev = previousNonIgnorable(tokens, i);
    const next = nextNonIgnorable(tokens, i);

    if (!prev || !next) {
      continue;
    }

    const looksLikeParameter =
      prev.type === 'Type' ||
      prev.value === '>' ||
      prev.value === '&' ||
      prev.value === '*' ||
      prev.value === '::';

    const validRightSide =
      next.value === ',' ||
      next.value === ')' ||
      next.value === '[' ||
      next.value === '=';

    if (looksLikeParameter && validRightSide) {
      declare(token.value);
    }
  }
}

function declarePhpFunctionParameters(
  tokens: Token[],
  openParenIndex: number,
  declare: (name: string) => void
): void {
  let depth = 0;

  for (let i = openParenIndex; i < tokens.length; i++) {
    const token = tokens[i];

    if (isIgnorable(token)) {
      continue;
    }

    if (token.value === '(') {
      depth++;
      continue;
    }

    if (token.value === ')') {
      depth--;
      if (depth === 0) {
        break;
      }
      continue;
    }

    if (depth === 1 && token.type === 'Variable') {
      declare(token.value);
    }
  }
}

function declarePythonFunctionParameters(
  tokens: Token[],
  openParenIndex: number,
  declare: (name: string) => void
): void {
  let depth = 0;

  for (let i = openParenIndex; i < tokens.length; i++) {
    const token = tokens[i];

    if (isIgnorable(token)) {
      continue;
    }

    if (token.value === '(') {
      depth++;
      continue;
    }

    if (token.value === ')') {
      depth--;
      if (depth === 0) {
        break;
      }
      continue;
    }

    if (depth === 1 && token.type === 'Identifier') {
      declare(token.value);
    }
  }
}

function addIdentifierDeclarationDiagnostics(tokens: Token[], diagnostics: Diagnostic[], lang: Language): void {
  const scopes: Scope[] = [new Set<string>()];

  function declare(name: string): void {
    scopes[scopes.length - 1].add(name);
  }

  function isDeclared(name: string): boolean {
    for (let i = scopes.length - 1; i >= 0; i--) {
      if (scopes[i].has(name)) {
        return true;
      }
    }

    return false;
  }

  const builtinNames = new Set([
    'strlen',
    'isset',
    'empty',
    'array_pop',
    'array_push',
    'enumerate',
    'float',
    'INT_MAX',
    'PHP_INT_MAX'
  ]);

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    if (isIgnorable(token)) {
      continue;
    }

    if (token.value === '{' || token.type === 'Indent') {
      scopes.push(new Set<string>());
      continue;
    }

    if (token.value === '}' || token.type === 'Dedent') {
      if (scopes.length > 1) {
        scopes.pop();
      }
      continue;
    }

    if (lang === 'cpp') {
      if (token.type === 'Identifier') {
        const prev = previousNonIgnorable(tokens, i);
        const next = nextNonIgnorable(tokens, i);

        if (prev?.value === '.' || prev?.value === '->' || prev?.value === '::') {
          continue;
        }

        if (next?.value === '(' && (prev?.type === 'Type' || prev?.value === '>' || prev?.value === '&' || prev?.value === '*')) {
          declare(token.value);
          const openParenIndex = nextNonIgnorableIndex(tokens, i);
          if (openParenIndex !== -1) {
            declareCppFunctionParameters(tokens, openParenIndex, declare);
          }
          continue;
        }

        if (prev?.type === 'Type' || prev?.value === '>' || prev?.value === '&' || prev?.value === '*') {
          if (next?.value !== '(') {
            declare(token.value);
            continue;
          }
        }

        if (builtinNames.has(token.value)) {
          continue;
        }

        if (!isDeclared(token.value)) {
          diagnostics.push(
            createDiagnostic(
              'Semantic Error',
              'warning',
              `Identifier '${token.value}' may be undeclared in the current scope.`,
              token.line,
              token.column
            )
          );
        }
      }

      continue;
    }

    if (lang === 'php') {
      if (token.value === 'function') {
        const nameIndex = nextNonIgnorableIndex(tokens, i);
        const openParenIndex = nameIndex !== -1 ? nextNonIgnorableIndex(tokens, nameIndex) : -1;
        if (nameIndex !== -1 && tokens[nameIndex].type === 'Identifier') {
          declare(tokens[nameIndex].value);
        }
        if (openParenIndex !== -1 && tokens[openParenIndex].value === '(') {
          declarePhpFunctionParameters(tokens, openParenIndex, declare);
        }
        continue;
      }

      if (token.type === 'Variable') {
        const prev = previousNonIgnorable(tokens, i);
        const next = nextNonIgnorable(tokens, i);

        if (prev?.value === 'function' || prev?.value === 'as') {
          declare(token.value);
          continue;
        }

        if (next?.value === '=' || next?.value === '=>' || next?.value === ',' || next?.value === ')' || next?.value === ']') {
          declare(token.value);
          continue;
        }

        if (!isDeclared(token.value)) {
          diagnostics.push(
            createDiagnostic(
              'Semantic Error',
              'error',
              `Variable '${token.value}' may be used before initialization.`,
              token.line,
              token.column
            )
          );
        }
      }

      continue;
    }

    if (lang === 'python') {
      if (token.value === 'def') {
        const nameIndex = nextNonIgnorableIndex(tokens, i);
        const openParenIndex = nameIndex !== -1 ? nextNonIgnorableIndex(tokens, nameIndex) : -1;
        if (nameIndex !== -1 && tokens[nameIndex].type === 'Identifier') {
          declare(tokens[nameIndex].value);
        }
        if (openParenIndex !== -1 && tokens[openParenIndex].value === '(') {
          declarePythonFunctionParameters(tokens, openParenIndex, declare);
        }
        continue;
      }

      if (token.type === 'Identifier') {
        const prev = previousNonIgnorable(tokens, i);
        const next = nextNonIgnorable(tokens, i);

        if (prev?.value === '.' || prev?.value === '->' || prev?.value === '::') {
          continue;
        }

        if (prev?.value === 'for') {
          declare(token.value);
          continue;
        }

        if (next?.value === '=') {
          declare(token.value);
          continue;
        }

        if (builtinNames.has(token.value)) {
          continue;
        }

        if (!isDeclared(token.value)) {
          diagnostics.push(
            createDiagnostic(
              'Semantic Error',
              'warning',
              `Identifier '${token.value}' may be used before assignment.`,
              token.line,
              token.column
            )
          );
        }
      }
    }
  }
}

function addRuntimeRiskDiagnostics(tokens: Token[], diagnostics: Diagnostic[], lang: Language): void {
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    const next = nextNonIgnorable(tokens, i);

    if (token.value === '/' && next?.type === 'Number' && next.value === '0') {
      diagnostics.push(
        createDiagnostic(
          'Runtime Risk',
          'warning',
          'Possible division by zero.',
          token.line,
          token.column
        )
      );
    }

    if (lang === 'cpp' && token.type === 'Identifier' && token.value === 'pop') {
      diagnostics.push(
        createDiagnostic(
          'Runtime Risk',
          'info',
          'Ensure container is non-empty before calling pop().',
          token.line,
          token.column
        )
      );
    }

    if (lang === 'php' && token.type === 'Identifier' && token.value === 'array_pop') {
      diagnostics.push(
        createDiagnostic(
          'Runtime Risk',
          'info',
          'Ensure array is non-empty before calling array_pop().',
          token.line,
          token.column
        )
      );
    }

    if (lang === 'python' && token.type === 'Identifier' && token.value === 'pop') {
      diagnostics.push(
        createDiagnostic(
          'Runtime Risk',
          'info',
          'Ensure list is non-empty before calling pop().',
          token.line,
          token.column
        )
      );
    }
  }
}

function deduplicateDiagnostics(diagnostics: Diagnostic[]): Diagnostic[] {
  const seen = new Set<string>();
  const result: Diagnostic[] = [];

  for (const diagnostic of diagnostics) {
    const key = `${diagnostic.category}|${diagnostic.severity}|${diagnostic.line}|${diagnostic.column}|${diagnostic.message}`;
    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    result.push(diagnostic);
  }

  return result;
}

export function parseTokens(tokens: Token[], lang: Language, externalDiagnostics: Diagnostic[] = []): ParseResult {
  const diagnostics: Diagnostic[] = [...externalDiagnostics];

  const meaningful = tokens.filter(token => !isIgnorable(token));

  if (meaningful.length === 0) {
    diagnostics.push(
      createDiagnostic(
        'Syntax Error',
        'error',
        'Empty input stream.',
        1,
        1
      )
    );

    return {
      valid: false,
      diagnostics
    };
  }

  for (const token of meaningful) {
    if (token.type === 'Unknown') {
      diagnostics.push(
        createDiagnostic(
          'Lexical Error',
          'error',
          `Unknown token '${token.value}'.`,
          token.line,
          token.column
        )
      );
    }
  }

  addBalancedDelimiterDiagnostics(tokens, diagnostics);
  addOperatorPlacementDiagnostics(tokens, diagnostics, lang);
  addMissingTerminatorDiagnostics(tokens, diagnostics, lang);
  addFunctionDefinitionDiagnostics(tokens, diagnostics, lang);
  addIdentifierDeclarationDiagnostics(tokens, diagnostics, lang);
  addRuntimeRiskDiagnostics(tokens, diagnostics, lang);

  if (lang === 'php') {
    addPhpStructureDiagnostics(tokens, diagnostics);
    addPhpVariableRules(tokens, diagnostics);
  }

  if (lang === 'python') {
    addPythonIndentationBlockDiagnostics(tokens, diagnostics);
  }

  const uniqueDiagnostics = deduplicateDiagnostics(diagnostics).sort((a, b) => {
    if (a.line !== b.line) {
      return a.line - b.line;
    }

    if (a.column !== b.column) {
      return a.column - b.column;
    }

    return a.message.localeCompare(b.message);
  });

  const errorCount = uniqueDiagnostics.filter(diagnostic => diagnostic.severity === 'error').length;

  return {
    valid: errorCount === 0,
    diagnostics: uniqueDiagnostics
  };
}
