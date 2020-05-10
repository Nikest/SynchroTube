export class Config {
  public static get(key: string): any {
    if (key in window) {
      return window[key];
    }

    if (key in CONFIG) {
      return CONFIG[key];
    }

    throw new Error(`${key} doesn't set`);
  }
}
