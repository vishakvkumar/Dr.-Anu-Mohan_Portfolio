document.addEventListener('DOMContentLoaded', () => {
  // --- DOM Elements ---
  const header = document.getElementById('header');
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');
  const navLinkItems = document.querySelectorAll('.nav-link');
  
  // Publication elements
  const pubSearchInput = document.getElementById('pub-search');
  const filterChips = document.querySelectorAll('.filter-chip');
  const pubCards = document.querySelectorAll('.pub-card');
  const pubNoResults = document.getElementById('pub-no-results');

  // Presentation elements
  const presTabBtns = document.querySelectorAll('.pres-tab-btn');
  const presCards = document.querySelectorAll('.pres-card');

  // Contact form elements
  const contactForm = document.getElementById('portfolio-contact-form');
  const successModal = document.getElementById('success-modal');
  const closeModalBtn = document.getElementById('close-modal-btn');

  // --- Sticky Header & Shadow on Scroll ---
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // --- Mobile Hamburger Menu ---
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      const icon = menuToggle.querySelector('i');
      if (navLinks.classList.contains('active')) {
        icon.className = 'fa-solid fa-xmark';
      } else {
        icon.className = 'fa-solid fa-bars';
      }
    });

    // Close mobile menu when nav link is clicked
    navLinkItems.forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        menuToggle.querySelector('i').className = 'fa-solid fa-bars';
      });
    });
  }

  // --- Active Nav Link Highlighting for Multi-page Layout ---
  const currentPath = window.location.pathname;
  const currentFilename = currentPath.split('/').pop() || 'index.html';

  navLinkItems.forEach(link => {
    const linkPath = link.getAttribute('href');
    if (linkPath === currentFilename) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // --- Publication Filter & Search Logic (Research Page) ---
  if (pubSearchInput && pubCards.length > 0) {
    let activeTagFilter = 'all';
    let searchQuery = '';

    function filterPublications() {
      let visibleCount = 0;

      pubCards.forEach(card => {
        const title = card.querySelector('.pub-title').textContent.toLowerCase();
        const authors = card.querySelector('.pub-authors').textContent.toLowerCase();
        const journal = card.querySelector('.pub-journal').textContent.toLowerCase();
        const tags = card.getAttribute('data-tags') || '';
        
        const matchesSearch = title.includes(searchQuery) || 
                              authors.includes(searchQuery) || 
                              journal.includes(searchQuery);

        const matchesTag = activeTagFilter === 'all' || tags.split(' ').includes(activeTagFilter);

        if (matchesSearch && matchesTag) {
          card.style.display = 'grid';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });

      if (pubNoResults) {
        if (visibleCount === 0) {
          pubNoResults.style.display = 'block';
        } else {
          pubNoResults.style.display = 'none';
        }
      }
    }

    // Tag chip click handlers
    filterChips.forEach(chip => {
      chip.addEventListener('click', () => {
        filterChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        activeTagFilter = chip.getAttribute('data-filter');
        filterPublications();
      });
    });

    // Search input typing handler
    pubSearchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      filterPublications();
    });
  }

  // --- Presentation Year Tab Switcher (Research Page) ---
  if (presTabBtns.length > 0 && presCards.length > 0) {
    presTabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        presTabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const year = btn.getAttribute('data-year');
        
        presCards.forEach(card => {
          const cardYear = card.getAttribute('data-year');
          if (year === 'all' || cardYear === year) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // --- Contact Form Handling with Success Modal (Contact Page) ---
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Simple UI state change during simulated submit
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnHtml = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Sending...';

      // Simulate API submit latency of 1s
      setTimeout(() => {
        // Reset submit button state
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHtml;

        // Reset form inputs
        contactForm.reset();

        // Display Success Modal
        if (successModal) {
          successModal.classList.add('active');
        }
      }, 1000);
    });
  }

  // Close Success Modal
  if (closeModalBtn && successModal) {
    closeModalBtn.addEventListener('click', () => {
      successModal.classList.remove('active');
    });

    // Close Success Modal on overlay click
    successModal.addEventListener('click', (e) => {
      if (e.target === successModal) {
        successModal.classList.remove('active');
      }
    });
  }
});
