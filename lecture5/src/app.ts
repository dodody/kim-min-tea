import template from "./app.template";
import {
  CantContainWithSpace,
  CantStartNumber,
  MinimumLengthLimit,
} from "./static/validation";
import { AnyObject } from "./types";
import { AddressField, PasswordField, TextField } from "./views";

// template를 가지고 있는 뷰들은 다들 이렇게 생기게 설계를 했다.
// template는 데이터와 믹싱되서 html을 만드는데, 그 data는 항상바뀔 수 있으니까, 부모가 받아오는 것으로
// 부모 요소가 있어야 그 부모의 dom에 붙을 수 있다.
export default class App {
  template = template;
  private container: HTMLElement;
  private fields: AnyObject[]; // 여기에서만 쓰니까

  constructor(container: string, data = {}) {
    this.container = document.querySelector(container) as HTMLElement;
    this.fields = [];
    this.initialize();
  }

  private initialize() {
    const nameField = new TextField("#require-fields", {
      id: "name",
      label: "이름",
      type: "text",
      placeholder: "이름을 입력해주세요.",
    });
    const idField = new TextField("#require-fields", {
      id: "id",
      label: "아이디",
      type: "text",
      placeholder: "아이디을 입력해주세요.",
    });
    const emailField = new TextField("#require-fields", {
      id: "email",
      label: "이메일",
      type: "email",
      placeholder: "이메일을 입력해주세요.",
    });
    const passwordField = new PasswordField("#require-fields", {
      id: "password",
      label: "비밀번호",
      placeholder: "비밀번호를 입력해주세요.",
    });
    const addressField = new AddressField("#optional-fields", {
      id: "address",
      label: "주소",
    });

    idField.addValidateRule(CantContainWithSpace);
    idField.addValidateRule(CantStartNumber);
    idField.addValidateRule(MinimumLengthLimit(3));

    this.fields.push(nameField);
    this.fields.push(idField);
    this.fields.push(emailField);
    // this.fields.push(passwordField);
    // this.fields.push(addressField);
  }

  private onSubmit(e: Event) {
    // 일반적으로 HTML 폼이 제출될 때 페이지가 새로고침되는 것이 기본 동작입니다. 하지만 때때로 웹 애플리케이션에서는 페이지 새로고침 없이 폼을 처리하고자 합니다
    e.preventDefault();
    const submitData = {};
    console.log("onSubmit", submitData);
  }

  public render() {
    this.container.innerHTML = this.template();
    this.fields.forEach((field) => {
      field.render(true);
    });
    this.container.addEventListener("submit", this.onSubmit);
  }
}
