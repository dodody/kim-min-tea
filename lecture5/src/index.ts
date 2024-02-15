import App from "./app";

declare global {
  interface Window {
    Handlebars: any;
  }
}

const app = new App("#root");

app.render();
