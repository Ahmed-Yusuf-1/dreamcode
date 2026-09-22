import * as ts from "typescript";

/**
 * Inserts `__dcLoopGuard();` at the top of every loop body in learner
 * JavaScript. The DOM preview runs code on the page's own thread (inside a
 * sandboxed iframe), where a runaway loop cannot be killed from outside, so the
 * guard throws once a loop has run for too long. Pure source-to-source: the code
 * is parsed and printed, never executed here.
 */
export function guardLoops(code: string): { js: string; diagnostics: string[] } {
  const source = ts.createSourceFile("input.js", code, ts.ScriptTarget.ES2022, true, ts.ScriptKind.JS);
  const parseErrors = (source as unknown as { parseDiagnostics?: ts.Diagnostic[] }).parseDiagnostics ?? [];
  if (parseErrors.length > 0) {
    return {
      js: "",
      diagnostics: parseErrors.slice(0, 5).map((d) => {
        const msg = ts.flattenDiagnosticMessageText(d.messageText, "\n");
        if (typeof d.start !== "number") return msg;
        const { line } = source.getLineAndCharacterOfPosition(d.start);
        return `Line ${line + 1}: ${msg}`;
      }),
    };
  }

  const transformer: ts.TransformerFactory<ts.SourceFile> = (context) => {
    const f = context.factory;
    const guard = () => f.createExpressionStatement(f.createCallExpression(f.createIdentifier("__dcLoopGuard"), undefined, []));
    const wrap = (statement: ts.Statement) =>
      ts.isBlock(statement) ? f.updateBlock(statement, [guard(), ...statement.statements]) : f.createBlock([guard(), statement], true);

    const visit: ts.Visitor = (node) => {
      const visited = ts.visitEachChild(node, visit, context);
      if (ts.isForStatement(visited)) {
        return f.updateForStatement(visited, visited.initializer, visited.condition, visited.incrementor, wrap(visited.statement));
      }
      if (ts.isForOfStatement(visited)) {
        return f.updateForOfStatement(visited, visited.awaitModifier, visited.initializer, visited.expression, wrap(visited.statement));
      }
      if (ts.isForInStatement(visited)) {
        return f.updateForInStatement(visited, visited.initializer, visited.expression, wrap(visited.statement));
      }
      if (ts.isWhileStatement(visited)) {
        return f.updateWhileStatement(visited, visited.expression, wrap(visited.statement));
      }
      if (ts.isDoStatement(visited)) {
        return f.updateDoStatement(visited, wrap(visited.statement), visited.expression);
      }
      return visited;
    };
    return (file) => ts.visitNode(file, visit) as ts.SourceFile;
  };

  const result = ts.transform(source, [transformer]);
  const js = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed }).printFile(result.transformed[0]);
  result.dispose();
  return { js, diagnostics: [] };
}
