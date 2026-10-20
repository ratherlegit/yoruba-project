// Shows a build expression the way a learner reads it: 20*3-10 becomes 20 × 3 − 10.
export function showBuild(build: string): string {
  return build
    .replace(/\s+/g, "")
    .replace(/[*x]/g, " × ")
    .replace(/\+/g, " + ")
    .replace(/([0-9)])-/g, "$1 − ")
    .replace(/\s+/g, " ")
    .trim();
}
