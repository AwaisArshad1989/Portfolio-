/**
 * Awais Arshad - Portfolio Interactions & Dynamic Effects (Multi-Page Architecture)
 */

document.addEventListener('DOMContentLoaded', () => {
  initNeuralCanvas();
  initTypingEffect();
  initNavbarScroll();
  highlightCurrentPageNav();
  initSkillsFilter();
  initVideoDemoPlayers();
  initProjectModals();
  initCopyActions();
  initContactForm();
  initMobileNav();
});

/* ==========================================================================
   1. Dynamic Active Nav Link Detection
   ========================================================================== */
function highlightCurrentPageNav() {
  const path = window.location.pathname;
  const pageName = path.split('/').pop() || 'index.html';
  const navItems = document.querySelectorAll('.nav-item');

  navItems.forEach((item) => {
    const href = item.getAttribute('href');
    if (href === pageName || (pageName === '' && href === 'index.html')) {
      item.classList.add('active');
    } else if (pageName !== 'index.html' && href !== pageName) {
      item.classList.remove('active');
    }
  });
}

/* ==========================================================================
   2. Interactive Video Demo Players & Uploader (projects.html)
   ========================================================================== */
function initVideoDemoPlayers() {
  const fileInputs = document.querySelectorAll('.video-file-input');
  if (fileInputs.length === 0) return;

  fileInputs.forEach((input) => {
    const target = input.getAttribute('data-target');
    const video = document.getElementById(`video-${target}`);
    const placeholder = document.getElementById(`placeholder-${target}`);
    const status = document.getElementById(`status-${target}`);
    const dropzone = document.getElementById(`dropzone-${target}`);

    if (!video) return;

    function handleVideoFile(file) {
      if (!file || !file.type.startsWith('video/')) {
        showToast('Please select a valid video file (MP4, WebM, etc.).');
        return;
      }

      const videoUrl = URL.createObjectURL(file);
      video.src = videoUrl;
      video.load();

      if (placeholder) {
        placeholder.classList.add('hidden');
      }

      if (status) {
        const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
        status.innerHTML = `<span>🟢 Active Demo: <strong>${escapeHtml(file.name)}</strong> (${sizeMb} MB)</span>`;
      }

      video.play().catch(() => {
        // Autoplay may require user gesture on some browsers
      });

      showToast(`Loaded "${file.name}" into ${target.toUpperCase()} demo player!`);
    }

    // Input file change
    input.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) handleVideoFile(file);
    });

    // Clicking placeholder opens file picker
    if (placeholder) {
      placeholder.addEventListener('click', () => {
        input.click();
      });
    }

    // Drag & Drop handling
    if (dropzone) {
      ['dragenter', 'dragover'].forEach((eventName) => {
        dropzone.addEventListener(eventName, (e) => {
          e.preventDefault();
          e.stopPropagation();
          dropzone.classList.add('dragover');
        });
      });

      ['dragleave', 'drop'].forEach((eventName) => {
        dropzone.addEventListener(eventName, (e) => {
          e.preventDefault();
          e.stopPropagation();
          dropzone.classList.remove('dragover');
        });
      });

      dropzone.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        const file = dt.files[0];
        if (file) handleVideoFile(file);
      });
    }
  });
}

function escapeHtml(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}

/* ==========================================================================
   3. Interactive Neural Constellation Background Canvas
   ========================================================================== */
