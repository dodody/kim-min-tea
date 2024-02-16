import template from "./app.template";
import {
  CantContainWhiteSpace,
  CantStartNumber,
  MinimumLengthLimit,
} from "./static/validation";
import { AnyObject } from "./types";
import { AddressField, PasswordField, TextField } from "./views";

export default class App {
  template = template;
  private container: HTMLElement;
  private fields: AnyObject[]; // 여기에서만 쓰니까
  private active: boolean = false;

  constructor(container: string, data = {}) {
    this.container = document.querySelector(container) as HTMLElement;
    this.fields = [];
    this.initialize();

    // setInterval(this.validFieldMonitor, 1000 / 30);
    this.validFieldMonitor();
  }

  // ! 이렇게 시간초 단위로 하면서 해야될지 모르겠다. 원래 이렇게 하는건가
  private validFieldMonitor = () => {
    // 진짜 뭘하고 있는지 모르겠다.
    const btnJoin = this.container.querySelector(
      "#btn-join"
    ) as HTMLButtonElement;

    // if (
    //   this.fields.filter((field) => field.isValid).length === this.fields.length
    // ) {
    //   this.active = true;
    //   btnJoin.classList.remove("bg-gray-300");
    //   btnJoin.classList.add("bg-green-500");
    // } else {
    //   this.active = false;
    //   btnJoin.classList.remove("bg-green-500");
    //   btnJoin.classList.add("bg-gray-300");
    // }
  };

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

    idField.addValidateRule(CantContainWhiteSpace);
    idField.addValidateRule(CantStartNumber);
    idField.addValidateRule(MinimumLengthLimit(3));

    this.fields.push(nameField);
    this.fields.push(idField);
    this.fields.push(emailField);
    this.fields.push(passwordField);
    this.fields.push(addressField);
  }

  private onSubmit(e: Event) {
    e.preventDefault();
    console.log(1);
    // 일반적으로 HTML 폼이 제출될 때 페이지가 새로고침되는 것이 기본 동작입니다. 하지만 때때로 웹 애플리케이션에서는 페이지 새로고침 없이 폼을 처리하고자 합니다
    // if (this.active) {
    //   const submitData = {};
    //   console.log("onSubmit", submitData);
    // } else {
    //   console.log("disable submit");
    // }
  }

  public render() {
    this.container.innerHTML = this.template();
    this.fields.forEach((field) => {
      field.render(true);
    });
    this.container.addEventListener("submit", this.onSubmit);
  }
}
