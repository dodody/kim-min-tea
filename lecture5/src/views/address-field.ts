import template from "./address-field.template";

interface Props {
  id: string;
  label: string;
  require?: boolean;
}

const DefaultData = {
  id: "",
  label: "label",
  require: true,
};

export default class AddressField {
  private template = template;
  private container: string;
  private data: Props;

  constructor(container: string, data: Props) {
    this.container = container;
    this.data = { ...DefaultData, ...data };
  }

  redner(append: boolean = false) {
    console.log("render", append);
    const container = document.querySelector(this.container) as HTMLElement;

    if (append) {
      // appendChild
    } else {
      // innerHtml
    }
  }
}
