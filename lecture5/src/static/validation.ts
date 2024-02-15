// validate rule을 사용하는 몇가지 객체를 담아놨음
import { ValidateRule } from "../types";

export const RequireRule: ValidateRule = {
  rule: /.+/, // 정규식 리터럴
  match: true,
  message: "필수 입력 항목입니다.",
};

export const CantContainWithSpace: ValidateRule = {
  rule: /\s/,
  match: false,
  message: "공백을 포함할 수 없습니다.",
};

export const CantStartNumber: ValidateRule = {
  rule: /^\d/,
  match: false,
  message: "숫자로 시작하는 아이디는 사용할 수 없습니다.",
};
export const MinimumLengthLimit = (limit: number): ValidateRule => {
  return {
    rule: new RegExp(`(.){${limit}}`), // 정규식 안에 동적인 값을 넣을때 이렇게 작성하는 테크닉
    match: true,
    message: `최소한 ${limit}글자 이상 이어야 합니다.`,
  };
};
