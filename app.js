// Маска для телефона
document.getElementById('phoneInput').addEventListener('input', function(e) {
  let x = e.target.value.replace(/\D/g, '').match(/(\d{0,1})(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/);
  e.target.value = !x[2] ? '+7' + x[1] : '+7 (' + x[2] + (x[3] ? ') ' + x[3] : '') + (x[4] ? '-' + x[4] : '') + (x[5] ? '-' + x[5] : '');
});

// DOM элементы
const formContainer = document.getElementById("formContainer");
const cabinetContainer = document.getElementById("cabinetContainer");
const appealsList = document.getElementById("appealsList");

// Показать форму обращения
function showForm() {
  formContainer.style.display = "block";
  cabinetContainer.style.display = "none";
}

// Показать личный кабинет
function showCabinet() {
  formContainer.style.display = "none";
  cabinetContainer.style.display = "block";
  loadAppeals();
}

// Отправка обращения
document.getElementById("appealForm").addEventListener("submit", function(e) {
  const phoneInput = document.getElementById('phoneInput');
  const phoneValue = phoneInput.value.replace(/\D/g, '');
  
  if (phoneValue.length !== 11) {
    alert('Введите полный номер телефона (11 цифр)');
    phoneInput.focus();
    e.preventDefault();
    return;
  }
  
  e.preventDefault();
  const data = new FormData(e.target);
  const appeal = {
    name: data.get("name"),
    email: data.get("email"),
    phone: phoneInput.value,
    category: data.get("category"),
    description: data.get("description"),
    status: "Принято в работу",
    user: localStorage.getItem("currentUser"),
    date: new Date().toLocaleDateString()
  };
  
  const appeals = JSON.parse(localStorage.getItem("appeals") || "[]");
  appeals.push(appeal);
  localStorage.setItem("appeals", JSON.stringify(appeals));
  alert("Обращение отправлено!");
  e.target.reset();
  showCabinet();
});

// Загрузка обращений
function loadAppeals() {
  appealsList.innerHTML = "";
  const currentUser = localStorage.getItem("currentUser");
  const appeals = JSON.parse(localStorage.getItem("appeals") || "[]");
  const userAppeals = appeals.filter(a => a.user === currentUser);
  
  if (userAppeals.length === 0) {
    appealsList.innerHTML = "<p>У вас нет обращений.</p>";
    return;
  }
  
  userAppeals.forEach((item, index) => {
    const div = document.createElement("div");
    div.className = "appeal-item";
    div.innerHTML = `
      <strong>${item.category}</strong> (${item.date})<br />
      <em>${item.description}</em><br />
      Статус: ${item.status}<br />
      Контакты: ${item.name}, ${item.email}, ${item.phone}
    `;
    appealsList.appendChild(div);
  });
}