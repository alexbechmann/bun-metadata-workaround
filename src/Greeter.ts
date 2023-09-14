import { injectable } from "tsyringe";

@injectable()
export class Greeter {
  greet() {
    console.log("Hello!");
  }
}
