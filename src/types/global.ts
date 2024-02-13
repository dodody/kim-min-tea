// 글로벌 영역의 object를 정의하는
import { AnyObject } from "./common";

declare global{
  interface Window{
    Handlebars: {
      compile: (template: string) => (data: AnyObject) => string;
    }
    daum: any;
  }
}

export { };

