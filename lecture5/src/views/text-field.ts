import { RequireRule } from "../static/validation";
import { ValidateRule } from "../types";
import template from "./text-field.template";

interface Props {
  id: string;
  label: string;
  require?: boolean;
  type: "text" | "email" | "number";
  text?: string;
  placeholder?: string;
}

const DefaultData = {
  id: "",
  type: "text",
  text: "",
  label: "",
  require: true,
  placeholer: "",
};

export default class TextField {
  private template = template;
  private container: string; // 여기는 왜 string인지 모르겟네
  private data: Props;
  validateRule: ValidateRule[] = [];
  //
  private valid: boolean;
  private updated: boolean;

  constructor(container: string, data: Props) {
    this.container = container;
    this.data = { ...DefaultData, ...data };

    if (data.require) {
      this.addValidateRule(RequireRule);
    }
  }

  private onChange = (e: Event) => {};

  private attachEventHandler() {
    document
      .querySelector(this.container)
      ?.addEventListener("change", this.onChange);
  }

  public addValidateRule(rule: ValidateRule) {
    this.validateRule.push(rule);
    //
  }

  private buildData = () => {};

  // 솔직히 이 프로젝트에서는 append가 false인 상황이 있어야 하는 이유를 모르겠음.
  public render = () => {
    const container = document.querySelector(this.container) as HTMLElement;

    const divFragment = document.createElement("div");
    divFragment.innerHTML = this.template(this.buildData());

    container.appendChild(divFragment.children[0]);
  };
}
