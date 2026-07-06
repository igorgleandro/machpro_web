/*
    MachPRO — Lightbox da galeria
    Salvar como: assets/js/components/lightbox.js

    Antes este código vivia dentro de assets/js/main.js. Ele foi
    movido para cá para que main.js volte a ser o arquivo original
    do tema Dimension (mesma regra do main.css / custom.css).

    Mudanças nesta limpeza:
    - A lista de imagens agora é lida direto do DOM do carrossel
      (#galleryCarousel), em vez de um array duplicado de 25 itens
      que podia sair de sincronia com o HTML.
    - Clique no fundo escuro fecha o lightbox.
    - stopPropagation em cliques e no Esc: sem isso, o main.js do
      tema interpretava o clique/Esc como "fechar o artigo" e o
      painel do Portfólio sumia por trás do lightbox.
*/
(function () {
    "use strict";

    var lightbox = document.getElementById("lightbox");
    if (!lightbox) return;

    var img     = document.getElementById("lightbox-img");
    var caption = document.getElementById("lightbox-caption");

    /* Única fonte de verdade: as imagens que já estão no carrossel.
       Os índices passados por openlightbox(n) no HTML seguem a
       mesma ordem do DOM. */
    var slides  = document.querySelectorAll("#galleryCarousel .carousel-item img");
    var current = 0;

    function render() {
        var el = slides[current];
        if (!el) return;
        img.src = el.getAttribute("src");
        img.alt = el.getAttribute("alt") || "";
        caption.textContent = img.alt;   /* textContent: seguro contra XSS */
    }

    function openLightbox(index) {
        current = index;
        render();
        lightbox.classList.add("active");
        document.body.style.overflow = "hidden";
    }

    function closeLightbox() {
        lightbox.classList.remove("active");
        document.body.style.overflow = "";   /* volta ao padrão */
    }

    function changeImage(direction) {
        current = (current + direction + slides.length) % slides.length;
        render();
    }

    /* Os onclick="" no HTML precisam destas funções no escopo global */
    window.openLightbox  = openLightbox;
    window.closeLightbox = closeLightbox;
    window.changeImage   = changeImage;

    /* Clique no fundo escuro fecha. O stopPropagation impede que o
       clique chegue ao <body>, onde o main.js do tema fecharia o
       artigo aberto atrás do lightbox. */
    lightbox.addEventListener("click", function (e) {
        e.stopPropagation();
        if (e.target === lightbox) closeLightbox();
    });

    /* Setas navegam enquanto o lightbox está aberto */
    document.addEventListener("keydown", function (e) {
        if (!lightbox.classList.contains("active")) return;

        if (e.key === "ArrowLeft")  changeImage(-1);
        if (e.key === "ArrowRight") changeImage(1);
    });

    /* Esc fecha o lightbox. O tema escuta Esc em keyup no window
       para fechar o artigo; tratamos aqui também em keyup, no
       document (que dispara antes), e cortamos a propagação para
       o mesmo Esc não fechar o artigo junto. */
    document.addEventListener("keyup", function (e) {
        if (e.key === "Escape" && lightbox.classList.contains("active")) {
            e.stopPropagation();
            closeLightbox();
        }
    });
})();