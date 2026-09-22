type StringifyProperties<T> = {
  [K in keyof T]: string;
};

function stringifyConfig<T extends object>(config: T): StringifyProperties<T> {
  const result = {} as StringifyProperties<T>;
  for (const key of Object.keys(config) as (keyof T)[]) {
    result[key] = String(config[key]);
  }
  return result;
}
