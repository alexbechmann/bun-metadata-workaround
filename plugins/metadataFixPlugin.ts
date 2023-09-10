import { plugin, type BunPlugin } from "bun";
// import esbuildPluginTsc from "esbuild-plugin-tsc";
import { esbuildDecorators } from "@anatine/esbuild-decorators";

// export const myPlugin = plugin(esbuildPluginTsc());
export const metadataFixPlugin = plugin(esbuildDecorators());
