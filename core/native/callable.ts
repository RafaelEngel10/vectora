export interface Callable {
  arity(): number;
  call(args: any[]): any;
}