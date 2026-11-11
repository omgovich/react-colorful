// Writes each changeset summary as a plain bullet, without the commit hash the
// default generator prepends, so entries keep the existing CHANGELOG.md style:
// "- Fix ... Thanks to @user (via #123)"
export default {
  getReleaseLine: (changeset) => {
    const [firstLine, ...rest] = changeset.summary.trim().split("\n");
    return [`- ${firstLine}`, ...rest.map((line) => (line ? `  ${line}` : line))].join("\n");
  },
  getDependencyReleaseLine: () => "",
};
