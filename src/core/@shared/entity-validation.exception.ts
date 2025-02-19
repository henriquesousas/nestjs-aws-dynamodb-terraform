export type FieldsErrors =
  | {
      [field: string]: string[];
    }
  | string;

export class EntityValidationException extends Error {
  constructor(public error: FieldsErrors[]) {
    super();
  }
  count() {
    return Object.keys(this.error).length;
  }
}
