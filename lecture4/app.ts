type tStore = { currentPage: number; feeds: tNewsFeed[] };

interface tNews {
  readonly id: number; // id를 변경할 수 없는
  readonly title: string;
  readonly user: string;
  readonly url: string;
  readonly time_ago: string;
  readonly content: string;
}

interface tNewsFeed extends tNews {
  readonly comments_count: number;
  read?: boolean; // writable writable
  readonly url: string;
  readonly points: number;
}

interface tNewsDetail extends tNews {
  readonly comments: tComment[];
}

interface tComment extends tNews {
  readonly level: number;
  readonly comments: tComment[];
}

const NEWS_URL = "https://api.hnpwa.com/v0/news/1.json";
const CONTENT_URL = "https://api.hnpwa.com/v0/item/@id.json";
const store: tStore = {
  currentPage: 1,
  feeds: [],
};

function applyApiMixins(targetClass: any, baseClasses: any[]): void {
  baseClasses.forEach((baseClass) => {
    Object.getOwnPropertyNames(baseClass.prototype).forEach((name) => {
      Object.defineProperty(
        targetClass.prototype,
        name,
        Object.getOwnPropertyDescriptor(baseClass.prototype, name)
      );
    });
  });
}

class Api {
  getRequest<AjaxResponse>(url: string): AjaxResponse {
    const ajax = new XMLHttpRequest();
    ajax.open("GET", url, false);
    ajax.send();

    return JSON.parse(ajax.response);
  }
}

class NewsFeedApi {
  getData(): tNewsFeed[] {
    return this.getRequest<tNewsFeed[]>(NEWS_URL);
  }
}

class NewsDetailApi {
  getData(id: string): tNewsDetail {
    return this.getRequest<tNewsDetail>(CONTENT_URL.replace("@id", id));
  }
}

// 타입스크립트한테, 두가지 class가 합성된거라는걸 알려줘야하는데, interface 선언해준다.
interface NewsFeedApi extends Api {}
interface NewsDetailApi extends Api {}
applyApiMixins(NewsFeedApi, [Api]);
applyApiMixins(NewsDetailApi, [Api]);

class View {
  template: string;
  container: HTMLElement | null;
  htmlList: string[];
  // ! detail view에서 title 부분이 replace 되면 title 위치가 사라져다시 사용할 수 없으니, 원본 template를 가지고 있어야한다.

  constructor(template: string, containerId: string) {
    const containerElement = document.getElementById(containerId);

    if (containerElement === null) {
      throw "최상위 컨테이너가 없어서 앱을 종료합니다.";
    }

    this.template = template;
    this.container = containerElement;
    this.htmlList = [];
  }

  addHtml(htmlString: string): void {
    this.htmlList.push(htmlString);
  }

  getHtml(): string {
    return this.htmlList.join("");
  }

  replaceTemplate(name: string, value: string): string {
    return this.template.replace(`{{__${name}__}}`, value);
  }

  protected updateView(): void {
    // ? this.container.innerHTML = html;
    // ? 갑자기 이걸 왜 하는거지?
    this.container.innerHTML = this.template;
  }
}

// 빈 배열에 html 문자열을 계속 추가해주는 방식
class NewsFeedView extends View {
  newsFeed: tNewsFeed[] = store.feeds;
  api: NewsFeedApi;
  newsList: string[] = [];

  constructor(containerId: string) {
    let template = `
    <div class="bg-gray-600 min-h-screen">
    <div class="bg-white text-xl">
    <div class="mx-auto px-4">
    <div class="flex justify-between items-center py-6">
    <div class="flex justify-start">
    <h1 class="font-extrabold">Hacker News</h1>
    </div>
            <div class="items-center justify-end">
              <a href="#/page/{{__prev_page__}}" class="text-gray-500">
              Previous
              </a>
              <a href="#/page/{{__next_page__}}" class="text-gray-500 ml-4">
                Next
                </a>
                </div>
                </div> 
                </div>
                </div>
      <div class="p-4 text-2xl text-gray-700">
        {{__news_feed__}}        
        </div>
        </div>
        `;

    super(template, containerId);

    this.api = new NewsFeedApi();
    this.newsFeed = this.api.getData();

    if (this.newsFeed.length === 0) {
      this.newsFeed = store.feeds;
      this.makeFeeds();
    }
  }

