const gallery = document.getElementById('gallery');
const categorySelect = document.getElementById('category');

// 🔹 Здесь указываем категории (папки)
const categories = {
  "ariral": "Ariral",
  "weapons": "Оружие",
  "vehicles": "Транспорт",
  "locations": "Локации",
  "characters": "Персонажи",
};

// Заполнение селектора
for (const key in categories) {
  const option = document.createElement('option');
  option.value = key;
  option.textContent = categories[key];
  categorySelect.appendChild(option);
}

// Выбор первой категории по умолчанию
loadCategory(Object.keys(categories)[0]);

categorySelect.addEventListener('change', (e) => {
  loadCategory(e.target.value);
});

function loadCategory(category) {
  gallery.innerHTML = '';

  const folderPath = `/assets/images/${category}/`;
  const fileExtension = '.png';
  const maxImages = 200;

  for (let i = 1; i <= maxImages; i++) {
    const img = new Image();
    img.src = `${folderPath}${i}${fileExtension}`;

    img.onload = () => {
      const card = document.createElement('div');
      card.className = 'card';
      card.appendChild(img);
      gallery.appendChild(card);
    };

    img.onerror = () => {};
  }
}
