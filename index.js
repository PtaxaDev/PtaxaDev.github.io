// Конфигурация ссылок
const linksConfig = [
  {
    name: "GitHub",
    url: "https://github.com/PtaxaDev",
    description: "Мои проекты и исходный код",
    icon: "🐙"
  },
  {
    name: "VK",
    url: "https://vk.com/ptaxadev", 
    description: "Социальная сеть и общение",
    icon: "👥"
  },
  {
    name: "Telegram",
    url: "https://t.me/ptaxadev",
    description: "Быстрая связь и чат",
    icon: "✈️"
  },
  {
    name: "Портфолио",
    url: "https://ptaxadev.ru",
    description: "Мои работы и проекты",
    icon: "💼"
  },
  {
    name: "LinkedIn",
    url: "https://linkedin.com/in/ptaxadev",
    description: "Профессиональный профиль",
    icon: "💼"
  },
  {
    name: "YouTube",
    url: "https://youtube.com/@ptaxadev",
    description: "Туториалы и демо",
    icon: "🎥"
  },
  {
    name: "Twitter",
    url: "https://twitter.com/ptaxadev",
    description: "Микроблог и новости",
    icon: "🐦"
  },
  {
    name: "Discord",
    url: "https://discord.gg/ваша-ссылка",
    description: "Сообщество и поддержка",
    icon: "🎮"
  },
  {
    name: "Instagram",
    url: "https://instagram.com/ptaxadev",
    description: "Визуальный контент",
    icon: "📸"
  },
  {
    name: "Документация",
    url: "https://docs.ptaxadev.ru",
    description: "Техническая документация",
    icon: "📚"
  },
  {
    name: "Блог",
    url: "https://blog.ptaxadev.ru",
    description: "Статьи и мысли",
    icon: "✍️"
  },
  {
    name: "GitLab",
    url: "https://gitlab.com/ptaxadev",
    description: "Альтернативные проекты",
    icon: "🦊"
  }
];

// Инициализация страницы
document.addEventListener('DOMContentLoaded', function() {
  const linksContainer = document.getElementById('links-container');
  
  // Создаем карточки ссылок из конфигурации
  linksConfig.forEach(link => {
    createLinkCard(link, linksContainer);
  });
});

// Функция создания карточки ссылки
function createLinkCard(link, container) {
  const linkCard = document.createElement('a');
  linkCard.className = 'link-card';
  linkCard.href = link.url;
  linkCard.target = '_blank';
  linkCard.rel = 'noopener noreferrer';
  
  linkCard.innerHTML = `
    <div class="link-icon">${link.icon}</div>
    <div class="link-content">
      <h3>${link.name}</h3>
      <p>${link.description}</p>
    </div>
    <div class="link-arrow">→</div>
  `;
  
  container.appendChild(linkCard);
}

// Функция для быстрого добавления новой ссылки (для разработки)
function addNewLink(name, url, description, icon = "🔗") {
  const newLink = { name, url, description, icon };
  linksConfig.push(newLink);
  
  // Перерисовываем ссылки
  const linksContainer = document.getElementById('links-container');
  linksContainer.innerHTML = '';
  linksConfig.forEach(link => createLinkCard(link, linksContainer));
}

// Пример использования функции добавления:
// addNewLink("Новый проект", "https://example.com", "Описание проекта", "⭐");