  makeFeeds(): void {
    for (let i = 0; i < this.newsFeed.length; i++) {
      this.newsFeed[i].read = false;
    }
  }

  render(): void {
    for (
      let i = (store.currentPage - 1) * 10;
      i < store.currentPage * 10;
      i++
    ) {
      const { id, title, comments_count, user, points, time_ago, read } =
        this.newsFeed[i];
      this.addHtml(`
      <div class="p-6 ${
        read ? "bg-red-500" : "bg-white"
      } mt-6 rounded-lg shadow-md transition-colors duration-500 hover:bg-green-100">
        <div class="flex">
          <div class="flex-auto">
            <a href="#/show/${id}">${title}</a>  
          </div>
          <div class="text-center text-sm">
            <div class="w-10 text-white bg-green-300 rounded-lg px-0 py-2">${comments_count}</div>
          </div>
        </div>
        <div class="flex mt-3">
          <div class="grid grid-cols-3 text-sm text-gray-500">
            <div><i class="fas fa-user mr-1"></i>${user}</div>
            <div><i class="fas fa-heart mr-1"></i>${points}</div>
            <div><i class="far fa-clock mr-1"></i>${time_ago}</div>
          </div>  
        </div>
      </div>    
    `);
    }

    this.template = this.replaceTemplate("news_feed", this.getHtml());
    this.template = this.replaceTemplate(
      "prev_page",
      `${store.currentPage > 1 ? store.currentPage - 1 : 1}`
    );
    this.template = this.replaceTemplate(
      "next_page",
      `${store.currentPage + 1}`
    );

    this.updateView(this.template);
  }
}

class NewsDetailView extends View {
  readonly id = location.hash.substr(7);
  newsContent: tNewsDetail;
  api: NewsDetailApi;

  // ? this.newsContent.title, this.newsContent.content 를 {{__title__}}, {{__content__}} 이런 식으로 바꿔서 핸들링 하는데 그것 말고 다른 방식은 없을까?

  constructor(containerId: string) {
    let template = `
    <div class="bg-gray-600 min-h-screen pb-8">
    <div class="bg-white text-xl">
    <div class="mx-auto px-4">
    <div class="flex justify-between items-center py-6">
    <div class="flex justify-start">
    <h1 class="font-extrabold">Hacker News</h1>
    </div>
    <div class="items-center justify-end">
    <a href="#/page/${store.currentPage}" class="text-gray-500">
    <i class="fa fa-times"></i>
    </a>
    </div>
    </div>
    </div>
    </div>
    <div class="h-full border rounded-xl bg-white m-6 p-4 ">
    <h2>{{__title__}}</h2>
    <div class="text-gray-400 h-20">{{__content__}}</div>
    {{__comments__}}
    </div>
    </div>
    `;

    super(template, containerId);
    this.api = new NewsDetailApi();
  }

  render(): void {
    const api = new NewsDetailApi();
    this.newsContent = api.getData(this.id);

    for (let i = 0; i < store.feeds.length; i++) {
      if (store.feeds[i].id === Number(this.id)) {
        store.feeds[i].read = true;
        break;
      }
    }

    this.updateView(this.replaceTemplate("comments", this.makeComment()));
    this.updateView(this.replaceTemplate("title", this.newsContent.title));
    this.updateView(this.replaceTemplate("content", this.newsContent.content));
  }

  makeComment(): string {
    const { comments } = this.newsContent;
    for (let i = 0; i < comments.length; i++) {
      const comment: tComment = comments[i];
      this.addHtml(`
          <div style="padding-left: ${comment.level * 40}px;" class="mt-4">
            <div class="text-gray-400">
              <i class="fa fa-sort-up mr-2"></i>
              <strong>${comment.user}</strong> ${comment.time_ago}
            </div>
            <p class="text-gray-700">${comment.content}</p>
          </div>      
        `);
      if (comment.comments.length > 0) {
        this.addHtml(this.makeComment());
      }
    }
    return this.getHtml();
  }
}

function router(): void {
  const routePath = location.hash;
  const newsView = new NewsFeedView("root");
  const newsDetailView = new NewsDetailView("root");

  if (routePath === "") {
    newsView.render();
  } else if (routePath.indexOf("#/page/") >= 0) {
    store.currentPage = Number(routePath.substr(7));
    newsView.render();
  } else {
    newsDetailView.render();
  }
}

window.addEventListener("hashchange", router);
router();
