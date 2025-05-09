// Маска для телефона
document.getElementById('phoneInput').addEventListener('input', function(e) {
  let x = e.target.value.replace(/\D/g, '').match(/(\d{0,1})(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/);
  e.target.value = !x[2] ? '+7' + x[1] : '+7 (' + x[2] + (x[3] ? ') ' + x[3] : '') + (x[4] ? '-' + x[4] : '') + (x[5] ? '-' + x[5] : '');
});

// Показать форму
function showForm() {
  document.getElementById("formContainer").style.display = "block";
  document.getElementById("cabinetContainer").style.display = "none";
}

// Показать кабинет
function showCabinet() {
  document.getElementById("formContainer").style.display = "none";
  document.getElementById("cabinetContainer").style.display = "block";
  loadAppeals();
}

// Отправка обращения (без проверки ролей)
document.getElementById("appealForm").addEventListener("submit", async function(e) {
  e.preventDefault();
  const phoneInput = document.getElementById('phoneInput');
  const phoneValue = phoneInput.value.replace(/\D/g, '');
  
  if (phoneValue.length !== 11) {
    alert('Введите полный номер телефона (11 цифр)');
    return;
  }
  
  const data = new FormData(e.target);
  const userId = localStorage.getItem("userId");
  
  try {
    const response = await fetch('api/submit_appeal.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: userId,
        name: data.get("name"),
        email: data.get("email"),
        phone: phoneInput.value,
        category: data.get("category"),
        description: data.get("description")
      })
    });
    
    const result = await response.json();
    if (result.error) throw new Error(result.error);
    
    alert("Обращение отправлено!");
    e.target.reset();
    showCabinet();
  } catch (error) {
    alert('Ошибка: ' + error.message);
  }
});

// Загрузка обращений
async function loadAppeals() {
  const appealsList = document.getElementById("appealsList");
  appealsList.innerHTML = "Загрузка...";
  const userId = localStorage.getItem("userId");
  
  try {
    const response = await fetch(`api/get_appeals.php?userId=${userId}`);
    const appeals = await response.json();
    
    if (appeals.error) throw new Error(appeals.error);
    
    appealsList.innerHTML = appeals.length === 0 
      ? "<p>У вас нет обращений</p>"
      : appeals.map(appeal => `
          <div class="appeal-item">
            <strong>${appeal.category}</strong> (${new Date(appeal.created_at).toLocaleDateString()})<br>
            <p>${appeal.description}</p>
            <p>Статус: ${appeal.status}</p>
          </div>
        `).join('');
  } catch (error) {
    appealsList.innerHTML = `<p>Ошибка: ${error.message}</p>`;
  }
}