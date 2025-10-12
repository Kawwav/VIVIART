// ---------------------------
// Função da barra de pesquisa
// ---------------------------
const searchInput = document.getElementById('search-input');
const projectCards = document.querySelectorAll('.project-card');
const courseCards = document.querySelectorAll('.courses-grid .project-card');

searchInput?.addEventListener('input', () => {
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

// ---------------------------
// Carrossel de imagens
// ---------------------------
const track = document.querySelector('.carousel-track');
const items = document.querySelectorAll('.carousel-item');
const prevBtn = document.querySelector('.carousel-btn.prev');
const nextBtn = document.querySelector('.carousel-btn.next');

let currentIndex = 0;

function updateCarousel() {
  const width = items[0].clientWidth;
  track.style.transform = `translateX(${-currentIndex * width}px)`;
}

nextBtn?.addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % items.length;
  updateCarousel();
});

prevBtn?.addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + items.length) % items.length;
  updateCarousel();
});

window.addEventListener('resize', updateCarousel);

// ---------------------------
// Modal (popup de imagem)
// ---------------------------
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
    modalDescricao.textContent = "Bolsa feita à mão e porta celular com cores diferentes e design artesanal.";
    modalPreco.textContent = "R$250,00";
  } else if (elemento.alt === "bolsa2") {
    modalTitulo.textContent = "Bolsa artesanal azul";
    modalDescricao.textContent = "Bolsa azul feita com fio de algodão, combinando perfeitamente com roupas leves e acessórios.";
    modalPreco.textContent = "R$280,00";
  } else if (elemento.alt === "bolsa3") {
    modalTitulo.textContent = "Bolsa artesanal marrom";
    modalDescricao.textContent = "Feita para momentos de lazer e dias ensolarados, perfeita para praia ou passeios.";
    modalPreco.textContent = "R$300,00";
  }

  // Exibe o modal
  modal.style.display = "flex";
}

// Fecha o modal
function fecharModal() {
  document.getElementById("modal").style.display = "none";
}

// Fecha o modal ao clicar fora
window.addEventListener("click", function (event) {
  const modal = document.getElementById("modal");
  if (event.target === modal) {
    modal.style.display = "none";
  }
});
