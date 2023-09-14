# bun-app

Example bun app with workaround to make tsyringe work using fork of esbuild-plugin-tsc to compile any files with decorators with tsc.

Fixed plugin is located `./plugins/esbuild-plugin-tsc/index.ts`

Due to issue with bun --watch and --hot not working with plugins, this project uses nodemon for hot reloading.

To install dependencies:

```bash
bun install
```

To run:

```bash
bun test
bun dev
```

This project was created using `bun init` in bun v1.0.0. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
