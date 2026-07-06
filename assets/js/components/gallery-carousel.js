/*
MachPRO — Gallery carousel (Bootstrap-style, fade)
Salvar como: assets/js/components/gallery-carousel.js

Reproduz o comportamento carousel-fade do Bootstrap sem carregar
o Bootstrap:
    - Um .carousel-item visível por vez; o .active entra com crossfade
- Controles prev/next via data-slide="prev|next"
    - Setas esquerda/direita do teclado (ignoradas com o lightbox aberto)
- Suporte a swipe no toque
- Atualiza o contador "N / 25"
*/
(function () {
    "use strict";

    var carousel = document.getElementById("galleryCarousel");
    if (!carousel) return;

    var items = carousel.querySelectorAll(".carousel-item");
    var counter = document.getElementById("carousel-current");
    var current = 0;

    // Encontra o slide .active inicial (padrão: 0)
    for (var i = 0; i < items.length; i++) {
        if (items[i].classList.contains("active")) { current = i; break; }
    }

    function goTo(index) {
        items[current].classList.remove("active");
        current = (index + items.length) % items.length; // dá a volta
        items[current].classList.add("active");
        if (counter) counter.textContent = current + 1;
    }

    // Controles prev/next (atributos data-slide, estilo Bootstrap)
    carousel.querySelectorAll("[data-slide]").forEach(function (btn) {
        btn.addEventListener("click", function () {
            goTo(btn.getAttribute("data-slide") === "prev" ? current - 1 : current + 1);
        });
    });

    // Teclado: setas esquerda/direita — mas não com o lightbox aberto,
    // para as duas funcionalidades nunca brigarem pelas mesmas teclas
    document.addEventListener("keydown", function (e) {
        if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;

        var lightbox = document.getElementById("lightbox");
        if (lightbox && window.getComputedStyle(lightbox).display !== "none") return;

        // Só reage quando o carrossel está na tela (artigo aberto)
        if (carousel.offsetParent === null) return;

        goTo(e.key === "ArrowLeft" ? current - 1 : current + 1);
    });

    // Swipe no toque
    var touchStartX = null;

    carousel.addEventListener("touchstart", function (e) {
        touchStartX = e.touches[0].clientX;
    }, { passive: true });

    carousel.addEventListener("touchend", function (e) {
        if (touchStartX === null) return;
        var deltaX = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(deltaX) > 40) goTo(deltaX < 0 ? current + 1 : current - 1);
        touchStartX = null;
    }, { passive: true });
})();