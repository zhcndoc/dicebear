declare function validate(data: unknown): boolean;
declare namespace validate {
  var errors: Array<{ message?: string; instancePath?: string }> | null;
}
export default validate;
