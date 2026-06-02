document.addEventListener('DOMContentLoaded', () => {

  /* --- 1. HEADER SCROLL TRIGGER --- */
  const header = document.getElementById('site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  /* --- 2. HERO ACTIVITY FEED STREAMER --- */
  const activityFeed = document.getElementById('activity-feed');
  const feedItems = [
    { type: 'coral', text: 'Hermes wants to read Stripe Keys', action: 'Blocked', actionClass: 'pending' },
    { type: 'teal', text: 'OpenClaw sent draft to client', action: 'Approved', actionClass: 'approved' },
    { type: 'amber', text: 'Claude agent requesting SSH access', action: 'Blocked', actionClass: 'pending' },
    { type: 'teal', text: 'Hermes scheduled calendar sync', action: 'Approved', actionClass: 'approved' },
    { type: 'coral', text: 'CrewAI requested OAuth token', action: 'Blocked', actionClass: 'pending' },
    { type: 'teal', text: 'Claude posted Twitter update', action: 'Approved', actionClass: 'approved' }
  ];

  let currentFeedIndex = 2;

  function scheduleNextFeedItem() {
    const jitter = (Math.random() - 0.5) * 1200; // ±600ms variance
    const delay = 3500 + jitter;
    setTimeout(() => {
      const item = feedItems[currentFeedIndex];
      const itemEl = document.createElement('div');
      itemEl.className = `activity-item ${item.type}`;
      itemEl.style.opacity = '0';
      itemEl.style.transform = 'translateY(15px)';

      itemEl.innerHTML = `
        <div class="activity-badge"></div>
        <span class="activity-text">${item.text}</span>
        <span class="activity-action ${item.actionClass}">${item.action}</span>
      `;

      activityFeed.appendChild(itemEl);

      setTimeout(() => {
        itemEl.style.transition = 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
        itemEl.style.opacity = '1';
        itemEl.style.transform = 'translateY(0)';
      }, 50);

      if (activityFeed.children.length > 3) {
        const firstChild = activityFeed.children[0];
        firstChild.style.transition = 'all 0.5s';
        firstChild.style.opacity = '0';
        firstChild.style.transform = 'translateY(-15px)';
        setTimeout(() => firstChild.remove(), 500);
      }

      currentFeedIndex = (currentFeedIndex + 1) % feedItems.length;
      scheduleNextFeedItem();
    }, delay);
  }

  scheduleNextFeedItem();


  /* --- 3. INTERACTIVE STEP-BY-STEP PHONE SIMULATOR --- */
  const stepCards = document.querySelectorAll('.step-card');
  const phoneViews = document.querySelectorAll('.phone-view');
  
  function setPhoneStep(stepNumber) {
    // Update step card active classes
    stepCards.forEach(card => {
      if (card.dataset.step === String(stepNumber)) {
        card.classList.add('active');
      } else {
        card.classList.remove('active');
      }
    });

    // Update phone screen active view
    phoneViews.forEach(view => {
      if (view.id === `view-step-${stepNumber}`) {
        view.classList.add('active');
      } else {
        view.classList.remove('active');
      }
    });
  }

  // Bind clicks to the step cards
  stepCards.forEach(card => {
    card.addEventListener('click', () => {
      const step = parseInt(card.dataset.step);
      setPhoneStep(step);
    });
  });

  // Step 2 Screen approvals clicks inside the phone mockup
  const denyBtn = document.querySelector('.phone-btn.cancel');
  const approveBtn = document.querySelector('.phone-btn.approve');

  if (denyBtn) {
    denyBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      setPhoneStep(1); // Go back to notification
    });
  }

  if (approveBtn) {
    approveBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      setPhoneStep(3); // Advance to biometric verification
    });
  }

  // Step 3 Sensor tactile hold simulation
  const biometricSensorBtn = document.getElementById('biometrics-sensor-btn');
  const progressFill = document.getElementById('biometrics-progress-fill');
  if (biometricSensorBtn && progressFill) {
    const HOLD_DURATION = 800;
    const CIRCUMFERENCE = 289;
    let holdTimeout = null;
    let progressRaf = null;
    let holdStart = null;

    const animateProgress = (timestamp) => {
      if (!holdStart) holdStart = timestamp;
      const elapsed = timestamp - holdStart;
      const pct = Math.min(elapsed / HOLD_DURATION, 1);
      progressFill.style.strokeDashoffset = CIRCUMFERENCE * (1 - pct);
      if (pct < 1) {
        progressRaf = requestAnimationFrame(animateProgress);
      }
    };

    const triggerVerification = () => {
      holdStart = null;
      biometricSensorBtn.classList.add('holding');
      progressRaf = requestAnimationFrame(animateProgress);
      holdTimeout = setTimeout(() => {
        cancelAnimationFrame(progressRaf);
        progressFill.style.strokeDashoffset = 0;
        setPhoneStep(4);
        biometricSensorBtn.classList.remove('holding');
        // Reset ring after transition
        setTimeout(() => { progressFill.style.strokeDashoffset = CIRCUMFERENCE; }, 600);
      }, HOLD_DURATION);
    };

    const cancelVerification = () => {
      clearTimeout(holdTimeout);
      cancelAnimationFrame(progressRaf);
      progressFill.style.strokeDashoffset = CIRCUMFERENCE;
      biometricSensorBtn.classList.remove('holding');
      holdStart = null;
    };

    biometricSensorBtn.addEventListener('mousedown', triggerVerification);
    biometricSensorBtn.addEventListener('mouseup', cancelVerification);
    biometricSensorBtn.addEventListener('mouseleave', cancelVerification);

    biometricSensorBtn.addEventListener('touchstart', (e) => {
      e.preventDefault();
      triggerVerification();
    });
    biometricSensorBtn.addEventListener('touchend', cancelVerification);
  }


  /* --- 4. INTERSECTION OBSERVER FOR FADE-IN ANIMATIONS --- */
  const fadeElements = document.querySelectorAll('.fade-in');
  
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const animationObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Trigger only once
      }
    });
  }, observerOptions);

  fadeElements.forEach(el => {
    animationObserver.observe(el);
  });

  // Highlight active header link based on scroll position
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    let currentSection = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= (sectionTop - 150)) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.style.color = 'var(--accent-coral)';
      } else {
        link.style.color = '';
      }
    });
  });

});

