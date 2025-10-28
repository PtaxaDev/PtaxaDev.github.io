const screenshots = [
  'images/img1.jpg',
  'images/img2.jpg',
  'images/img3.jpg',
  // Добавляй сюда все скриншоты
];

const container = document.getElementById('screenshots-cards');

screenshots.forEach(src => {
  const card = document.createElement('div');
  card.className = 'card';

  const imgWrapper = document.createElement('div');
  imgWrapper.className = 'card-image';
  const img = document.createElement('img');
  img.src = src;
  img.alt = 'Скриншот';
  imgWrapper.appendChild(img);

  const text = document.createElement('div');
  text.className = 'card-text';
  text.textContent = src.split('/').pop(); // Можно название файла как подпись

  card.appendChild(imgWrapper);
  card.appendChild(text);

  container.appendChild(card);
});
