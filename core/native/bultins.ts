import { Callable } from "./callable.js";

export class Print implements Callable {
  arity(): number {
    return 1;
  }

  call(args: any[]): any {
    console.log(args[0]);
    return null;
  }
}