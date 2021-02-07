import { ErrorObject } from 'ajv';

export type ValidationErrors =
  | ErrorObject<string, Record<string, any>, unknown>[]
  | { message: string }[]
  | null
  | undefined;
