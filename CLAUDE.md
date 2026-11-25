# Instructions for AI assistants working in this repository

Follow [docs/architecture/code-standards.md](docs/architecture/code-standards.md) for every change, even when a task does not mention it. In short:

- Clean architecture: domain, application, infrastructure and presentation layers in every module.
- Every module, however small, has its own folder. Modules never import each other's internals; they use `packages/contracts/`.
- Shared, reusable code lives in separate packages and is reused, never copied.
- Keep code as small as the job needs, with one responsibility per file.
- Comment every file, every public function and every step of every process.
- Zero warnings: lint and type checks treat warnings as errors. Handle every loading, empty, error, offline and denied state, and every dialog and toast.
- Colours, text sizes and logos come only from `packages/design-tokens/` and `packages/brand/`.
- Never commit secrets or prices.

Work follows [docs/BUILD-CHECKLIST.md](docs/BUILD-CHECKLIST.md), in order.
