document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  const navItems = document.querySelectorAll('.nav-link');
  const topBar = document.querySelector('.top-bar');

  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      menuToggle.classList.toggle('open');
      document.body.classList.toggle('no-scroll');
    });
  }

  navItems.forEach(link => {
    link.addEventListener('click', () => {
      if (navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        menuToggle.classList.remove('open');
        document.body.classList.remove('no-scroll');
      }
    });
  });

  document.addEventListener('click', (e) => {
    if (navLinks && menuToggle && !navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
      navLinks.classList.remove('active');
      menuToggle.classList.remove('open');
      document.body.classList.remove('no-scroll');
    }
  });

  const highlightActiveLink = () => {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    navItems.forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPage || (currentPage === 'index.html' && href === './')) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  };
  highlightActiveLink();

  const handleNavScroll = () => {
    if (!topBar) return;
    const scrollThreshold = window.innerWidth < 1024 ? 20 : 50;
    if (window.scrollY > scrollThreshold) {
      topBar.classList.add('scrolled');
    } else {
      topBar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  const yearEl = document.getElementById('footerYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const backToTopBtn = document.querySelector('.back-to-top');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  if (typeof gsap !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    const heroPortrait = document.querySelector('.hero-portrait-container');
    const heroText = document.querySelector('.hero-main-text');
    if (heroPortrait) {
      gsap.fromTo(heroPortrait,
        { x: -60, opacity: 0, scale: 0.9 },
        { x: 0, opacity: 1, scale: 1, duration: 1.2, ease: 'power3.out' }
      );
    }
    if (heroText) {
      gsap.fromTo(heroText,
        { x: 60, opacity: 0 },
        { x: 0, opacity: 1, duration: 1.2, delay: 0.2, ease: 'power3.out' }
      );
    }

    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
      gsap.fromTo(section,
        { y: 50, opacity: 0 },
        {
          scrollTrigger: {
            trigger: section,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          },
          duration: 1,
          y: 0,
          opacity: 1,
          ease: 'power2.out'
        }
      );
    });

    const featureImages = document.querySelectorAll('.profile-image, .about-image-wrapper img, .card-image');
    featureImages.forEach(img => {
      if (img.closest('.hero-content')) return;

      gsap.fromTo(img,
        { scale: 0.8, opacity: 0, filter: 'blur(10px)' },
        {
          scrollTrigger: {
            trigger: img,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          },
          duration: 1.2,
          scale: 1,
          opacity: 1,
          filter: 'blur(0px)',
          ease: 'power2.out'
        }
      );
    });
  }
});
