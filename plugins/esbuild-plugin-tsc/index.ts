import { BunPlugin, OnLoadResult, plugin } from "bun";
import fs from "fs";
import path from "path";
import typescript from "typescript";
import stripComments from "strip-comments";

import { inspect } from "util";

const theFinder = new RegExp(/((?<![\(\s]\s*['"])@\w*[\w\d]\s*(?![;])[\((?=\s)])/);

const findDecorators = (fileContent: string) => theFinder.test(stripComments(fileContent));

export const esbuildPluginTsc = ({
  tsconfigPath = path.join(process.cwd(), "./tsconfig.json"),
  force: forceTsc = false,
  tsx = true,
} = {}) =>
  plugin({
    name: "tsc",
    setup(build) {
      let parsedTsConfig: any = null;

      build.onLoad({ filter: tsx ? /\.tsx?$/ : /\.ts$/ }, async (args) => {
        const defaultReturn: OnLoadResult = {
          contents: fs.readFileSync(args.path, "utf8"),
        };
        if (!parsedTsConfig) {
          parsedTsConfig = parseTsConfig(tsconfigPath, process.cwd());
          if (parsedTsConfig.options.sourceMap) {
            parsedTsConfig.options.sourceMap = false;
            parsedTsConfig.options.inlineSources = true;
            parsedTsConfig.options.inlineSourceMap = true;
          }
        }

        // Just return if we don't need to search the file.
        if (!forceTsc && (!parsedTsConfig || !parsedTsConfig.options || !parsedTsConfig.options.emitDecoratorMetadata)) {
          return defaultReturn;
        }

        // const ts = await fs.readFile(args.path, "utf8").catch((err) => printDiagnostics({ file: args.path, err }));
        const ts = fs.readFileSync(args.path, "utf8");

        // Find the decorator and if there isn't one, return out
        const hasDecorator = findDecorators(ts);
        if (!hasDecorator) {
          return defaultReturn;
        }

        const program = typescript.transpileModule(ts, {
          compilerOptions: parsedTsConfig.options,
          fileName: path.basename(args.path),
        });
        return { contents: program.outputText };
      });
    },
  } as BunPlugin);

function parseTsConfig(tsconfig: string, cwd = process.cwd()) {
  const fileName = typescript.findConfigFile(cwd, typescript.sys.fileExists, tsconfig);

  // if the value was provided, but no file, fail hard
  if (tsconfig !== undefined && !fileName) throw new Error(`failed to open '${fileName}'`);

  let loadedConfig = {};
  let baseDir = cwd;
  let configFileName;
  if (fileName) {
    const text = typescript.sys.readFile(fileName);
    if (text === undefined) throw new Error(`failed to read '${fileName}'`);

    const result = typescript.parseConfigFileTextToJson(fileName, text);

    if (result.error !== undefined) {
      printDiagnostics(result.error);
      throw new Error(`failed to parse '${fileName}'`);
    }

    loadedConfig = result.config;
    baseDir = path.dirname(fileName);
    configFileName = fileName;
  }

  const parsedTsConfig = typescript.parseJsonConfigFileContent(loadedConfig, typescript.sys, baseDir);

  if (parsedTsConfig.errors[0]) printDiagnostics(parsedTsConfig.errors);

  return parsedTsConfig;
}

function printDiagnostics(...args: any[]) {
  console.log(inspect(args, false, 10, true));
}
