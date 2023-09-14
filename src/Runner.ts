import { injectable } from "tsyringe";
import { Greeter } from "./Greeter";

@injectable()
export class Runner {
  constructor(private greeter: Greeter) {}

  run() {
    this.greeter.greet();
  }
}
