/*
    MachPRO — Gallery carousel (Bootstrap-style, fade)
    Save as: assets/js/gallery-carousel.js

    Mirrors Bootstrap's carousel-fade behavior without loading Bootstrap:
    - One .carousel-item visible at a time; .active crossfades in
    - Prev/next controls via data-slide="prev|next"
    - Left/right arrow keys (ignored while the lightbox is open)
    - Touch swipe support
    - Updates the "N / 25" counter
*/
(function () {
    "use strict";

    var carousel = document.getElementById("galleryCarousel");
    if (!carousel) return;

    var items = carousel.querySelectorAll(".carousel-item");
    var counter = document.getElementById("carousel-current");
    var current = 0;

    // Find the initial .active slide (defaults to 0)
    for (var i = 0; i < items.length; i++) {
        if (items[i].classList.contains("active")) { current = i; break; }
    }

    function goTo(index) {
        items[current].classList.remove("active");
        current = (index + items.length) % items.length; // wraps around
        items[current].classList.add("active");
        if (counter) counter.textContent = current + 1;
    }

    // Prev / next controls (Bootstrap-style data-slide attributes)
    carousel.querySelectorAll("[data-slide]").forEach(function (btn) {
        btn.addEventListener("click", function () {
            goTo(btn.getAttribute("data-slide") === "prev" ? current - 1 : current + 1);
        });
    });

    // Keyboard: left/right arrows — but not while the lightbox is open,
    // so the two features never fight over the same keys
    document.addEventListener("keydown", function (e) {
        if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;

        var lightbox = document.getElementById("lightbox");
        if (lightbox && window.getComputedStyle(lightbox).display !== "none") return;

        // Only react when the carousel is actually on screen (its article is open)
        if (carousel.offsetParent === null) return;

        goTo(e.key === "ArrowLeft" ? current - 1 : current + 1);
    });

    // Touch swipe
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