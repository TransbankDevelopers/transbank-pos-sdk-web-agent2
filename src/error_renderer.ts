import "./styles.css";

window.addEventListener("DOMContentLoaded", () => {
  window.errorAPI.onError(({ errorTitle, errorMessage }) => {
    document.getElementById("title").textContent = errorTitle;
    document.getElementById("msg").textContent = errorMessage;
  });
  document
    .getElementById("close-btn")
    .addEventListener("click", () => window.errorAPI.closeApp());
});
