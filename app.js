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
  setInterval(() => {
    // Add next activity item from feed items array
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
    
    // Trigger entry transition
    setTimeout(() => {
      itemEl.style.transition = 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
      itemEl.style.opacity = '1';
      itemEl.style.transform = 'translateY(0)';
    }, 50);

    // Keep feed height tidy by removing the top item if we exceed 3 items
    if (activityFeed.children.length > 3) {
      const firstChild = activityFeed.children[0];
      firstChild.style.transition = 'all 0.5s';
      firstChild.style.opacity = '0';
      firstChild.style.transform = 'translateY(-15px)';
      setTimeout(() => {
        firstChild.remove();
      }, 500);
    }

    currentFeedIndex = (currentFeedIndex + 1) % feedItems.length;
  }, 3500);


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
  if (biometricSensorBtn) {
    let holdTimeout;
    
    const triggerVerification = () => {
      biometricSensorBtn.classList.add('holding');
      holdTimeout = setTimeout(() => {
        setPhoneStep(4); // Advance to dynamic cryptographic success
        biometricSensorBtn.classList.remove('holding');
      }, 800);
    };

    const cancelVerification = () => {
      clearTimeout(holdTimeout);
      biometricSensorBtn.classList.remove('holding');
    };

    // Support both desktop click/mousedown and mobile touch events
    biometricSensorBtn.addEventListener('mousedown', triggerVerification);
    biometricSensorBtn.addEventListener('mouseup', cancelVerification);
    biometricSensorBtn.addEventListener('mouseleave', cancelVerification);

    biometricSensorBtn.addEventListener('touchstart', (e) => {
      e.preventDefault();
      triggerVerification();
    });
    biometricSensorBtn.addEventListener('touchend', cancelVerification);
  }


  /* --- 4. DEVELOPER CODE TOGGLE WIDGET --- */
  const tabButtons = document.querySelectorAll('.widget-tab');
  const codeBlocks = document.querySelectorAll('.widget-code');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      
      tabButtons.forEach(b => {
        if (b.dataset.tab === tab) b.classList.add('active');
        else b.classList.remove('active');
      });

      codeBlocks.forEach(code => {
        if (code.id === `code-${tab}`) code.classList.add('active');
        else code.classList.remove('active');
      });
    });
  });


  /* --- 5. INTERSECTION OBSERVER FOR FADE-IN ANIMATIONS --- */
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

  /* --- 6. FIDO2 PROTOCOL SANDBOX --- */
  const simulateFidoBtn = document.getElementById('btn-simulate-fido2');
  const sandboxTerminal = document.getElementById('sandbox-terminal');
  const sandboxActionInput = document.getElementById('sandbox-action');
  const sandboxMessageInput = document.getElementById('sandbox-message');

  if (simulateFidoBtn && sandboxTerminal) {
    simulateFidoBtn.addEventListener('click', () => {
      const action = sandboxActionInput.value.trim() || 'stripe.payments.create';
      const message = sandboxMessageInput.value.trim() || 'Approve transaction';

      // Clear terminal and print simulation start
      sandboxTerminal.innerHTML = '';
      
      const appendLine = (text, type = '') => {
        const el = document.createElement('div');
        el.className = `terminal-line ${type}`;
        el.textContent = text;
        sandboxTerminal.appendChild(el);
        sandboxTerminal.scrollTop = sandboxTerminal.scrollHeight;
      };

      appendLine(`Initializing FIDO2 Session for action: ${action}`, 'prompt');
      
      setTimeout(() => {
        appendLine('Connecting to hardware authenticator via USB/NFC...', 'info');
      }, 400);

      setTimeout(() => {
        appendLine('Prompting user biometrics verification (PIN/TouchID)...', 'warning');
      }, 1000);

      setTimeout(() => {
        appendLine('TouchID verified. Generating Secp256r1 signature keypair...', 'success');
      }, 1800);

      setTimeout(() => {
        const challenge = btoa(Math.random().toString()).substring(0, 16);
        const rawSig = '3045022100' + Array.from({length:64}, () => Math.floor(Math.random()*16).toString(16)).join('');
        appendLine('----- CRYPTOGRAPHIC PROOF -----', 'info');
        appendLine(`Challenge: ${challenge}`, 'info');
        appendLine(`ClientDataHash: sha256(${JSON.stringify({action, message})})`, 'info');
        appendLine(`Signature: ${rawSig}`, 'success');
        appendLine('-------------------------------', 'info');
        appendLine('AC2 SECURE SIGNATURE GENERATED SUCCESSFULLY.', 'success');
      }, 2600);
    });
  }
});

