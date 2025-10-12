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


function abrirModal(elemento) {
  const modal = document.getElementById("modal");
  const imgAmpliada = document.getElementById("imgAmpliada");
  const modalTitulo = document.getElementById("modalTitulo");
  const modalDescricao = document.getElementById("modalDescricao");
  const modalPreco = document.getElementById("modalPreco");

  // adiciona as informações da imagem
  imgAmpliada.src = elemento.src;

  // Exemplo de dados personalizados
  if (elemento.alt === "bolsa1") {
    modalTitulo.textContent = "Bolsa e porta celular";
    modalDescricao.textContent = "Bolsa feita a mão e porta celular feita a mão com cores diferesnte ";
    modalPreco.textContent = "R$250,00";
  } else if (elemento.alt === "bolsa2") {
    modalTitulo.textContent = "Bolsa artesanal azul";
    modalDescricao.textContent = "bolsa azul combinando com roupas e acessorios azuis";
    modalPreco.textContent = "R$280,00";
  } else if (elemento.alt === "bolsa3") {
    modalTitulo.textContent = "Bolsa artesanal marrom";
    modalDescricao.textContent = "feita para diversões na praia ou climas limpos e claros";
    modalPreco.textContent = "R$300,00";
  }

  modal.style.display = "flex";
}

function fecharModal() {
  document.getElementById("modal").style.display = "none";
}
