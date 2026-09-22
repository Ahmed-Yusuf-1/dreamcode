/**
 * Template tag for code samples in content files. Backslashes are kept exactly as
 * written (like String.raw), so regex and escape sequences read the way a learner
 * types them. The only two escapes it undoes are the ones a TypeScript template
 * literal forces on us: \${ (to write a JavaScript template placeholder) and \`
 * (to write a backtick).
 */
export function code(strings: TemplateStringsArray, ...values: unknown[]): string {
  return String.raw(strings, ...values)
    .replace(/\\\$\{/g, "${")
    .replace(/\\`/g, "`");
}
