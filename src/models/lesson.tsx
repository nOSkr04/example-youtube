import { ILesson } from "../interfaces/lesson";

export class Lesson implements ILesson {
  _id: string;
  title: string;
  img: string;
  time: string;
  seen: number;

  constructor({ _id, title, img, time, seen }: ILesson) {
    this._id = _id;
    this.title = title;
    this.img = img;
    this.time = time;
    this.seen = seen;
  }

  static fromJson(json: ILesson) {
    return new Lesson(json);
  }
}
