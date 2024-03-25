import Category from "./category";
import Todo from "./todo";
import { format, parseISO } from "date-fns";

const todoTitle = document.querySelector("#todoTitle");
const todoDescription = document.querySelector("#todoDescription");
const todoTime = document.querySelector("#todoTime");
const categoriesElement = document.querySelector(".categories");
const contentTitle = document.querySelector("#content-title");
const todos = document.querySelector(".todos");
const instruction = document.querySelector("#instruction");
const editor = document.querySelector("#editor");
const editorForms = document.querySelectorAll(".editor-form");
const btnAddTodo = document.querySelector(".add-todo");
const btnScroller = document.querySelector(".scroller");
const btnConfirmTodo = document.querySelector("#btnConfirmTodo");
const btnCancelTodo = document.querySelector("#btnCancelTodo");
const errDescription = document.querySelector("#errDescription");
const errTitle = document.querySelector("#errTitle");
const errTime = document.querySelector("#errTime");
const content = document.querySelector(".content");
const btnNewCategory = document.querySelector(".new-category");
const categoryEditor = document.querySelector("#category-editor");
const categoryTitle = document.querySelector("#categoryTitle");
const errCategoryTitle = document.querySelector("#errCategoryTitle");
const colorPicker = document.querySelector("#colorPicker");
const dangerZone = document.querySelector("#dangerZone");
const btnDanger = document.querySelector("#btnDanger");
const btnEditCategory = document.querySelector(".edit-category");
const btnCancelCategory = document.querySelector("#btnCancelCategory");
const btnConfirmCategory = document.querySelector("#btnConfirmCategory");
const cbDanger = document.querySelector("#cbDanger");
const cbComplete = document.querySelector("#cbComplete");

let categoryElements = [];
let currentCategory = null;
let currentTodo = null;
let isCategoryEdit = false;

export default class UiManager {
  constructor(storageManager) {
    this.storageManager = storageManager;
    this.todos = [];

    this.renderCategories(true);
    this.setupEventListeners();
  }

  setupEventListeners() {
    btnAddTodo.addEventListener("click", () => this.beginEditTodo());
    [...editorForms].forEach((ef) =>
      ef.addEventListener("click", (e) => e.stopPropagation())
    );
    [btnCancelTodo, editor].forEach((x) =>
      x.addEventListener("click", () => this.cancelTodoEdit())
    );
    [btnCancelCategory, categoryEditor].forEach((x) =>
      x.addEventListener("click", () => this.cancelCategoryEdit())
    );
    btnConfirmTodo.addEventListener("click", () => this.confirmTodoEdit());
    btnConfirmCategory.addEventListener("click", () =>
      this.confirmCategoryEdit(isCategoryEdit)
    );
    btnScroller.addEventListener("click", () => {
      contentTitle.scrollIntoView();
    });

    btnNewCategory.addEventListener("click", () =>
      this.beginEditCategory(false)
    );

    btnEditCategory.addEventListener("click", () => {
      this.beginEditCategory(true);
    });

    btnDanger.addEventListener("click", () => this.deleteCategory());

    cbDanger.addEventListener("click", () => this.toggleDanger());
  }

  toggleTodoComplete(el) {
    el.classList.toggle("complete");
  }

  toggleDanger() {
    btnDanger.disabled = !cbDanger.checked;
  }

  deleteCategory() {
    currentCategory = this.storageManager.deleteCategoryById(
      currentCategory.id
    );
    this.renderCategories(true);
    this.cancelCategoryEdit();
  }

  checkScroll() {
    if (content.scrollHeight > content.clientHeight) {
      btnScroller.classList.remove("hidden");
    } else {
      btnScroller.classList.add("hidden");
    }
  }

  renderCategories(isInitial, isNew) {
    categoriesElement.innerHTML = "";
    categoryElements = [];
    this.storageManager.categories.forEach((category) => {
      let newCategoryElement = this.createCategoryListItem(category);
      categoriesElement.appendChild(newCategoryElement);
      categoryElements.push(newCategoryElement);
    });

    currentCategory = isInitial
      ? this.storageManager.categories[0]
      : currentCategory;

    if (isInitial) {
      categoryElements[0].classList.add("selected");
    } else if (!isInitial && isNew) {
      categoryElements[categoryElements.length - 1].classList.add("selected");
    }
    this.renderTodosForCategory();
  }

