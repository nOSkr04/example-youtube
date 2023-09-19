import { ILesson } from "../interface/lesson";

export class Lesson implements ILesson {
  _id: string;
  title: string;
  duration: string;
  url: string;
  createUser: string;
  createdAt: string;
  photo: string;
  seen: number;

  constructor({
    _id,
    title,
    duration,
    url,
    createUser,
    createdAt,
    photo,
    seen,
  }: ILesson) {
    this._id = _id;
    this.title = title;
    this.seen = seen;
    this.duration = duration;
    this.url = url;
    this.createUser = createUser;
    this.createdAt = createdAt;
    this.photo = photo;
  }

  static fromJson(json: ILesson) {
    return new Lesson(json);
  }
}
