// 인스턴스 : 클래스의 설계도 대로 현실화된 객체
abstract class Shape {
  public static MIN_BORDER_WIDTH = 0;
  public static MAX_BORDER_HEIGHT = 30;
  // 다른 인스턴스와 관계 없이 오직 Shape 클래스에서만 쓰는 경우
  public readonly name: string = "Shape";
  // private > 해당 클래스에서만 통용되는 값
  // protected > 자식 클래스에만 보여줄 수 있는 값
  // readonly는 인스턴스 객체 생성 이후, 외부에서 이 값을 바꿀수 없는 설정

  constructor(borderWidth: number = 0) {}
  abstract area(): number;
}

class Circle extends Shape {
  public readonly name = "Circle";
  private _radius: number;

  constructor(radius: number) {
    super();
    this._radius = radius;
  }
  get radius() {
    return this._radius;
  }

  area() {
    return Math.PI * this._radius ** 2;
  }
}

class Rect extends Shape {
  public readonly name = "Rect";
  private _width: number;
  private _height: number;

  constructor(width: number, height: number) {
    super();
    this._width = width;
    this._height = height;
  }

  get width() {
    return this._width;
  }

  get height() {
    return this._height;
  }

  area() {
    return this._width * this._height;
  }
}

const circle = new Circle(5);
const rect = new Rect(10, 20);

console.log(circle.name);

interface DodyProps {}
class Dody implements DodyProps {
  constructor() {}
}
