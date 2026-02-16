// ============================================
// WEDDING INVITATION - JavaScript
// ============================================

document.addEventListener('DOMContentLoaded', () => {

    // ============================================
    // COUNTDOWN TIMER
    // ============================================
    const weddingDate = new Date('2026-10-23T18:00:00').getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = weddingDate - now;

        if (distance < 0) {
            document.getElementById('days').textContent = '000';
            document.getElementById('hours').textContent = '00';
            document.getElementById('minutes').textContent = '00';
            document.getElementById('seconds').textContent = '00';
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById('days').textContent = String(days).padStart(3, '0');
        document.getElementById('hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);

    // ============================================
    // MUSIC PLAYER
    // ============================================
    const playBtn = document.getElementById('playBtn');
    const bgMusic = document.getElementById('bgMusic');
    let isPlaying = false;

    playBtn.addEventListener('click', () => {
        if (isPlaying) {
            bgMusic.pause();
            playBtn.classList.remove('playing');
            isPlaying = false;
        } else {
            bgMusic.play().then(() => {
                playBtn.classList.add('playing');
                isPlaying = true;
            }).catch(() => {
                // Audio play failed (no audio file or browser policy)
                playBtn.classList.toggle('playing');
                isPlaying = !isPlaying;
            });
        }
    });

    // Prev/Next buttons (visual feedback)
    document.getElementById('prevBtn').addEventListener('click', () => {
        if (bgMusic.src) {
            bgMusic.currentTime = Math.max(0, bgMusic.currentTime - 10);
        }
    });

    document.getElementById('nextBtn').addEventListener('click', () => {
        if (bgMusic.src) {
            bgMusic.currentTime = Math.min(bgMusic.duration, bgMusic.currentTime + 10);
        }
    });

    // ============================================
    // SCROLL ANIMATIONS (Intersection Observer)
    // ============================================
    const animatedElements = document.querySelectorAll(
        '.venue-card, .info-card, .dresscode-content, .countdown-block, ' +
        '.date-display, .parents-block, .bible-verse, .pases-content, ' +
        '.closing-message, .timeline-item, .form-container, .monogram'
    );

    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => observer.observe(el));

    // ============================================
    // SCROLL BUTTONS
    // ============================================
    const scrollUpBtn = document.getElementById('scrollUpBtn');
    if (scrollUpBtn) {
        scrollUpBtn.addEventListener('click', () => {
            window.scrollBy({ top: -window.innerHeight, behavior: 'smooth' });
        });
    }

    const scrollTopBtn = document.getElementById('scrollTopBtn');
    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ============================================
    // PASE CIRCLES - Interactive selection
    // ============================================
    const paseCircles = document.querySelectorAll('.pase-circle');
    paseCircles.forEach(circle => {
        circle.addEventListener('click', () => {
            paseCircles.forEach(c => c.style.background = '');
            paseCircles.forEach(c => c.style.color = '');

            const num = parseInt(circle.textContent);
            for (let i = 0; i < num; i++) {
                paseCircles[i].style.background = 'var(--primary)';
                paseCircles[i].style.color = 'white';
            }
        });
    });

    // ============================================
    // RSVP FORM → Google Forms
    // ============================================
    // INSTRUCCIONES PARA CONECTAR CON GOOGLE FORMS:
    // 1. Crea un Google Form con estos campos:
    //    - Nombre (respuesta corta)
    //    - Apellido (respuesta corta)
    //    - Correo electrónico (respuesta corta)
    //    - ¿Asistirás? (opción múltiple: Sí asistiré / No podré asistir / Tal vez)
    //    - Número de invitados (opción múltiple: 1/2/3/4)
    //    - Mensaje para los novios (párrafo)
    // 2. Obtén el link "pre-filled" del form y extrae:
    //    - GOOGLE_FORM_ACTION_URL (la URL del form sin /viewform)
    //    - Los entry IDs de cada campo (entry.XXXXXXX)
    // 3. Reemplaza los valores abajo:

    const GOOGLE_FORM_ACTION_URL = 'TU_GOOGLE_FORM_URL/formResponse';
    const FIELD_IDS = {
        nombre:     'entry.XXXXXXXXXX',  // Reemplaza con tu entry ID
        apellido:   'entry.XXXXXXXXXX',
        email:      'entry.XXXXXXXXXX',
        asistencia: 'entry.XXXXXXXXXX',
        invitados:  'entry.XXXXXXXXXX',
        mensaje:    'entry.XXXXXXXXXX'
    };

    const rsvpForm = document.getElementById('rsvpForm');
    const submitBtn = document.getElementById('submitBtn');
    const formSuccess = document.getElementById('formSuccess');

    if (rsvpForm) {
        rsvpForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Validación básica
            const nombre = rsvpForm.nombre.value.trim();
            const apellido = rsvpForm.apellido.value.trim();
            const asistencia = rsvpForm.asistencia.value;

            if (!nombre || !apellido) {
                shakeInput(rsvpForm.nombre);
                shakeInput(rsvpForm.apellido);
                return;
            }

            if (!asistencia) {
                shakeInput(rsvpForm.asistencia);
                return;
            }

            // Enviar a Google Forms
            submitBtn.classList.add('loading');
            submitBtn.textContent = 'ENVIANDO...';

            const formData = new URLSearchParams();
            formData.append(FIELD_IDS.nombre, nombre);
            formData.append(FIELD_IDS.apellido, apellido);
            formData.append(FIELD_IDS.email, rsvpForm.email.value.trim());
            formData.append(FIELD_IDS.asistencia, asistencia);
            formData.append(FIELD_IDS.invitados, rsvpForm.invitados.value);
            formData.append(FIELD_IDS.mensaje, rsvpForm.mensaje.value.trim());

            fetch(GOOGLE_FORM_ACTION_URL, {
                method: 'POST',
                mode: 'no-cors',
                body: formData
            }).then(() => {
                // Google Forms con no-cors siempre llega aquí
                showSuccess();
            }).catch(() => {
                // Incluso si hay error de CORS, el form se envía
                showSuccess();
            });
        });
    }

    function showSuccess() {
        submitBtn.style.display = 'none';
        rsvpForm.querySelectorAll('.form-row, .form-group').forEach(el => {
            el.style.display = 'none';
        });
        formSuccess.classList.add('show');
    }

    function shakeInput(input) {
        if (!input) return;
        input.style.borderColor = '#e74c3c';
        input.style.animation = 'shake 0.4s ease';
        setTimeout(() => {
            input.style.borderColor = '';
            input.style.animation = '';
        }, 600);
    }

    // ============================================
    // SMOOTH REVEAL ON LOAD
    // ============================================
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.6s ease';
    requestAnimationFrame(() => {
        document.body.style.opacity = '1';
    });

});
