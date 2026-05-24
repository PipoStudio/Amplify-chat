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
    
    // TIEMPO DEL VIDEO: Forzamos que se muestre 1.8 segundos
    setTimeout(() => {
        loader.classList.add("hidden");
        setTimeout(() => loader.remove(), 1000); 
    }, 1800);
}

function initCursor() {
    const cursor = document.querySelector(".custom-cursor");
    if (!cursor) return;
    document.body.style.cursor = "none";
    
    document.addEventListener("mousemove", (e) => {
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
    });
    
    document.querySelectorAll("a, button, .hover-lift, .portfolio-image").forEach((el) => {
        el.addEventListener("mouseenter", () => cursor.classList.add("active"));
        el.addEventListener("mouseleave", () => cursor.classList.remove("active"));
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
        // MODO OSCURO PARA EL NAVBAR
        if (currentScroll > 40) {
            header.style.background = "rgba(13, 13, 13, 0.85)";
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
