// DOM элементы
const authContainer = document.getElementById("authContainer");
const mainContainer = document.getElementById("mainContainer");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const loginFormElement = document.getElementById("loginFormElement");
const registerFormElement = document.getElementById("registerFormElement");
const showRegisterLink = document.getElementById("showRegister");
const showLoginLink = document.getElementById("showLogin");
const loginError = document.getElementById("loginError");
const registerError = document.getElementById("registerError");

// Показать/скрыть формы регистрации/авторизации
showRegisterLink.addEventListener("click", function(e) {
  e.preventDefault();
  loginForm.style.display = "none";
  registerForm.style.display = "block";
});

showLoginLink.addEventListener("click", function(e) {
  e.preventDefault();
  registerForm.style.display = "none";
  loginForm.style.display = "block";
});

// Проверка авторизации при загрузке
document.addEventListener("DOMContentLoaded", function() {
  if (isLoggedIn()) {
    showMainPage();
  }
});

// Регистрация
registerFormElement.addEventListener("submit", function(e) {
  e.preventDefault();
  const email = document.getElementById("registerEmail").value;
  const password = document.getElementById("registerPassword").value;
  
  const users = JSON.parse(localStorage.getItem("users") || "{}");
  if (users[email]) {
    registerError.textContent = "Пользователь уже зарегистрирован.";
    return;
  }
  
  users[email] = password;
  localStorage.setItem("users", JSON.stringify(users));
  alert("Регистрация успешна! Теперь вы можете войти.");
  registerForm.style.display = "none";
  loginForm.style.display = "block";
  registerFormElement.reset();
  registerError.textContent = "";
});

// Авторизация
loginFormElement.addEventListener("submit", function(e) {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;
  
  const users = JSON.parse(localStorage.getItem("users") || "{}");
  if (users[email] !== password) {
    loginError.textContent = "Неверные данные входа.";
    return;
  }
  
  localStorage.setItem("currentUser", email);
  showMainPage();
  loginFormElement.reset();
  loginError.textContent = "";
});

// Показать основную страницу
function showMainPage() {
  authContainer.style.display = "none";
  mainContainer.style.display = "block";
}

// Проверка авторизации
function isLoggedIn() {
  return !!localStorage.getItem("currentUser");
}

// Выход (используется в app.js)
function logout() {
  localStorage.removeItem("currentUser");
  mainContainer.style.display = "none";
  authContainer.style.display = "block";
  loginForm.style.display = "block";
  registerForm.style.display = "none";
}