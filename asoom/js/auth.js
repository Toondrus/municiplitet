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
  if (isLoggedIn() && localStorage.getItem("userRole") === 'worker') {
    showWorkerPanel();
  }
});

// Регистрация
registerFormElement.addEventListener("submit", async function(e) {
  e.preventDefault();
  const email = document.getElementById("registerEmail").value;
  const password = document.getElementById("registerPassword").value;
  const workerCode = document.getElementById("workerCode").value;

  try {
    const response = await fetch('http://localhost/asoom/api/register.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, worker_code: workerCode })
    });
    
    const data = await response.json();
    
    if (data.error) {
      registerError.textContent = data.error;
      return;
    }
    
    alert("Регистрация успешна! Роль: " + data.role);
    registerForm.style.display = "none";
    loginForm.style.display = "block";
    registerFormElement.reset();
  } catch (error) {
    registerError.textContent = "Ошибка соединения с сервером";
  }
});

// Авторизация
loginFormElement.addEventListener("submit", async function(e) {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  try {
    const response = await fetch('http://localhost/asoom/api/login.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    // Отладочный вывод
    const rawResponse = await response.text();
    console.log("Raw server response:", rawResponse); // Смотрим "сырой" ответ

    const data = JSON.parse(rawResponse); // Парсим вручную
    
    if (data.error) {
      loginError.textContent = data.error;
      return;
    }
    
    localStorage.setItem("currentUser", email);
    localStorage.setItem("userId", data.userId);
    localStorage.setItem("userRole", data.role); // Сохраняем роль

    if (data.role == 'worker') {
      showWorkerPanel();
    } else {
      showCabinet();
    }
    showMainPage();
  } catch (error) {
    console.error("Full error:", error);
    loginError.textContent = "Ошибка сервера. Проверьте консоль (F12).";
  }
});

// Показать основную страницу
function showMainPage() {
  authContainer.style.display = "none";
  mainContainer.style.display = "block";
  
  const userRole = localStorage.getItem("userRole");
  
  // Скрываем кнопку "Подать обращение" для работников
  if (userRole === 'worker') {
    document.querySelector('.nav-buttons button:first-child').style.display = 'none';
  }
  
  showCabinet(); // Показываем личный кабинет по умолчанию
}

// Проверка авторизации
function isLoggedIn() {
  return !!localStorage.getItem("currentUser");
}

// Выход (используется в app.js)
function logout() {
  localStorage.removeItem("currentUser");
  localStorage.removeItem("userId");
  mainContainer.style.display = "none";
  authContainer.style.display = "block";
  loginForm.style.display = "block";
  registerForm.style.display = "none";
}