function initNeuralCanvas() {
  const canvas = document.getElementById('neural-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  let mouse = { x: null, y: null, radius: 140 };

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    createNodes();
  });

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Create node particles
  let nodes = [];

  class Node {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.7;
      this.vy = (Math.random() - 0.5) * 0.7;
      this.radius = Math.random() * 2 + 1.2;
      this.baseColor = Math.random() > 0.4 ? 'rgba(0, 242, 254, ' : 'rgba(157, 78, 221, ';
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse collision / repulsion
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 2.5;
          this.y -= (dy / dist) * force * 2.5;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.baseColor + '0.75)';
      ctx.fill();
    }
  }

  function createNodes() {
    nodes = [];
    const count = Math.min(Math.floor((width * height) / 16000), 75);
    for (let i = 0; i < count; i++) {
      nodes.push(new Node());
    }
  }

  createNodes();

  let animFrameId;
  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Draw connecting lines
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 130) {
          const opacity = (1 - dist / 130) * 0.25;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0, 242, 254, ${opacity})`;
          ctx.lineWidth = 0.9;
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw nodes
    nodes.forEach((n) => {
      n.update();
      n.draw();
    });

    animFrameId = requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   4. Terminal Typing Effect
   ========================================================================== */
function initTypingEffect() {
  const target = document.getElementById('typed-roles');
  if (!target) return;

  const roles = [
    'AI Researcher & Data Scientist',
    'Federated Learning & NLP Researcher',
    'Agentic AI & Multi-Agent Architect',
    'Multimodal AI Specialist (FYP Lead)',
    'NUCES-FAST Data Science Graduate'
  ];

  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let typingSpeed = 85;

  function type() {
    const current = roles[roleIdx];

    if (isDeleting) {
      target.textContent = current.substring(0, charIdx - 1);
      charIdx--;
      typingSpeed = 40;
    } else {
      target.textContent = current.substring(0, charIdx + 1);
      charIdx++;
      typingSpeed = 90;
    }

    if (!isDeleting && charIdx === current.length) {
      isDeleting = true;
      typingSpeed = 2200; // Pause at end of phrase
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      typingSpeed = 400; // Pause before typing next
    }

    setTimeout(type, typingSpeed);
  }

  setTimeout(type, 1000);
}

/* ==========================================================================
   5. Navbar Background on Scroll
   ========================================================================== */
function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

/* ==========================================================================
   6. Interactive Skills Filtering
   ========================================================================== */
function initSkillsFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const skillCards = document.querySelectorAll('.skill-card');
  if (filterBtns.length === 0) return;

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });

      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const category = btn.getAttribute('data-category');

      skillCards.forEach((card) => {
        const cardCat = card.getAttribute('data-category');
        if (category === 'all' || cardCat === category) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });
}

/* ==========================================================================
   7. Interactive Project Modals (Optional Quick View)
   ========================================================================== */
function initProjectModals() {
  const modal = document.getElementById('project-modal');
  const closeBtn = document.getElementById('modal-close-btn');
  const slot = document.getElementById('modal-content-slot');
  if (!modal || !slot) return;

  function closeModal() {
    modal.close();
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    const rect = modal.getBoundingClientRect();
    const isInDialog =
      rect.top <= e.clientY &&
      e.clientY <= rect.top + rect.height &&
      rect.left <= e.clientX &&
      e.clientX <= rect.left + rect.width;
    if (!isInDialog) {
      closeModal();
    }
  });

  modal.addEventListener('cancel', () => {
    document.body.style.overflow = '';
  });
}

/* ==========================================================================
   8. Copy to Clipboard Utility
   ========================================================================== */
function initCopyActions() {
  const copyBtns = document.querySelectorAll('.btn-copy');
  const toast = document.getElementById('toast');
  if (copyBtns.length === 0) return;

  copyBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-copy');
      if (!textToCopy) return;

      navigator.clipboard.writeText(textToCopy).then(() => {
        showToast(`Copied "${textToCopy}" to clipboard!`);
        btn.textContent = 'Copied!';
        setTimeout(() => {
          btn.textContent = 'Copy';
        }, 2000);
      });
    });
  });
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2800);
}

/* ==========================================================================
   9. Contact Form Handling
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const subject = document.getElementById('contact-subject').value.trim();
    const message = document.getElementById('contact-message').value.trim();

    const mailtoUrl = `mailto:awaisarshad3839@gmail.com?subject=${encodeURIComponent(
      `[Portfolio/Research Inquiry] ${subject} - ${name}`
    )}&body=${encodeURIComponent(
      `From: ${name} (${email})\n\nMessage:\n${message}\n`
    )}`;

    window.location.href = mailtoUrl;
  });
}

/* ==========================================================================
   10. Mobile Navigation Toggle
   ========================================================================== */
function initMobileNav() {
  const toggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (!toggle || !navMenu) return;

  toggle.addEventListener('click', () => {
    navMenu.classList.toggle('open');
  });

  navMenu.querySelectorAll('.nav-item').forEach((item) => {
    item.addEventListener('click', () => {
      navMenu.classList.remove('open');
    });
  });
}
