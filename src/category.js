import { v4 as uuidv4 } from "uuid";
import Todo from "./todo";

export default class Category {
  constructor(name, color) {
    this.id = uuidv4();
    this.name = name;
    this.color = color;
    this.entries = [];
  }

  removeEntry(id) {
    entries = entry.filter((x) => x.id !== id);
  }

  addEntry(todo) {
    this.entries.push(new Todo(...todo));
  }
}
