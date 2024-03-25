import { v4 as uuidv4 } from "uuid";

export default class Todo {
  constructor(name, date, description, color) {
    this.id = uuidv4();
    this.name = name;
    this.date = date;
    this.description = description;
    this.color = color;
    this.complete = false;
  }
}
