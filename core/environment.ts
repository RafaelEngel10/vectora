export class Environment {
  private values = new Map<string, any>();

  constructor(private readonly enclosing?: Environment) {}

  define(name: string, value: any): void {
    if (this.values.has(name)) {
      throw new Error(`Variável '${name}' já definida`);
    }
    this.values.set(name, value);
  }

  assign(name: string, value: any): void {
    if (this.values.has(name)) {
      this.values.set(name, value);
      return;
    }

    if (this.enclosing) {
      this.enclosing.assign(name, value);
      return;
    }

    throw new Error(`Variável '${name}' não definida`);
  }

  get(name: string): any {
    if (this.values.has(name)) {
      return this.values.get(name);
    }

    if (this.enclosing) {
      return this.enclosing.get(name);
    }

    throw new Error(`Variável '${name}' não definida`);
  }
}