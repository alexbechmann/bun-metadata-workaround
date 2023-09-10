import "reflect-metadata";
import { singleton } from "tsyringe";

@singleton()
export class Greeter {
  greet() {
    console.log("Hello");
  }
}
