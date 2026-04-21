export type Language = 'cpp' | 'php' | 'python';

export type DiagnosticCategory =
  | 'Lexical Error'
  | 'Syntax Error'
  | 'Semantic Error'
  | 'Runtime Risk'
  | 'Style Warning';

export type DiagnosticSeverity = 'error' | 'warning' | 'info';

export type Diagnostic = {
  category: DiagnosticCategory;
  severity: DiagnosticSeverity;
  message: string;
  line: number;
  column: number;
};

export type ParseResult = {
  valid: boolean;
  diagnostics: Diagnostic[];
};

export function createDiagnostic(
  category: DiagnosticCategory,
  severity: DiagnosticSeverity,
  message: string,
  line: number,
  column: number
): Diagnostic {
  return {
    category,
    severity,
    message,
    line,
    column
  };
}
