/**
 * Personal Portfolio — Interactive Script
 * Pure Vanilla JavaScript: Theme Switcher, Mobile Navigation, Scrollspy, & Clipboard Helper
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. Theme Management (Light / Dark Mode)
  // ==========================================
  const themeToggleBtn = document.getElementById('theme-toggle');
  const htmlElement = document.documentElement;

  // Function to get system preferred theme
  const getSystemTheme = () => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  // Function to apply theme
  const applyTheme = (theme, save = true) => {
    htmlElement.setAttribute('data-theme', theme);
    if (save) {
      localStorage.setItem('site-theme', theme);
    }
    
    // Update theme-toggle aria label
    if (themeToggleBtn) {
      themeToggleBtn.setAttribute(
        'aria-label',
        theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'
      );
    }
  };

  // Initial theme initialization
  const storedTheme = localStorage.getItem('site-theme');
  if (storedTheme) {
    applyTheme(storedTheme, false);
  } else {
    applyTheme(getSystemTheme(), false);
  }

  // Toggle button click handler
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlElement.getAttribute('data-theme') || getSystemTheme();
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme, true);
    });
  }

  // Listen to OS theme changes if user hasn't set a manual preference
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('site-theme')) {
      applyTheme(e.matches ? 'dark' : 'light', false);
    }
  });

  // Optional keyboard shortcut: Press 't' to toggle theme (when not in an input)
  document.addEventListener('keydown', (e) => {
    if (
      (e.key === 't' || e.key === 'T') &&
      !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName) &&
      !e.ctrlKey &&
      !e.metaKey &&
      !e.altKey
    ) {
      const currentTheme = htmlElement.getAttribute('data-theme') || getSystemTheme();
      applyTheme(currentTheme === 'dark' ? 'light' : 'dark', true);
    }
  });


  // ==========================================
  // 2. Mobile Navigation Drawer
  // ==========================================
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  const toggleMobileMenu = (isOpen) => {
    const shouldOpen = typeof isOpen === 'boolean' ? isOpen : !mobileMenu.classList.contains('open');
    
    if (shouldOpen) {
      mobileMenu.classList.add('open');
      mobileMenuToggle.setAttribute('aria-expanded', 'true');
      mobileMenu.setAttribute('aria-hidden', 'false');
    } else {
      mobileMenu.classList.remove('open');
      mobileMenuToggle.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
    }
  };

  if (mobileMenuToggle && mobileMenu) {
    mobileMenuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMobileMenu();
    });

    // Close menu when clicking any mobile link
    mobileNavLinks.forEach((link) => {
      link.addEventListener('click', () => {
        toggleMobileMenu(false);
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (
        mobileMenu.classList.contains('open') &&
        !mobileMenu.contains(e.target) &&
        !mobileMenuToggle.contains(e.target)
      ) {
        toggleMobileMenu(false);
      }
    });

    // Close menu on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
        toggleMobileMenu(false);
        mobileMenuToggle.focus();
      }
    });
  }


  // ==========================================
  // 3. Scrollspy Navigation (Active Nav Link)
  // ==========================================
  const sections = document.querySelectorAll('section[id]');
  const desktopNavLinks = document.querySelectorAll('.desktop-nav .nav-link');

  if ('IntersectionObserver' in window && sections.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute('id');
          desktopNavLinks.forEach((link) => {
            const href = link.getAttribute('href');
            if (href === `#${currentId}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach((section) => {
      sectionObserver.observe(section);
    });
  }


  // ==========================================
  // 4. Copy Email to Clipboard Helper
  // ==========================================
  const copyEmailBtn = document.getElementById('copy-email-btn');
  const copyTooltip = document.getElementById('copy-tooltip');

  if (copyEmailBtn && copyTooltip) {
    copyEmailBtn.addEventListener('click', async () => {
      const email = copyEmailBtn.getAttribute('data-email');
      if (!email) return;

      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(email);
        } else {
          // Fallback method for non-HTTPS or older environments
          const textArea = document.createElement('textarea');
          textArea.value = email;
          textArea.style.position = 'fixed';
          textArea.style.left = '-999999px';
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          document.execCommand('copy');
          textArea.remove();
        }

        // Show feedback in tooltip
        const originalText = copyTooltip.textContent;
        copyTooltip.textContent = 'Copied!';
        copyTooltip.classList.add('show');

        setTimeout(() => {
          copyTooltip.textContent = originalText;
          copyTooltip.classList.remove('show');
        }, 2000);
      } catch (err) {
        console.error('Failed to copy email address:', err);
      }
    });
  }
});
