const desktopNavMedia = window.matchMedia("(min-width: 901px)");

document.querySelectorAll(".navbar").forEach((navbar) => {
    const toggle = navbar.querySelector(".nav-toggle");
    const menu = navbar.querySelector(".nav-menu");

    if (!toggle || !menu) {
        return;
    }

    function closeMenu() {
        navbar.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
    }

    toggle.addEventListener("click", () => {
        const isOpen = navbar.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    menu.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", closeMenu);
    });

    desktopNavMedia.addEventListener("change", (event) => {
        if (event.matches) {
            closeMenu();
        }
    });
});
