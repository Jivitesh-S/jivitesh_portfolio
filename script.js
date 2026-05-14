(() => {
  const header = document.getElementById("site-header");
  const menuToggle = document.getElementById("menu-toggle");
  const siteNav = document.getElementById("site-nav");
  const navLinks = [...document.querySelectorAll(".site-nav a")];
  const sections = [...document.querySelectorAll("main section[id]")];
  const revealItems = [...document.querySelectorAll(".reveal")];
  const counters = [...document.querySelectorAll("[data-count]")];
  const filterButtons = [...document.querySelectorAll(".filter-button")];
  const skillCards = [...document.querySelectorAll(".skill-card")];

  function updateHeader() {
    header.classList.toggle("scrolled", window.scrollY > 12);
  }

  function updateActiveNav() {
    let currentId = "";

    sections.forEach((section) => {
      const top = section.offsetTop - 140;
      const bottom = top + section.offsetHeight;
      if (window.scrollY >= top && window.scrollY < bottom) {
        currentId = section.id;
      }
    });

    navLinks.forEach((link) => {
      const isActive = link.getAttribute("href") === `#${currentId}`;
      link.classList.toggle("active", isActive);
    });
  }

  function closeMenu() {
    siteNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  }

  menuToggle?.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  window.addEventListener(
    "scroll",
    () => {
      updateHeader();
      updateActiveNav();
    },
    { passive: true }
  );

  updateHeader();
  updateActiveNav();

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16, rootMargin: "0px 0px -40px 0px" }
  );

  revealItems.forEach((item) => revealObserver.observe(item));

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        const target = Number(entry.target.getAttribute("data-count"));
        const suffix = entry.target.getAttribute("data-suffix") || "";
        const duration = 1100;
        const startTime = performance.now();

        function tick(now) {
          const progress = Math.min((now - startTime) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          entry.target.textContent = `${Math.round(target * eased)}${suffix}`;

          if (progress < 1) {
            requestAnimationFrame(tick);
          } else {
            entry.target.textContent = `${target}${suffix}`;
          }
        }

        requestAnimationFrame(tick);
        counterObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.45 }
  );

  counters.forEach((counter) => counterObserver.observe(counter));

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.getAttribute("data-filter");

      filterButtons.forEach((item) => item.classList.remove("active"));
      button.classList.add("active");

      skillCards.forEach((card) => {
        const group = card.getAttribute("data-group");
        const shouldShow = filter === "all" || filter === group;
        card.classList.toggle("hidden", !shouldShow);
      });
    });
  });
})();
