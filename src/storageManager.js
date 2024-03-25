import Category from "./category";

export default class StorageManager {
  constructor() {
    this.categories = this.loadCategories();
  }

  saveCategories() {
    const categoriesToStore = JSON.stringify(this.categories);
    localStorage.setItem("categories", categoriesToStore);
  }

  loadCategories() {
    const storedCategories = JSON.parse(localStorage.getItem("categories"));
    let categories = [];

    if (
      storedCategories &&
      Array.isArray(storedCategories) &&
      storedCategories.length > 0
    ) {
      categories = Object.assign(categories, storedCategories);
    } else {
      categories.push(new Category("Default category", "#aa86ff"));
    }
    return categories;
  }

  removeTodoFromCategory(category, todoId) {
    let categoryToReturn = null;
    this.categories.forEach((cat) => {
      if (cat.id === category.id) {
        cat.entries = cat.entries.filter((entry) => entry.id !== todoId);
        categoryToReturn = cat;
      }
    });

    this.saveCategories();
    return categoryToReturn;
  }

  addTodoToCategory(categoryId, todo) {
    let categoryToReturn = null;
    this.categories.forEach((cat) => {
      if (cat.id === categoryId) {
        cat.entries.push(todo);
        categoryToReturn = cat;
        return;
      }
    });
    return categoryToReturn;
  }

  updateTodo(categoryId, todo) {
    let categoryToReturn = null;

    this.categories.forEach((cat) => {
      if (cat.id === categoryId) {
        cat.entries.forEach((entry) => {
          if (entry.id === todo.id) {
            Object.assign(entry, todo);
            categoryToReturn = cat;
            return;
          }
        });
        return;
      }
    });
    return categoryToReturn;
  }

  updateCategory(category) {
    let categoryToReturn = null;
    this.categories.forEach((cat) => {
      if (cat.id === category.id) {
        Object.assign(cat, category);
        categoryToReturn = cat;
        return;
      }
    });
    return categoryToReturn;
  }

  addCategory(category) {
    this.categories.push(category);
    return category;
  }

  getCategoryById(id) {
    let categoryToReturn = this.categories.find((cat) => cat.id === id);
    return categoryToReturn;
  }

  deleteCategoryById(id) {
    this.categories = this.categories.filter((cat) => cat.id !== id);
    this.saveCategories();
    return this.categories[0];
  }
}
