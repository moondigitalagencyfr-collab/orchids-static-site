// Moon Digital Agency - Static Site JavaScript

document.addEventListener('DOMContentLoaded', function() {
  // Mobile Navigation Toggle
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function() {
      const isOpen = navMenu.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen);
      navToggle.innerHTML = isOpen ? '✕' : '☰';
    });
  }

  // Dropdown Toggle (for mobile)
  const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
  
  dropdownToggles.forEach(toggle => {
    toggle.addEventListener('click', function(e) {
      if (window.innerWidth <= 900) {
        e.preventDefault();
        const parent = this.closest('.has-dropdown');
        parent.classList.toggle('open');
      }
    });
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.has-dropdown')) {
      document.querySelectorAll('.has-dropdown.open').forEach(el => {
        el.classList.remove('open');
      });
    }
  });

  // Scroll Reveal Animation
  const reveals = document.querySelectorAll('.reveal');
  
  function handleReveal() {
    reveals.forEach(element => {
      const elementTop = element.getBoundingClientRect().top;
      const elementVisible = 100;
      
      if (elementTop < window.innerHeight - elementVisible) {
        element.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', handleReveal);
  handleReveal(); // Initial check

  // Smooth Scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        
        // Close mobile menu if open
        if (navMenu && navMenu.classList.contains('open')) {
          navMenu.classList.remove('open');
          navToggle.innerHTML = '☰';
        }
      }
    });
  });

  // Header scroll effect
  const header = document.querySelector('.site-header');
  let lastScroll = 0;
  
  window.addEventListener('scroll', function() {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
      header.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.3)';
    } else {
      header.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
  });

  // Footer year
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Portfolio Filter (if on portfolio page)
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioCards = document.querySelectorAll('.portfolio-card');
  
  filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const filter = this.dataset.filter;
      
      filterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      
      portfolioCards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = 'block';
          setTimeout(() => card.classList.add('active'), 10);
        } else {
          card.classList.remove('active');
          setTimeout(() => card.style.display = 'none', 300);
        }
      });
    });
  });

  // Contact Form (Formspree integration)
  const contactForm = document.querySelector('#contact-form');
  
  if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const formData = new FormData(this);
      const submitBtn = this.querySelector('button[type="submit"]');
      const formStatus = document.getElementById('form-status');
      const originalBtnText = submitBtn.innerHTML;
      
      submitBtn.innerHTML = 'Envoi en cours...';
      submitBtn.disabled = true;
      
      try {
        const response = await fetch(this.action, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });
        
        if (response.ok) {
          formStatus.style.display = 'block';
          formStatus.style.color = '#22c55e';
          formStatus.textContent = '✓ Merci pour votre message ! Nous vous répondrons sous 24h.';
          this.reset();
        } else {
          throw new Error('Erreur serveur');
        }
      } catch (error) {
        formStatus.style.display = 'block';
        formStatus.style.color = '#ef4444';
        formStatus.textContent = '✕ Erreur lors de l\'envoi. Veuillez réessayer ou nous contacter par email.';
      }
      
      submitBtn.innerHTML = originalBtnText;
      submitBtn.disabled = false;
    });
  }

  // Animated Counter for Stats
  const statValues = document.querySelectorAll('.stat-value[data-value]');
  
  function animateValue(el, start, end, duration) {
    const range = end - start;
    const startTime = performance.now();
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    
    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(start + range * easeOut);
      
      el.textContent = prefix + current + suffix;
      
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }
    
    requestAnimationFrame(update);
  }

  // Intersection Observer for stats animation
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.animated) {
        entry.target.dataset.animated = 'true';
        const value = parseInt(entry.target.dataset.value);
        animateValue(entry.target, 0, value, 2000);
      }
    });
  }, { threshold: 0.5 });

  statValues.forEach(stat => statsObserver.observe(stat));

  // Parallax effect for blobs (desktop only)
  if (window.innerWidth > 768) {
    const blobs = document.querySelectorAll('.hero-blob');
    
    document.addEventListener('mousemove', function(e) {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      
      blobs.forEach((blob, index) => {
        const speed = (index + 1) * 15;
        blob.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
      });
    });
  }

  // Add active class to current page nav link
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-menu a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === 'index.html' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // Spotlight Effect for Glass Cards
  const spotlightCards = document.querySelectorAll('.glass-card');
  
  spotlightCards.forEach(card => {
    card.classList.add('card-spotlight');
    
    card.addEventListener('mousemove', function(e) {
      const rect = this.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      
      this.style.setProperty('--mouse-x', `${x}%`);
      this.style.setProperty('--mouse-y', `${y}%`);
      
      // Customize spotlight color based on card type
      if (this.classList.contains('service-card')) {
        if (this.querySelector('.service-icon.blue')) {
          this.style.setProperty('--spotlight-color', 'rgba(59, 130, 246, 0.15)');
        } else if (this.querySelector('.service-icon.purple')) {
          this.style.setProperty('--spotlight-color', 'rgba(168, 85, 247, 0.15)');
        } else if (this.querySelector('.service-icon.cyan')) {
          this.style.setProperty('--spotlight-color', 'rgba(34, 211, 238, 0.15)');
        } else if (this.querySelector('.service-icon.orange')) {
          this.style.setProperty('--spotlight-color', 'rgba(249, 115, 22, 0.15)');
        } else if (this.querySelector('.service-icon.pink')) {
          this.style.setProperty('--spotlight-color', 'rgba(236, 72, 153, 0.15)');
        } else if (this.querySelector('.service-icon.green')) {
          this.style.setProperty('--spotlight-color', 'rgba(34, 197, 94, 0.15)');
        }
      } else if (this.classList.contains('benefit-card')) {
        if (this.querySelector('.benefit-icon.cyan')) {
          this.style.setProperty('--spotlight-color', 'rgba(34, 211, 238, 0.15)');
        } else if (this.querySelector('.benefit-icon.purple')) {
          this.style.setProperty('--spotlight-color', 'rgba(168, 85, 247, 0.15)');
        } else if (this.querySelector('.benefit-icon.pink')) {
          this.style.setProperty('--spotlight-color', 'rgba(236, 72, 153, 0.15)');
        } else if (this.querySelector('.benefit-icon.orange')) {
          this.style.setProperty('--spotlight-color', 'rgba(249, 115, 22, 0.15)');
        }
      } else {
        this.style.setProperty('--spotlight-color', 'rgba(255, 255, 255, 0.08)');
      }
    });
  });
});