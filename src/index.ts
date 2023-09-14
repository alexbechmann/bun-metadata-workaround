import "core-js";
import "reflect-metadata";
import { container } from "tsyringe";
import { Runner } from "./Runner";

const runner = container.resolve(Runner);
runner.run();
