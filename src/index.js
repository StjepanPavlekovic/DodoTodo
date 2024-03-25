import StorageManager from "./storageManager";
import UiManager from "./uiManager";

let storageManager = null;
let uiManager = null;

window.onload = () => {
  Initialize();
};

function Initialize() {
  storageManager = new StorageManager();
  uiManager = new UiManager(storageManager);
}
