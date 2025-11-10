document.addEventListener('DOMContentLoaded', () => {
    // -----------------------------
    // Variáveis e elementos
    // -----------------------------
    const searchInput = document.getElementById('search-input');
    const searchContainer = document.querySelector('.search-container');
    let searchHistory = document.getElementById('search-history');
    const allCards = document.querySelectorAll('.item, .card, .project-card');

    // === Variáveis do Carrossel de Novidades Atualizadas ===
    const track = document.querySelector('.carousel-track');
    // prevBtn e nextBtn são mantidos para serem declarados, mas o código de escuta será removido.
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    
    // NOVOS ELEMENTOS PARA NAVEGAÇÃO POR BOLINHAS
    const dotsContainer = document.querySelector('.carousel-dots');
    const dots = dotsContainer ? Array.from(dotsContainer.children) : []; 
    // ======================================================

    const modal = document.getElementById('modal');
    const imgAmpliadaEl = document.getElementById('imgAmpliada');
    const modalTitulo = document.getElementById('colecaoTitulo');
    const modalDescricao = document.getElementById('colecaoDescricao');
    const modalPreco = document.getElementById('colecaoPreco');

    const verColecaoBtn = document.querySelector('.btn.ver-colecao') || document.querySelector('.btn[href="#colecao"]');
    const colecaoSection = document.getElementById('colecao');

    let historyList = JSON.parse(localStorage.getItem('searchHistory')) || [];

    // Cria o container do histórico caso não exista
    if (!searchHistory && searchContainer) {
        searchHistory = document.createElement('div');
        searchHistory.id = 'search-history';
        searchHistory.className = 'hidden';
        searchContainer.appendChild(searchHistory);
    }

    // -----------------------------
    // Frases animadas
    // -----------------------------
    const frases = ["Feito à mão com amor 🧵", "Sustentável 🌿", "Peças únicas 💼"];
    let i = 0;
    setInterval(() => {
        const sloganElement = document.getElementById("slogan");
        if(sloganElement) sloganElement.textContent = frases[i];
        i = (i + 1) % frases.length;
    }, 2500);

    // -----------------------------
    // Lista de novidades (popup)
    // -----------------------------
    const novidades = [
        {
            img: "./img/bolsa1.PNG",
            titulo: "Bolsa artesanal nova",
            descricao: "Modelo exclusivo feito à mão com fio 100% algodão.",
            preco: "R$ 180,00",
        },
        {
            img: "./img/bolsa2.PNG",
            titulo: "Bolsa boho azul",
            descricao: "Inspirada no estilo boho, perfeita para o verão.",
            preco: "R$ 220,00",
        },
        {
            img: "./img/bolsa3.PNG",
            titulo: "Bolsa de crochê marrom",
            descricao: "Feita com fios naturais e detalhes em bambu.",
            preco: "R$ 250,00",
        },
    ];

    window.abrirModalNovidade = function (index) {
        const item = novidades[index];
        document.getElementById("modalImg").src = item.img;
        document.getElementById("modalTitulo").textContent = item.titulo;
        document.getElementById("modalDescricao").textContent = item.descricao;
        document.getElementById("modalPreco").textContent = item.preco;
        document.getElementById("modalNovidade").style.display = "flex";
    };

    window.fecharModalNovidade = function () {
        document.getElementById("modalNovidade").style.display = "none";
    };

    window.addEventListener("click", (e) => {
        const modal = document.getElementById("modalNovidade");
        if (e.target === modal) modal.style.display = "none";
    });

    // -----------------------------
    // Histórico de pesquisa
    // -----------------------------
    function renderHistory() {
        if (!searchHistory) return;
        if (historyList.length === 0) {
            searchHistory.innerHTML = '<p class="history-item">Nenhum histórico ainda...</p>';
            return;
        }
        const itemsHTML = historyList.map(term => `<div class="history-item">${term}</div>`).join('');
        const clearBtnHTML = `<button id="clear-history" class="clear-history-btn">Limpar histórico</button>`;
        searchHistory.innerHTML = itemsHTML + clearBtnHTML;

        const btn = document.getElementById('clear-history');
        if (btn) {
            btn.addEventListener('click', () => {
                historyList = [];
                localStorage.removeItem('searchHistory');
                renderHistory();
                searchInput.value = '';
                filtrarCards('');
            });
        }
    }

    function filtrarCards(term) {
        const searchTerm = (term || '').toLowerCase();
        allCards.forEach(card => {
            const title = card.querySelector('h1, h2, h3')?.textContent.toLowerCase() || '';
            const desc = card.querySelector('p')?.textContent.toLowerCase() || '';
            const match = searchTerm === '' || title.includes(searchTerm) || desc.includes(searchTerm);
            card.style.display = match ? 'block' : 'none';
        });
    }

    if (searchInput) {
        searchInput.addEventListener('focus', () => {
            renderHistory();
            searchHistory.classList.remove('hidden');
            setTimeout(() => searchHistory.classList.add('show'), 10);
        });

        searchInput.addEventListener('input', () => filtrarCards(searchInput.value));

        searchInput.addEventListener('keydown', e => {
            if (e.key === 'Enter' && searchInput.value.trim() !== '') {
                const term = searchInput.value.trim();
                if (!historyList.includes(term)) {
                    historyList.unshift(term);
                    if (historyList.length > 5) historyList.pop();
                    localStorage.setItem('searchHistory', JSON.stringify(historyList));
                }
                renderHistory();
                filtrarCards(term);
                searchInput.blur();
            }
        });

        searchHistory.addEventListener('click', e => {
            if (e.target.classList.contains('history-item')) {
                const text = e.target.textContent;
                searchInput.value = text;
                filtrarCards(text);
            }
        });

        document.addEventListener('click', e => {
            if (!searchHistory.contains(e.target) && e.target !== searchInput) {
                searchHistory.classList.remove('show');
                setTimeout(() => searchHistory.classList.add('hidden'), 250);
            }
        });
    }

    filtrarCards('');
    renderHistory();

    // -----------------------------
    // Carrossel Header (Atualizado para Dots)
    // -----------------------------
    let carouselItems = track ? Array.from(track.children) : [];
    let currentIndex = 0;

    function updateCarousel() {
        if (!track || carouselItems.length === 0) return;
        // Pega a largura do primeiro item para calcular o deslocamento
        const itemWidth = carouselItems[0].clientWidth;
        if (itemWidth === 0) return; // Garante que o itemWidth foi calculado
        
        track.style.transform = `translateX(${-currentIndex * itemWidth}px)`;
        
        // Atualiza a classe 'active' das bolinhas (dots)
        dots.forEach((dot, idx) => {
            dot.classList.toggle('active', idx === currentIndex);
        });
    }

    // Adiciona listener de clique nas bolinhas
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentIndex = index; // Define o índice atual baseado na bolinha clicada
            updateCarousel();
        });
    });

    // Removendo completamente a lógica de navegação das setas (prevBtn e nextBtn)
    /*
    if (nextBtn) nextBtn.addEventListener('click', () => {
        if (carouselItems.length === 0) return;
        currentIndex = (currentIndex + 1) % carouselItems.length;
        updateCarousel();
    });

    if (prevBtn) prevBtn.addEventListener('click', () => {
        if (carouselItems.length === 0) return;
        currentIndex = (currentIndex - 1 + carouselItems.length) % carouselItems.length;
        updateCarousel();
    });
    */

    window.addEventListener('resize', updateCarousel);
    updateCarousel(); // Inicializa o carrossel na primeira bolinha

    // -----------------------------
    // Modal Catálogo
    // -----------------------------
    let modalIndex = 0;
    let imagensModal = [];

    window.abrirModal = function(elemento) {
        if (!modal || !imgAmpliadaEl) return;
        const alt = elemento?.alt || '';
        switch (alt) {
            case "bolsa1":
                imagensModal = ["./img/bolsa1.PNG", "./img/bolsa1.PNG", "./img/bolsa1.PNG"];
                modalTitulo.textContent = "Bolsa e porta celular";
                modalDescricao.textContent = "Bolsa feita à mão e porta celular com cores diferentes e design artesanal.";
                modalPreco.textContent = "R$250,00";
                break;
            case "bolsa2":
                imagensModal = ["./img/bolsa2.PNG", "./img/bolsa2.PNG"];
                modalTitulo.textContent = "Bolsa artesanal azul";
                modalDescricao.textContent = "Bolsa azul feita com fio de algodão, combinando perfeitamente com roupas leves e acessórios.";
                modalPreco.textContent = "R$280,00";
                break;
            case "bolsa3":
                imagensModal = ["./img/bolsa3.PNG", "./img/bolsa3.PNG", "./img/bolsa3.PNG"];
                modalTitulo.textContent = "Bolsa artesanal marrom";
                modalDescricao.textContent = "Feita para momentos de lazer e dias ensolarados, perfeita para praia ou passeios.";
                modalPreco.textContent = "R$300,00";
                break;
            case "bolsa4":
                imagensModal = ["./img/bolsa4.PNG","./img/bolsa42.PNG"];
                modalTitulo.textContent = "Bolsa azul legal";
                modalDescricao.textContent = "Bolsa estilosa e prática.";
                modalPreco.textContent = "R$---";
                break;
            default:
                imagensModal = [];
                break;
        }
        modalIndex = 0;
        imgAmpliadaEl.src = imagensModal[modalIndex] || '';
        modal.style.display = "flex";
        modal.classList.add('fade-in');
    };

    window.mudarImagemModal = function(direcao) {
        if (!imagensModal || imagensModal.length === 0) return;
        modalIndex = (modalIndex + direcao + imagensModal.length) % imagensModal.length;
        imgAmpliadaEl.src = imagensModal[modalIndex];
    };

    window.fecharModal = function(id) {
        const modalEl = id ? document.getElementById(id) : modal;
        modalEl.classList.remove('fade-in');
        setTimeout(() => modalEl.style.display = "none", 200);
    };


    window.addEventListener('click', e => {
        if (e.target === modal) window.fecharModal();
    });

    // -----------------------------
    // Rolagem suave "Ver coleção"
    // -----------------------------
    if (verColecaoBtn && colecaoSection) {
        verColecaoBtn.addEventListener('click', e => {
            e.preventDefault();
            colecaoSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            colecaoSection.classList.add('highlight');
            setTimeout(() => colecaoSection.classList.remove('highlight'), 1200);
        });
    }

    // -----------------------------
    // Fade-in com IntersectionObserver
    // -----------------------------
    const cardsToObserve = document.querySelectorAll('.card, .item, .project-card');
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        cardsToObserve.forEach(c => observer.observe(c));
    } else {
        cardsToObserve.forEach(c => c.classList.add('fade-in'));
    }

    // -----------------------------
    // Modal Linha do Tempo
    // -----------------------------
    const eventos = [
        {titulo:"Feira de Artesanato", descricao:"Evento incrível mostrando as novas bolsas e acessórios.", imagens:["./img/eventoA1.jpg","./img/eventoA2.jpg"]},
        {titulo:"Workshop de Crochê", descricao:"Oficina prática de crochê com demonstração de técnicas especiais.", imagens:["./img/eventoB1.jpg","./img/eventoB2.jpg","./img/eventoB3.jpg"]},
        {titulo:"Exposição de Primavera", descricao:"Mostra de bolsas inspiradas nas cores da estação primavera.", imagens:["./img/eventoC1.jpg","./img/eventoC2.jpg"]}
    ];

    const modalEvento = document.getElementById("modalEvento");
    const eventoTitulo = document.getElementById("eventoTitulo");
    const eventoDescricao = document.getElementById("eventoDescricao");
    const eventoImg = document.getElementById("eventoImg");
    let eventoIndex = 0;
    let imagensEvento = [];

    window.abrirEvento = function(index) {
        const evento = eventos[index];
        if (!evento) return;
        eventoTitulo.textContent = evento.titulo;
        eventoDescricao.textContent = evento.descricao;
        imagensEvento = evento.imagens;
        eventoIndex = 0;
        eventoImg.src = imagensEvento[eventoIndex];
        modalEvento.style.display = "flex";
    };

    window.mudarImagemEvento = function(direcao) {
        if (!imagensEvento || imagensEvento.length === 0) return;
        eventoIndex = (eventoIndex + direcao + imagensEvento.length) % imagensEvento.length;
        eventoImg.src = imagensEvento[eventoIndex];
    };

    window.fecharModalEvento = function() {
        modalEvento.style.display = "none";
    };

    window.addEventListener("click", e => {
        if (e.target === modalEvento) window.fecharModalEvento();
    });

    // -----------------------------
    // === Timeline Deslizante ===
    // -----------------------------
    const timelineContainer = document.querySelector(".timeline-container");
    const timelineEvents = document.querySelectorAll(".timeline-event");
    const arrowLeft = document.getElementById("arrowLeft");
    const arrowRight = document.getElementById("arrowRight");

    let currentTimelineIndex = 0;
    const itemsPerView = 3; // quantos aparecem por vez

    function updateTimeline() {
        if (!timelineContainer || timelineEvents.length === 0) return;

        // Ajusta o cálculo da largura para garantir que funcione corretamente
        // Se houver margem ou padding, o offsetWidth deve ser usado com cuidado ou o cálculo ajustado
        const eventStyle = window.getComputedStyle(timelineEvents[0]);
        const margin = parseFloat(eventStyle.marginRight) + parseFloat(eventStyle.marginLeft);
        // Assumindo eventWidth é a largura do evento + 80px de espaçamento/margem
        const eventWidth = timelineEvents[0].offsetWidth + 80; 
        
        // Verifica se timelineEvents[0] é válido
        if (eventWidth === 80) return; 

        const maxIndex = Math.max(0, timelineEvents.length - itemsPerView);

        const shift = -(currentTimelineIndex * eventWidth);
        timelineContainer.style.transform = `translateX(${shift}px)`;
        timelineContainer.style.transition = "transform 0.5s ease";

        arrowLeft.classList.toggle("disabled", currentTimelineIndex === 0);
        arrowRight.classList.toggle("disabled", currentTimelineIndex >= maxIndex);
    }

    arrowRight.addEventListener("click", () => {
        const maxIndex = Math.max(0, timelineEvents.length - itemsPerView);
        if (currentTimelineIndex < maxIndex) {
            currentTimelineIndex++;
            updateTimeline();
        }
    });

    arrowLeft.addEventListener("click", () => {
        if (currentTimelineIndex > 0) {
            currentTimelineIndex--;
            updateTimeline();
        }
    });

    window.addEventListener("resize", updateTimeline);
    updateTimeline();
});


// Detecta o botão e o footer
const whatsappButton = document.querySelector('.whatsapp-float');
const footer = document.querySelector('footer');

window.addEventListener('scroll', () => {
    // Garante que o footer e o botão existam
    if (!footer || !whatsappButton) return; 

    const footerRect = footer.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // Quando o topo do footer entra na viewport, esconde o botão
    if (footerRect.top < windowHeight) {
        if (!whatsappButton.classList.contains('whatsapp-hide')) {
            whatsappButton.classList.add('whatsapp-hide');
        }
    } else {
        whatsappButton.classList.remove('whatsapp-hide');
    }
});
// Animações ao rolar a página
const animatedElements = document.querySelectorAll('.fade-in, .fade-left, .fade-right, .fade-zoom');

if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    
    animatedElements.forEach(el => observer.observe(el));
} else {
    animatedElements.forEach(el => el.classList.add('active'));
}
AOS.init({
  duration: 1000,   // duração da animação (em ms)
  once: true,       // anima só uma vez
  offset: 100,      // distância antes de começar a animar
});

