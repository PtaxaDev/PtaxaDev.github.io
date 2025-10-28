// ---------------------------
// Конфигурация и константы
// ---------------------------
const CONFIG = {
  ITEMS_COUNT: 180,
  SCROLL_SENSITIVITY: 0.5,
  LAZY_LOAD_THRESHOLD: 10
};

// ---------------------------
// Модели данных
// ---------------------------

// Общие новости
const news = [
  { 
    id: 1, 
    title: "Новость 1", 
    text: "Описание новости 1",
    date: "2024-01-15",
    type: "update"
  },
  { 
    id: 2, 
    title: "Новость 2", 
    text: "Описание новости 2",
    date: "2024-01-14",
    type: "event"
  },
  { 
    id: 3, 
    title: "Новость 3", 
    text: "Описание новости 3",
    date: "2024-01-13",
    type: "maintenance"
  }
];

// Персональные новости
const personalNews = [
  { 
    id: 1, 
    title: "Ваша игровая сессия была отмечена",
    date: "2024-01-15",
    read: false
  },
  { 
    id: 2, 
    title: "Новое достижение разблокировано",
    date: "2024-01-14",
    read: true
  },
  { 
    id: 3, 
    title: "Доступно обновление для вашей любимой игры",
    date: "2024-01-13",
    read: false
  }
];

// ---------------------------
// Утилитарные функции
// ---------------------------

// Функция генерации массива игр
function generateGames(count) {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    banner: `/public/assets/images/test/gameimg/${(i % 20) + 1}.png`,
    name: `Игра ${i + 1}`,
    rating: (Math.random() * 5).toFixed(1),
    players: Math.floor(Math.random() * 10000),
    category: ['Экшен', 'Стратегия', 'RPG', 'Гонки', 'Пазл'][i % 5]
  }));
}

// Генерация данных
const newGames = generateGames(CONFIG.ITEMS_COUNT);
const recommendations = generateGames(CONFIG.ITEMS_COUNT);
const playedBefore = generateGames(CONFIG.ITEMS_COUNT);

// Логирование для отладки
console.log('Новые игры:', newGames.slice(0, 3));
console.log('Рекомендации:', recommendations.slice(0, 3));
console.log('Играли ранее:', playedBefore.slice(0, 3));

// ---------------------------
// DOM функции
// ---------------------------

// Создание карточки игры
function createCard(item) {
  const card = document.createElement("div");
  card.className = "card";
  card.setAttribute('data-game-id', item.id);
  card.setAttribute('role', 'listitem');
  
  // Обертка для изображения
  const imageWrapper = document.createElement("div");
  imageWrapper.className = "card-image";
  
  const img = document.createElement("img");
  img.src = item.banner;
  img.alt = `Обложка игры: ${item.name}`;
  img.loading = "lazy";
  img.addEventListener('error', () => {
    img.src = '/public/assets/images/placeholder.jpg';
  });
  
  imageWrapper.appendChild(img);
  
  // Текст карточки
  const text = document.createElement("div");
  text.className = "card-text";
  
  // Название игры и рейтинг в одной строке
  const titleRow = document.createElement("div");
  titleRow.className = "card-title-row";
  
  const title = document.createElement("div");
  title.className = "card-title";
  title.textContent = item.name;
  
  const rating = document.createElement("div");
  rating.className = "card-rating";
  rating.textContent = `⭐ ${item.rating}`;
  
  titleRow.appendChild(title);
  titleRow.appendChild(rating);
  
  // Мета-информация
  const meta = document.createElement("div");
  meta.className = "card-meta";
  meta.textContent = `${item.category} • ${item.players.toLocaleString()} игроков`;
  
  text.appendChild(titleRow);
  text.appendChild(meta);
  
  card.appendChild(imageWrapper);
  card.appendChild(text);
  
  // Обработчик клика
  card.addEventListener('click', () => {
    handleCardClick(item);
  });
  
  return card;
}

