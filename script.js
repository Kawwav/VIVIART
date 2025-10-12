const searchInput = document.getElementById('search-input');
const projectCards = document.querySelectorAll('.project-card');
const courseCards = document.querySelectorAll('.courses-grid .project-card');

searchInput.addEventListener('input', () => {
  const searchTerm = searchInput.value.toLowerCase();
  projectCards.forEach(card => {
    const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
    const text = card.querySelector('p')?.textContent.toLowerCase() || '';
    const match = title.includes(searchTerm) || text.includes(searchTerm);
    card.style.display = match ? 'block' : 'none';
  });

  courseCards.forEach(card => {
    const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
    const text = card.querySelector('p')?.textContent.toLowerCase() || '';
    const match = title.includes(searchTerm) || text.includes(searchTerm);
    card.style.display = match ? 'block' : 'none';
  });
});

const track = document.querySelector('.carousel-track');
const items = document.querySelectorAll('.carousel-item');
const prevBtn = document.querySelector('.carousel-btn.prev');
const nextBtn = document.querySelector('.carousel-btn.next');

let currentIndex = 0;

function updateCarousel() {
  const width = items[0].clientWidth;
  track.style.transform = `translateX(${-currentIndex * width}px)`;
}

nextBtn.addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % items.length;
  updateCarousel();
});

prevBtn.addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + items.length) % items.length;
  updateCarousel();
});

window.addEventListener('resize', updateCarousel);
