import "reflect-metadata";
import { singleton } from "tsyringe";
import { Greeter } from "./Greeter";

@singleton()
export class Runner {
  constructor(private greeter: Greeter) {}

  run() {
    this.greeter.greet();
  }
}
