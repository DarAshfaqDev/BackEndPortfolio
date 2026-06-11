document.addEventListener('DOMContentLoaded', () => {
  if (typeof gsap !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    initArticlesAnimations();
  }

  const cards = document.querySelectorAll('.article-card');

  cards.forEach(card => {
    const glare = card.querySelector('.card-glare');

    card.addEventListener('mousemove', (e) => {
      if (glare) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const glareX = (x / rect.width) * 100;
        const glareY = (y / rect.height) * 100;
        card.style.setProperty('--glare-x', `${glareX}%`);
        card.style.setProperty('--glare-y', `${glareY}%`);
      }
    });
  });

  if (typeof gsap !== 'undefined') {
    gsap.from('.article-card', {
      scrollTrigger: {
        trigger: '.articles-grid',
        start: 'top 95%',
      },
      y: 50,
      opacity: 0,
      scale: 0.95,
      duration: 0.6,
      stagger: 0.05,
      ease: 'power3.out',
      clearProps: 'all'
    });
  }

  const searchInput = document.getElementById('article-search');
  const filterPills = document.querySelectorAll('.pill');

  function filterArticles() {
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    const activePill = document.querySelector('.pill.active');
    const activeFilter = activePill ? activePill.dataset.filter : 'all';

    cards.forEach(card => {
      const title = card.querySelector('h3').textContent.toLowerCase();
      const desc = card.querySelector('p').textContent.toLowerCase();
      const category = card.dataset.category;

      const matchesSearch = title.includes(searchTerm) || desc.includes(searchTerm);
      const matchesFilter = activeFilter === 'all' || category === activeFilter;

      if (matchesSearch && matchesFilter) {
        card.style.display = 'flex';
        if (typeof gsap !== 'undefined') {
          gsap.to(card, { opacity: 1, scale: 1, duration: 0.4 });
        }
      } else {
        card.style.display = 'none';
        card.style.opacity = '0';
        card.style.transform = 'scale(0.9)';
      }
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', filterArticles);
  }

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      filterArticles();
    });
  });
});

function initArticlesAnimations() {
  const headerTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: '.hub-header',
      start: 'top 85%',
    }
  });

  headerTimeline
    .from('.header-watermark', {
      scale: 0.8,
      opacity: 0,
      duration: 2,
      ease: 'expo.out'
    })
    .from('.title-part-1', {
      x: -50,
      opacity: 0,
      duration: 1.2,
      ease: 'power4.out'
    }, '-=1.5')
    .from('.title-part-2', {
      x: 50,
      opacity: 0,
      duration: 1.2,
      ease: 'power4.out'
    }, '-=1.0')
    .from('.header-separator-line', {
      width: 0,
      duration: 1,
      ease: 'expo.out'
    }, '-=0.8')
    .from('.hub-tagline', {
      y: 20,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    }, '-=0.6');
}
