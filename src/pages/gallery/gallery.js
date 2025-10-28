const categoriesGallery = document.getElementById('categories-gallery');
const imagesGallery = document.getElementById('images-gallery');
const loadingElement = document.getElementById('loading');
const noImagesElement = document.getElementById('no-images');
const endOfContentElement = document.getElementById('end-of-content');
const scrollToTopBtn = document.getElementById('scroll-to-top');

// Категории с иконками
const categories = {
  "ariral": {
    name: "Ariral",
    icon: "/assets/icons/ariral-icon.png"
  },
  "weapons": {
    name: "Оружие",
    icon: "/assets/icons/weapons-icon.png"
  },
  "vehicles": {
    name: "Транспорт", 
    icon: "/assets/icons/vehicles-icon.png"
  },
  "locations": {
    name: "Локации",
    icon: "/assets/icons/locations-icon.png"
  },
  "characters": {
    name: "Персонажи",
    icon: "/assets/icons/characters-icon.png"
  }
};

let currentCategory = null;
let currentImageIndex = 1;
const imagesPerLoad = 20;
let isLoading = false;
let hasMoreImages = true;
let loadedImages = new Set();

// Создание карточек категорий
function createCategoryCards() {
  for (const [key, category] of Object.entries(categories)) {
    const card = document.createElement('div');
    card.className = 'category-card';
    card.setAttribute('data-category', key);
    
    card.innerHTML = `
      <div class="category-image">
        <img src="${category.icon}" alt="${category.name}">
      </div>
      <div class="category-name">${category.name}</div>
    `;
    
    card.addEventListener('click', () => selectCategory(key));
    categoriesGallery.appendChild(card);
  }
}

// Выбор категории
async function selectCategory(category) {
  document.querySelectorAll('.category-card').forEach(card => {
    card.classList.remove('active');
  });
  
  const selectedCard = document.querySelector(`[data-category="${category}"]`);
  if (selectedCard) {
    selectedCard.classList.add('active');
  }
  
  currentCategory = category;
  currentImageIndex = 1;
  loadedImages.clear();
  hasMoreImages = true;
  hideEndOfContent();
  imagesGallery.innerHTML = '';
  
  await loadMoreImages();
}

// Динамическая загрузка изображений при прокрутке
async function loadMoreImages() {
  if (!currentCategory || isLoading) return;
  
  isLoading = true;
  showLoading();
  
  const folderPath = `/assets/images/${currentCategory}/`;
  let loadedCount = 0;
  let consecutiveErrors = 0;
  const maxConsecutiveErrors = 10;
  
  while (loadedCount < imagesPerLoad && consecutiveErrors < maxConsecutiveErrors) {
    const imageNumber = currentImageIndex;
    
    if (!loadedImages.has(imageNumber)) {
      const exists = await loadSingleImage(imageNumber, folderPath);
      
      if (exists) {
        loadedImages.add(imageNumber);
        loadedCount++;
        consecutiveErrors = 0;
      } else {
        consecutiveErrors++;
      }
    }
    
    currentImageIndex++;
    
    if (currentImageIndex % 5 === 0) {
      await new Promise(resolve => setTimeout(resolve, 10));
    }
  }
  
  if (consecutiveErrors >= maxConsecutiveErrors) {
    hasMoreImages = false;
    showEndOfContent();
    
    if (loadedImages.size === 0) {
      showNoImages();
    }
  }
  
  hideLoading();
  isLoading = false;
}

// Загрузка одного изображения
function loadSingleImage(imageNumber, folderPath) {
  return new Promise((resolve) => {
    const img = new Image();
    
    img.onload = () => {
      const card = document.createElement('div');
      card.className = 'image-card';
      card.style.animationDelay = `${(imageNumber % 10) * 0.1}s`;
      
      card.innerHTML = `
        <img src="${img.src}" alt="Image ${imageNumber}" loading="lazy">
        <div class="image-number">${imageNumber}</div>
      `;
      
      imagesGallery.appendChild(card);
      resolve(true);
    };
    
    img.onerror = () => {
      resolve(false);
    };
    
    img.src = `${folderPath}${imageNumber}.png`;
  });
}

// Бесконечная прокрутка
function setupInfiniteScroll() {
  let scrollTimeout;
  
  window.addEventListener('scroll', () => {
    toggleScrollToTopButton();
    
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      if (shouldLoadMoreImages()) {
        loadMoreImages();
      }
    }, 100);
  });
}

// Проверка, нужно ли загружать еще изображения
function shouldLoadMoreImages() {
  if (isLoading || !hasMoreImages || !currentCategory) return false;
  
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;
  
  return (scrollTop + windowHeight) >= (documentHeight - windowHeight * 0.2);
}

// Управление кнопкой "Наверх"
function toggleScrollToTopButton() {
  if (window.scrollY > 300) {
    scrollToTopBtn.style.display = 'flex';
  } else {
    scrollToTopBtn.style.display = 'none';
  }
}

// Прокрутка к верху страницы
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

// Вспомогательные функции
function showLoading() {
  if (loadedImages.size === 0) {
    loadingElement.style.display = 'flex';
    loadingElement.innerHTML = `
      <div class="loading-spinner"></div>
      <span>Загрузка изображений...</span>
    `;
  } else {
    loadingElement.style.display = 'flex';
    loadingElement.innerHTML = `
      <div class="loading-spinner"></div>
      <span>Загрузка дополнительных изображений...</span>
    `;
  }
}

function hideLoading() {
  loadingElement.style.display = 'none';
}

function showNoImages() {
  noImagesElement.style.display = 'block';
  noImagesElement.textContent = 'Изображения не найдены в этой категории';
}

function hideNoImages() {
  noImagesElement.style.display = 'none';
}

function showEndOfContent() {
  endOfContentElement.style.display = 'block';
  endOfContentElement.innerHTML = `
    Все изображения загружены (${loadedImages.size} шт.)
  `;
}

function hideEndOfContent() {
  endOfContentElement.style.display = 'none';
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
  createCategoryCards();
  setupInfiniteScroll();
  
  scrollToTopBtn.addEventListener('click', scrollToTop);
  
  setTimeout(() => {
    const firstCategory = Object.keys(categories)[0];
    selectCategory(firstCategory);
  }, 100);
});