/*
	Dimension by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

    var	$window = $(window),
        $body = $('body'),
        $wrapper = $('#wrapper'),
        $header = $('#header'),
        $footer = $('#footer'),
        $main = $('#main'),
        $main_articles = $main.children('article');

    // Breakpoints.
    breakpoints({
        xlarge:   [ '1281px',  '1680px' ],
        large:    [ '981px',   '1280px' ],
        medium:   [ '737px',   '980px'  ],
        small:    [ '481px',   '736px'  ],
        xsmall:   [ '361px',   '480px'  ],
        xxsmall:  [ null,      '360px'  ]
    });

    // Play initial animations on page load.
    $window.on('load', function() {
        window.setTimeout(function() {
            $body.removeClass('is-preload');
        }, 100);
    });

    // Fix: Flexbox min-height bug on IE.
    if (browser.name == 'ie') {

        var flexboxFixTimeoutId;

        $window.on('resize.flexbox-fix', function() {

            clearTimeout(flexboxFixTimeoutId);

            flexboxFixTimeoutId = setTimeout(function() {

                if ($wrapper.prop('scrollHeight') > $window.height())
                    $wrapper.css('height', 'auto');
                else
                    $wrapper.css('height', '100vh');

            }, 250);

        }).triggerHandler('resize.flexbox-fix');

    }

    // Nav.
    var $nav = $header.children('nav'),
        $nav_li = $nav.find('li');

    // Add "middle" alignment classes if we're dealing with an even number of items.
    if ($nav_li.length % 2 == 0) {

        $nav.addClass('use-middle');
        $nav_li.eq( ($nav_li.length / 2) ).addClass('is-middle');

    }

    // Main.
    var	delay = 325,
        locked = false;

    // Methods.
    $main._show = function(id, initial) {

        var $article = $main_articles.filter('#' + id);

        // No such article? Bail.
        if ($article.length == 0)
            return;

        // Handle lock.

        // Already locked? Speed through "show" steps w/o delays.
        if (locked || (typeof initial != 'undefined' && initial === true)) {

            // Mark as switching.
            $body.addClass('is-switching');

            // Mark as visible.
            $body.addClass('is-article-visible');

            // Deactivate all articles (just in case one's already active).
            $main_articles.removeClass('active');

            // Hide header, footer.
            $header.hide();
            $footer.hide();

            // Show main, article.
            $main.show();
            $article.show();

            // Activate article.
            $article.addClass('active');

            // Unlock.
            locked = false;

            // Unmark as switching.
            setTimeout(function() {
                $body.removeClass('is-switching');
            }, (initial ? 1000 : 0));

            return;

        }

        // Lock.
        locked = true;

        // Article already visible? Just swap articles.
        if ($body.hasClass('is-article-visible')) {

            // Deactivate current article.
            var $currentArticle = $main_articles.filter('.active');

            $currentArticle.removeClass('active');

            // Show article.
            setTimeout(function() {

                // Hide current article.
                $currentArticle.hide();

                // Show article.
                $article.show();

                // Activate article.
                setTimeout(function() {

                    $article.addClass('active');

                    // Window stuff.
                    $window
                        .scrollTop(0)
                        .triggerHandler('resize.flexbox-fix');

                    // Unlock.
                    setTimeout(function() {
                        locked = false;
                    }, delay);

                }, 25);

            }, delay);

        }

        // Otherwise, handle as normal.
        else {

            // Mark as visible.
            $body
                .addClass('is-article-visible');

            // Show article.
            setTimeout(function() {

                // Hide header, footer.
                $header.hide();
                $footer.hide();

                // Show main, article.
                $main.show();
                $article.show();

                // Activate article.
                setTimeout(function() {

                    $article.addClass('active');

                    // Window stuff.
                    $window
                        .scrollTop(0)
                        .triggerHandler('resize.flexbox-fix');

                    // Unlock.
                    setTimeout(function() {
                        locked = false;
                    }, delay);

                }, 25);

            }, delay);

        }

    };

    $main._hide = function(addState) {

        var $article = $main_articles.filter('.active');

        // Article not visible? Bail.
        if (!$body.hasClass('is-article-visible'))
            return;

        // Add state?
        if (typeof addState != 'undefined'
            &&	addState === true)
            history.pushState(null, null, '#');

        // Handle lock.

        // Already locked? Speed through "hide" steps w/o delays.
        if (locked) {

            // Mark as switching.
            $body.addClass('is-switching');

            // Deactivate article.
            $article.removeClass('active');

            // Hide article, main.
            $article.hide();
            $main.hide();

            // Show footer, header.
            $footer.show();
            $header.show();

            // Unmark as visible.
            $body.removeClass('is-article-visible');

            // Unlock.
            locked = false;

            // Unmark as switching.
            $body.removeClass('is-switching');

            // Window stuff.
            $window
                .scrollTop(0)
                .triggerHandler('resize.flexbox-fix');

            return;

        }

        // Lock.
        locked = true;

        // Deactivate article.
        $article.removeClass('active');

        // Hide article.
        setTimeout(function() {

            // Hide article, main.
            $article.hide();
            $main.hide();

            // Show footer, header.
            $footer.show();
            $header.show();

            // Unmark as visible.
            setTimeout(function() {

                $body.removeClass('is-article-visible');

                // Window stuff.
                $window
                    .scrollTop(0)
                    .triggerHandler('resize.flexbox-fix');

                // Unlock.
                setTimeout(function() {
                    locked = false;
                }, delay);

            }, 25);

        }, delay);

    };

    // Articles.
    $main_articles.each(function() {

        var $this = $(this);

        // Close.
        $('<div class="close">Close</div>')
            .appendTo($this)
            .on('click', function() {
                location.hash = '';
            });

        // Prevent clicks from inside article from bubbling.
        $this.on('click', function(event) {
            event.stopPropagation();
        });

    });

    // Events.
    $body.on('click', function(event) {

        // Article visible? Hide.
        if ($body.hasClass('is-article-visible'))
            $main._hide(true);

    });

    $window.on('keyup', function(event) {

        switch (event.keyCode) {

            case 27:

                // Article visible? Hide.
                if ($body.hasClass('is-article-visible'))
                    $main._hide(true);

                break;

            default:
                break;

        }

    });

    $window.on('hashchange', function(event) {

        // Empty hash?
        if (location.hash == ''
            ||	location.hash == '#') {

            // Prevent default.
            event.preventDefault();
            event.stopPropagation();

            // Hide.
            $main._hide();

        }

        // Otherwise, check for a matching article.
        else if ($main_articles.filter(location.hash).length > 0) {

            // Prevent default.
            event.preventDefault();
            event.stopPropagation();

            // Show article.
            $main._show(location.hash.substr(1));

        }

    });

    // Scroll restoration.
    // This prevents the page from scrolling back to the top on a hashchange.
    if ('scrollRestoration' in history)
        history.scrollRestoration = 'manual';
    else {

        var	oldScrollPos = 0,
            scrollPos = 0,
            $htmlbody = $('html,body');

        $window
            .on('scroll', function() {

                oldScrollPos = scrollPos;
                scrollPos = $htmlbody.scrollTop();

            })
            .on('hashchange', function() {
                $window.scrollTop(oldScrollPos);
            });

    }

    // Initialize.

    // Hide main, articles.
    $main.hide();
    $main_articles.hide();

    // Initial article.
    if (location.hash != ''
        &&	location.hash != '#')
        $window.on('load', function() {
            $main._show(location.hash.substr(1), true);
        });

})(jQuery);


// ─── Gallery / Lightbox ──────────────────────────────────────────────────────

var galleryImages = [
    { src: 'images/imagesMP/1.png',           alt: 'Projeto Industrial 1'  },
    { src: 'images/imagesMP/2.png',           alt: 'Projeto Industrial 2'  },
    { src: 'images/imagesMP/3.png',           alt: 'Projeto Industrial 3'  },
    { src: 'images/imagesMP/4.png',           alt: 'Projeto Industrial 4'  },
    { src: 'images/imagesMP/5.png',           alt: 'Projeto Industrial 5'  },
    { src: 'images/imagesMP/galeria-01.jpeg', alt: 'Projeto Industrial 6'  },
    { src: 'images/imagesMP/galeria-02.jpeg', alt: 'Projeto Industrial 7'  },
    { src: 'images/imagesMP/galeria-03.jpeg', alt: 'Projeto Industrial 8'  },
    { src: 'images/imagesMP/galeria-04.jpeg', alt: 'Projeto Industrial 9'  },
    { src: 'images/imagesMP/galeria-05.jpeg', alt: 'Projeto Industrial 10' },
    { src: 'images/imagesMP/galeria-06.jpeg', alt: 'Projeto Industrial 11' },
    { src: 'images/imagesMP/galeria-07.jpeg', alt: 'Projeto Industrial 12' },
    { src: 'images/imagesMP/galeria-08.jpeg', alt: 'Projeto Industrial 13' },
    { src: 'images/imagesMP/galeria-09.jpeg', alt: 'Projeto Industrial 14' },
    { src: 'images/imagesMP/galeria-10.jpeg', alt: 'Projeto Industrial 15' },
    { src: 'images/imagesMP/galeria-11.jpeg', alt: 'Projeto Industrial 16' },
    { src: 'images/imagesMP/galeria-12.jpeg', alt: 'Projeto Industrial 17' },
    { src: 'images/imagesMP/galeria-13.jpeg', alt: 'Projeto Industrial 18' },
    { src: 'images/imagesMP/galeria-14.jpeg', alt: 'Projeto Industrial 19' },
    { src: 'images/imagesMP/galeria-15.jpeg', alt: 'Projeto Industrial 20' },
    { src: 'images/imagesMP/galeria-16.jpeg', alt: 'Projeto Industrial 21' },
    { src: 'images/imagesMP/galeria-17.jpeg', alt: 'Projeto Industrial 22' },
    { src: 'images/imagesMP/galeria-18.jpeg', alt: 'Projeto Industrial 23' },
    { src: 'images/imagesMP/galeria-19.jpeg', alt: 'Projeto Industrial 24' },
    { src: 'images/imagesMP/galeria-20.jpeg', alt: 'Projeto Industrial 25' },
];

var currentImageIndex = 0;

function openLightbox(index) {
    currentImageIndex = index;
    var lightbox = document.getElementById('lightbox');
    var img      = document.getElementById('lightbox-img');
    var caption  = document.getElementById('lightbox-caption');

    img.src             = galleryImages[index].src;
    img.alt             = galleryImages[index].alt;
    caption.textContent = galleryImages[index].alt;   // FIX: textContent instead of innerHTML (XSS-safe)
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    var lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('active');
    document.body.style.overflow = '';   // FIX: restore to default, not force 'auto'
}

function changeImage(direction) {
    currentImageIndex = (currentImageIndex + direction + galleryImages.length) % galleryImages.length;  // FIX: one-liner wrap

    var img     = document.getElementById('lightbox-img');
    var caption = document.getElementById('lightbox-caption');

    img.src             = galleryImages[currentImageIndex].src;
    img.alt             = galleryImages[currentImageIndex].alt;
    caption.textContent = galleryImages[currentImageIndex].alt;
}

// Keyboard navigation for lightbox
document.addEventListener('keydown', function(event) {
    var lightbox = document.getElementById('lightbox');

    if (lightbox && lightbox.classList.contains('active')) {
        switch (event.key) {
            case 'Escape':    closeLightbox();   break;
            case 'ArrowLeft': changeImage(-1);   break;
            case 'ArrowRight': changeImage(1);   break;
        }
    }
});


// ─── Shared helpers ───────────────────────────────────────────────────────────

// FIX: isValidEmail defined once and reused by both forms (was duplicated before)
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showMessage(elementOrSelector, message, type) {
    var el = typeof elementOrSelector === 'string'
        ? document.querySelector(elementOrSelector)
        : elementOrSelector;

    if (!el) return;

    el.textContent  = message;
    el.className    = 'form-message ' + type;
    el.style.display = 'block';
    el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    setTimeout(function() { el.style.display = 'none'; }, 5000);
}


// ─── Career form ──────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', function() {

    var careerForm  = document.getElementById('careerForm');
    var formMessage = document.getElementById('formMessage');
    var fileInput   = document.getElementById('resume');
    var fileLabel   = document.querySelector('.file-upload-text');

    if (fileInput && fileLabel) {
        fileInput.addEventListener('change', function(e) {
            if (e.target.files.length > 0) {
                var file     = e.target.files[0];
                var fileMB   = (file.size / 1024 / 1024).toFixed(2);

                if (file.size > 5 * 1024 * 1024) {
                    showMessage(formMessage, 'Arquivo muito grande. O tamanho máximo é 5MB.', 'error');
                    e.target.value    = '';
                    fileLabel.textContent = 'Clique para anexar seu currículo';
                    return;
                }

                fileLabel.textContent = file.name + ' (' + fileMB + ' MB)';
            } else {
                fileLabel.textContent = 'Clique para anexar seu currículo';
            }
        });
    }

    if (careerForm) {
        careerForm.addEventListener('submit', function(e) {
            e.preventDefault();

            var name   = document.getElementById('candidateName').value.trim();
            var email  = document.getElementById('candidateEmail').value.trim();
            var resume = document.getElementById('resume').files[0];

            if (!name) {
                showMessage(formMessage, 'Por favor, informe seu nome completo.', 'error');
                return;
            }
            if (!email || !isValidEmail(email)) {
                showMessage(formMessage, 'Por favor, informe um email válido.', 'error');
                return;
            }
            if (!resume) {
                showMessage(formMessage, 'Por favor, anexe seu currículo.', 'error');
                return;
            }

            var allowedTypes = [
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            ];
            if (!allowedTypes.includes(resume.type)) {
                showMessage(formMessage, 'Por favor, anexe um arquivo PDF, DOC ou DOCX.', 'error');
                return;
            }
            if (resume.size > 5 * 1024 * 1024) {
                showMessage(formMessage, 'O arquivo é muito grande. O tamanho máximo é 5MB.', 'error');
                return;
            }

            var submitBtn     = careerForm.querySelector('input[type="submit"]');
            var originalText  = submitBtn.value;
            submitBtn.value   = 'Enviando…';
            submitBtn.disabled = true;

            fetch('https://formspree.io/f/meoybze', {
                method: 'POST',
                body:   new FormData(careerForm)
            })
                .then(function(response) { return response.json(); })
                .then(function(data) {
                    if (data.ok || data.success) {
                        showMessage(formMessage, 'Candidatura enviada com sucesso! Entraremos em contato em breve.', 'success');
                        careerForm.reset();
                        if (fileLabel) fileLabel.textContent = 'Clique para anexar seu currículo';
                    } else {
                        showMessage(formMessage, 'Erro ao enviar candidatura. Tente novamente.', 'error');
                    }
                })
                .catch(function() {
                    showMessage(formMessage, 'Erro ao enviar candidatura. Verifique sua conexão e tente novamente.', 'error');
                })
                .finally(function() {
                    submitBtn.value    = originalText;
                    submitBtn.disabled = false;
                });
        });
    }

});


// ─── Contact form ─────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', function() {

    var contactForm    = document.getElementById('contactForm');
    var contactMessage = document.querySelector('#contact .form-message');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            var name    = document.getElementById('name').value.trim();
            var email   = document.getElementById('email').value.trim();
            var message = document.getElementById('message').value.trim();

            if (!name) {
                showMessage(contactMessage, 'Por favor, informe seu nome.', 'error');
                return;
            }
            if (!email || !isValidEmail(email)) {
                showMessage(contactMessage, 'Por favor, informe um email válido.', 'error');
                return;
            }
            if (!message || message.length < 10) {
                showMessage(contactMessage, 'A mensagem deve ter pelo menos 10 caracteres.', 'error');
                return;
            }

            var submitBtn    = contactForm.querySelector('input[type="submit"]');
            var originalText = submitBtn.value;
            submitBtn.value   = 'Enviando…';
            submitBtn.disabled = true;

            fetch('https://formspree.io/f/meoybzep', {
                method:  'POST',
                body:    new FormData(contactForm),
                headers: { 'Accept': 'application/json' }
            })
                .then(function(response) {
                    if (response.ok) {
                        showMessage(contactMessage, 'Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
                        contactForm.reset();
                    } else {
                        return response.json().then(function(data) {
                            var msg = data.errors
                                ? data.errors.map(function(err) { return err.message; }).join(', ')
                                : 'Erro ao enviar mensagem. Tente novamente.';
                            showMessage(contactMessage, msg, 'error');
                        });
                    }
                })
                .catch(function() {
                    showMessage(contactMessage, 'Erro ao enviar mensagem. Verifique sua conexão e tente novamente.', 'error');
                })
                .finally(function() {
                    submitBtn.value    = originalText;
                    submitBtn.disabled = false;
                });
        });
    }

    // Phone input formatter
    var phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            var value = e.target.value.replace(/\D/g, '');

            if (value.length <= 2) {
                e.target.value = value;
            } else if (value.length <= 6) {
                e.target.value = '(' + value.slice(0, 2) + ') ' + value.slice(2);
            } else if (value.length <= 10) {
                e.target.value = '(' + value.slice(0, 2) + ') ' + value.slice(2, 6) + '-' + value.slice(6);
            } else {
                e.target.value = '(' + value.slice(0, 2) + ') ' + value.slice(2, 7) + '-' + value.slice(7, 11);
            }
        });
    }

});