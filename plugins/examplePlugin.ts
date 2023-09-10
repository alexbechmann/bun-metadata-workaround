import { plugin, type BunPlugin } from "bun";

export const examplePlugin: BunPlugin = {
  name: "Custom loader",
  setup(build) {
    // implementation
  },
};