  changeActiveCategory(id, element, isAdd) {
    categoryElements.forEach((ce) => ce.classList.remove("selected"));
    currentCategory = this.storageManager.getCategoryById(id);
    element.classList.add("selected");
    this.renderTodosForCategory();
  }

  updateColors(currentCategory) {
    [btnEditCategory, btnScroller, btnAddTodo].forEach((btn) => {
      btn.style.backgroundColor = currentCategory
        ? currentCategory.color
        : "#aa86ff";
    });
  }

  renderTodosForCategory() {
    let category = currentCategory;
    contentTitle.textContent = category.name;

    todos.innerHTML = "";

    if (category.entries.length < 1 || category.entries == null) {
      instruction.innerText =
        "This category is empty. Begin by adding your first entry to this category!";
      instruction.classList.add("centered");
      this.updateColors(category);
      this.checkScroll();
      return;
    } else {
      instruction.classList.remove("centered");
      instruction.innerText = "Click todo to edit:";
    }

    category.entries.forEach((entry) => {
      let todo = this.createTodoElement(entry);
      todos.appendChild(todo);
      todo.addEventListener("click", () => {
        this.beginEditTodo(entry);
      });
    });

    this.updateColors(category);
    this.checkScroll();
    return;
  }

  createCategoryListItem(category) {
    var li = document.createElement("li");
    li.className = "category";

    var categoryName = document.createTextNode(category.name);

    var fragmentDiv = document.createElement("div");
    fragmentDiv.className = "fragment";
    fragmentDiv.style.background = category.color;

    li.appendChild(categoryName);
    li.appendChild(fragmentDiv);

    li.addEventListener("click", (e) =>
      this.changeActiveCategory(category.id, e.target)
    );

    return li;
  }

  createTodoElement(todo) {
    var todoDiv = document.createElement("div");
    todoDiv.innerHTML = "";

    todoDiv.id = todo.id;
    todoDiv.className = "todo";

    var todoTitle = document.createElement("h3");
    todoTitle.className = "todo-title";
    todoTitle.textContent = todo.name;

    var todoDescription = document.createElement("p");
    todoDescription.className = "todo-description";
    todoDescription.textContent = todo.description;

    var todoTimeDiv = document.createElement("div");
    todoTimeDiv.className = "todo-time";

    const parsedDate = parseISO(todo.date);
    const timeFormat = format(parsedDate, "HH:mm");
    const dateFormat = format(parsedDate, "dd. MMMM yyyy.");

    var time1 = document.createElement("h4");
    time1.textContent = timeFormat;
    var time2 = document.createElement("h4");
    time2.textContent = dateFormat;

    todoTimeDiv.appendChild(time1);
    todoTimeDiv.appendChild(time2);

    var markerDiv = document.createElement("div");
    markerDiv.className = "marker";
    markerDiv.style.backgroundColor = currentCategory.color;

    var deleteDiv = document.createElement("div");
    deleteDiv.className = "delete";
    deleteDiv.style.backgroundColor = currentCategory.color;

    deleteDiv.addEventListener("click", (e) => {
      e.stopPropagation();
      this.deleteTodo(todo.id);
    });

    var deleteImg = document.createElement("img");
    deleteImg.src = "public/delete.png";

    deleteDiv.appendChild(deleteImg);

    todoDiv.appendChild(todoTitle);
    todoDiv.appendChild(todoDescription);
    todoDiv.appendChild(todoTimeDiv);
    todoDiv.appendChild(markerDiv);
    todoDiv.appendChild(deleteDiv);

    if (todo.complete) todoDiv.classList.add("complete");

    return todoDiv;
  }

  deleteTodo(id) {
    currentCategory = this.storageManager.removeTodoFromCategory(
      currentCategory,
      id
    );
    this.renderTodosForCategory();
  }

  beginEditTodo(todo) {
    editor.classList.remove("hidden");

    if (todo) {
      currentTodo = todo;

      this.setEditFormValues(currentTodo);
    }
  }

  getRandomHexColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";

    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }

    return color;
  }

  beginEditCategory(isEdit) {
    isCategoryEdit = isEdit;

    dangerZone.classList.add("hidden");
    categoryEditor.classList.remove("hidden");

    if (isEdit) {
      if (this.storageManager.categories.length > 1)
        dangerZone.classList.remove("hidden");
      this.setCategoryEditFormValues(currentCategory);
    } else {
      colorPicker.value = this.getRandomHexColor();
    }
  }

  setCategoryEditFormValues(category) {
    categoryTitle.value = category.name;
    colorPicker.value = category.color;
  }

  setEditFormValues(todo) {
    todoTitle.value = todo.name;
    todoDescription.value = todo.description;
    todoTime.value = todo.date;
    cbComplete.checked = todo.complete;
  }

  cancelTodoEdit() {
    editor.classList.add("hidden");
    currentTodo = null;
    this.resetEditTodoInputs();
  }

  cancelCategoryEdit() {
    isCategoryEdit = false;
    categoryEditor.classList.add("hidden");
    this.resetEditCategoryInputs();
  }

  checkIfCategoryValuesValid() {
    let isValid = true;
    errCategoryTitle.classList.add("hidden");
    let invalidInputs = [];

    if (categoryTitle.value === "" || categoryTitle.value.length > 30) {
      isValid = false;
      invalidInputs.push(errCategoryTitle);
    }

    invalidInputs.forEach((err) => err.classList.remove("hidden"));
    return isValid;
  }

  checkIfTodoValuesValid() {
    let isValid = true;
    [errTitle, errDescription, errTime].forEach((err) =>
      err.classList.add("hidden")
    );
    let invalidInputs = [];

    if (todoTitle.value === "") {
      isValid = false;
      invalidInputs.push(errTitle);
    }
    if (todoDescription.value === "") {
      isValid = false;
      invalidInputs.push(errDescription);
    }
    if (todoTime.value === "") {
      isValid = false;
      invalidInputs.push(errTime);
    } else {
      let date = new Date(todoTime.value);
      if (isNaN(date)) {
        isValid = false;
        invalidInputs.push(errTime);
      }
    }

    invalidInputs.forEach((err) => err.classList.remove("hidden"));
    return isValid;
  }

  confirmCategoryEdit(isEdit) {
    let isNew = false;
    if (isEdit) {
      if (this.checkIfCategoryValuesValid()) {
        currentCategory = {
          id: currentCategory.id,
          name: categoryTitle.value,
          color: colorPicker.value,
          entries: currentCategory.entries,
        };

        currentCategory = this.storageManager.updateCategory(currentCategory);
      } else return;
    } else {
      if (this.checkIfCategoryValuesValid()) {
        let category = new Category(categoryTitle.value, colorPicker.value);
        currentCategory = this.storageManager.addCategory(category);
        isNew = true;
      } else return;
    }

    this.storageManager.saveCategories();
    this.resetEditCategoryInputs();
    categoryEditor.classList.add("hidden");
    isCategoryEdit = false;
    this.renderCategories(false, isNew);
    this.updateColors(currentCategory);
  }

  confirmTodoEdit() {
    if (currentTodo) {
      if (this.checkIfTodoValuesValid()) {
        currentTodo = {
          id: currentTodo.id,
          name: todoTitle.value,
          description: todoDescription.value,
          date: todoTime.value,
          color: currentCategory.color,
          complete: cbComplete.checked,
        };

        currentCategory = this.storageManager.updateTodo(
          currentCategory.id,
          currentTodo
        );
      } else return;
    } else {
      if (this.checkIfTodoValuesValid()) {
        currentTodo = new Todo(
          todoTitle.value,
          todoTime.value,
          todoDescription.value,
          currentCategory.color
        );

        currentCategory = this.storageManager.addTodoToCategory(
          currentCategory.id,
          currentTodo
        );
      } else return;
    }

    this.storageManager.saveCategories();
    this.resetEditTodoInputs();
    this.renderTodosForCategory();
    editor.classList.add("hidden");
  }

  resetEditTodoInputs() {
    todoTitle.value = "";
    todoDescription.value = "";
    todoTime.value = "";
    cbComplete.checked = false;
    currentTodo = null;
  }

  resetEditCategoryInputs() {
    categoryTitle.value = "";
    dangerZone.classList.add("hidden");
    cbDanger.checked = false;
    btnDanger.disabled = true;
  }

  updateTodoDisplayValues(todo) {
    this.createTodoElement(todo);
  }
}
