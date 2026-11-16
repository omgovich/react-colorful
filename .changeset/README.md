# Changesets

Every PR that changes the published package adds a changeset:

```sh
npx changeset
```

Pick `patch`, `minor` or `major` and write one CHANGELOG line, crediting the code contributor:

```md
Fix RGB channels drifting when only the alpha channel is changed. Thanks to @user (via #234)
```

On merge to `master`, a "chore: release" PR collects pending changesets, bumps the version and updates CHANGELOG.md. Merging that PR publishes to npm and creates the git tag and GitHub Release.
