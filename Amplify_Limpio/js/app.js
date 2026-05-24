document.addEventListener("DOMContentLoaded", () => {
    inyectarElementos();
    initLoader();
    initCursor();
    initPageTransitions();
    initHeaderBehavior();
    initMobileMenu();
    initRevealAnimations();
});

function inyectarElementos() {
    if (!document.querySelector('.site-loader')) {
        const elementos = `
            <div class="site-loader">
                <h1 class="loader-logo">Amplify<span>.</span></h1>
                <div class="loader-line"></div>
            </div>
            <div class="custom-cursor"></div>
            <div class="page-transition"></div>
        `;
        document.body.insertAdjacentHTML('afterbegin', elementos);
    }
}

function initLoader() {
    const loader = document.querySelector(".site-loader");
    if (!loader) return;
    setTimeout(() => {
        loader.classList.add("hidden");
        setTimeout(() => loader.remove(), 1000); 
    }, 1800);
}

/* ==========================================
   CURSOR CON INERCIA (LERP) Y EFECTO MAGNÉTICO
========================================== */
function initCursor() {
    const cursor = document.querySelector(".custom-cursor");
    if (!cursor) return;
    
    document.body.style.cursor = "none";
    
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let currentX = mouseX;
    let currentY = mouseY;

    // 1. Rastrear posición del mouse
    window.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // 2. Animar con física (Suavidad pura)
    function animateCursor() {
        currentX += (mouseX - currentX) * 0.15; // 0.15 es la fluidez
        currentY += (mouseY - currentY) * 0.15;
        
        // Asignación directa (cero lag)
        cursor.style.left = currentX + "px";
        cursor.style.top = currentY + "px";
        
        requestAnimationFrame(animateCursor);
    }
    animateCursor();
    
    // 3. Interactividad Magnética y Hover
    document.querySelectorAll("a, button, .hover-lift, .portfolio-image").forEach((el) => {
        
        // Agregar suavidad nativa a los botones magnéticos para que no den tirones
        if (el.classList.contains('primary-button') || el.classList.contains('header-cta') || el.classList.contains('secondary-button')) {
            el.style.transition = "transform 0.3s ease-out, background 0.3s ease";
            el.style.willChange = "transform";
        }

        // Hover: Crecer cursor
        el.addEventListener("mouseenter", () => cursor.classList.add("active"));
        
        // Salir: Achicar cursor y soltar botón magnético
        el.addEventListener("mouseleave", () => {
            cursor.classList.remove("active");
            if (el.classList.contains('primary-button') || el.classList.contains('header-cta') || el.classList.contains('secondary-button')) {
                el.style.transform = `translate(0px, 0px)`; // Regresa como resorte suave
            }
        });
        
        // Mover: Efecto magnético siguiendo al cursor
        if (el.classList.contains('primary-button') || el.classList.contains('header-cta') || el.classList.contains('secondary-button')) {
            el.addEventListener("mousemove", (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                el.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
            });
        }
        
        el.style.cursor = "none";
    });
}

function initPageTransitions() {
    const transitionLayer = document.querySelector(".page-transition");
    if (!transitionLayer) return;
    document.querySelectorAll("a[href]").forEach((link) => {
        link.addEventListener("click", (e) => {
            const href = link.getAttribute("href");
            if (href && !href.startsWith("#") && !href.startsWith("mailto") && link.target !== "_blank") {
                e.preventDefault();
                transitionLayer.classList.add("active");
                setTimeout(() => window.location.href = href, 600);
            }
        });
    });
}

function initHeaderBehavior() {
    const header = document.querySelector(".site-header");
    if (!header) return;
    let lastScroll = 0;
    window.addEventListener("scroll", () => {
        const currentScroll = window.scrollY;
        if (currentScroll > 40) {
            // Negro verdadero con opacidad, en lugar de gris
            header.style.background = "rgba(0, 0, 0, 0.6)";
            header.style.backdropFilter = "blur(12px)";
            header.style.borderBottom = "1px solid rgba(255, 255, 255, 0.05)";
        } else {
            header.style.background = "transparent";
            header.style.backdropFilter = "none";
            header.style.borderBottom = "1px solid transparent";
        }
        header.style.transform = (currentScroll > lastScroll && currentScroll > 120) ? "translateY(-100%)" : "translateY(0%)";
        lastScroll = currentScroll;
    });
}

function initMobileMenu() {
    const btn = document.querySelector(".menu-toggle");
    const nav = document.querySelector(".main-navigation");
    if (!btn || !nav) return;
    btn.addEventListener("click", () => {
        nav.classList.toggle("mobile-active");
        btn.classList.toggle("active");
        document.body.style.overflow = nav.classList.contains("mobile-active") ? "hidden" : "";
    });
}

function initRevealAnimations() {
    const elements = document.querySelectorAll(".fade-up, .fade-left, .fade-right, .scale-in");
    if (!elements.length) return;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = "running";
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    elements.forEach(el => {
        el.style.animationPlayState = "paused";
        observer.observe(el);
    });
}