// Создание элемента новости
function createNewsItem(item, isPersonal = false) {
  const div = document.createElement("div");
  div.className = isPersonal ? "personal-news-item" : "news-item";
  div.setAttribute('data-news-id', item.id);
  
  if (isPersonal && !item.read) {
    div.classList.add('unread');
  }
  
  const title = document.createElement("div");
  title.className = "news-title";
  title.textContent = item.title;
  
  const content = document.createElement("div");
  content.className = "news-content";
  
  if (isPersonal) {
    const date = document.createElement("div");
    date.className = "news-date";
    date.textContent = formatDate(item.date);
    content.appendChild(date);
  } else {
    content.textContent = item.text;
    
    const meta = document.createElement("div");
    meta.className = "news-meta";
    meta.textContent = `${formatDate(item.date)} • ${getTypeLabel(item.type)}`;
    div.appendChild(meta);
  }
  
  div.appendChild(title);
  div.appendChild(content);
  
  // Отметка как прочитанной
  if (isPersonal && !item.read) {
    div.addEventListener('click', () => {
      div.classList.remove('unread');
      markAsRead(item.id);
    });
  }
  
  return div;
}

// ---------------------------
// Обработчики событий
// ---------------------------

// Обработчик клика по карточке
function handleCardClick(game) {
  console.log('Выбрана игра:', game.name);
  // Здесь будет навигация на страницу игры
  // window.location.href = `/game/${game.id}`;
}

// Отметка новости как прочитанной
function markAsRead(newsId) {
  const newsItem = personalNews.find(item => item.id === newsId);
  if (newsItem) {
    newsItem.read = true;
    console.log(`Новость ${newsId} отмечена как прочитанная`);
  }
}

// Обработчик горизонтального скролла
function setupHorizontalScroll() {
  document.querySelectorAll('.cards').forEach(container => {
    let isScrolling = false;
    
    container.addEventListener('wheel', (e) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        container.scrollLeft += e.deltaY * CONFIG.SCROLL_SENSITIVITY;
      }
    }, { passive: false });
    
    // Оптимизация производительности при скролле
    container.addEventListener('scroll', () => {
      if (!isScrolling) {
        window.requestAnimationFrame(() => {
          handleScroll(container);
          isScrolling = false;
        });
        isScrolling = true;
      }
    });
  });
}

// Ленивая загрузка карточек при скролле
function handleScroll(container) {
  const cards = container.querySelectorAll('.card');
  const containerRect = container.getBoundingClientRect();
  
  cards.forEach(card => {
    const cardRect = card.getBoundingClientRect();
    const isVisible = cardRect.left < containerRect.right + 300 && 
                     cardRect.right > containerRect.left - 300;
    
    if (isVisible) {
      card.classList.add('visible');
    }
  });
}

// ---------------------------
// Вспомогательные функции
// ---------------------------

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('ru-RU');
}

function getTypeLabel(type) {
  const labels = {
    update: 'Обновление',
    event: 'Событие',
    maintenance: 'Техработы'
  };
  return labels[type] || type;
}

// ---------------------------
// Инициализация
// ---------------------------

function initializeApp() {
  console.log('Инициализация приложения...');
  
  try {
    // Заполнение новостей
    const newsList = document.getElementById("news-list");
    news.forEach(item => {
      newsList.appendChild(createNewsItem(item));
    });
    
    // Заполнение персональных новостей
    const personalContainer = document.getElementById("personal-news-list");
    personalNews.forEach(item => {
      personalContainer.appendChild(createNewsItem(item, true));
    });
    
    // Заполнение секций с играми
    const sections = [
      { id: "new-games-cards", data: newGames },
      { id: "recommendations-cards", data: recommendations },
      { id: "played-before-cards", data: playedBefore }
    ];
    
    sections.forEach(section => {
      const container = document.getElementById(section.id);
      section.data.slice(0, 20).forEach(item => {
        container.appendChild(createCard(item));
      });
    });
    
    // Настройка скролла
    setupHorizontalScroll();
    
    console.log('Приложение успешно инициализировано');
    
  } catch (error) {
    console.error('Ошибка при инициализации:', error);
  }
}

// Запуск приложения после загрузки DOM
document.addEventListener('DOMContentLoaded', initializeApp);