import "reflect-metadata";
import { container, injectable } from "tsyringe";
// import { Runner } from "./Runner";

@injectable()
class Greeter {
  greet() {
    console.log("Hello");
  }
}

@injectable()
class Runner {
  constructor(private greeter: Greeter) {}

  run() {
    this.greeter.greet();
  }
}

console.log("hi1");
const runner = container.resolve(Runner);
runner.run();
