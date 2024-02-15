import template from "./password-field.template";

interface Props {
  id: string;
  label: string;
  text?: string;
  require?: boolean;
  placeholder?: string;
}

const DefaultData = {
  id: "",
  label: "",
  text: "",
  require: true,
  placeholer: "",
};
export default class PasswordField {
  private template = template;
  private container: string;
  private data: Props;
  //
  updated: boolean;

  constructor(container: string, data: Props) {
    this.container = container;
    this.data = { ...DefaultData, ...data };
    // !
    this.updated = false;
  }

  redner(append: boolean = false) {
    console.log("render", append);
    const container = document.querySelector(this.container) as HTMLElement;

    if (append) {
      // appendChild
    } else {
      // innerHTML
    }
  }
}
