type AnyObject = {
  [key: string]: any;
}

type ValidateRule = {
  rule: RegExp;
  match: boolean;
  message: string;
}


export { AnyObject, ValidateRule };

