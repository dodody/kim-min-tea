export type AnyObject = {
  [key: string]: any;
};

// ! 이름이 마음에 안드느데
export type ValidateRule = {
  rule: RegExp;
  match: boolean;
  message: string;
};
