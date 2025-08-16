function init() {
  // تعريف المتغيرات الأساسية
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-menu a');
  const header = document.querySelector('.header');
  const contactForm = document.getElementById('contactForm');

  if (!contactForm) return; // حماية لو الفورم مش موجود

  const submitBtn = contactForm.querySelector('.submit-btn');
  let lastScrollY = window.scrollY;

  // تخزين العناصر التي تحتاج لمراقبتها للأنيميشن
  const serviceCards = document.querySelectorAll('.service-card');

  // Toggle mobile menu
  mobileMenuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    mobileMenuToggle.classList.toggle('active');
    const isExpanded = navMenu.classList.contains('active');
    mobileMenuToggle.setAttribute('aria-expanded', isExpanded);
  });

  // Close mobile menu when clicking on nav links
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      mobileMenuToggle.classList.remove('active');
      mobileMenuToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Close mobile menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.navbar')) {
      navMenu.classList.remove('active');
      mobileMenuToggle.classList.remove('active');
      mobileMenuToggle.setAttribute('aria-expanded', 'false');
    }
  });

  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        const headerHeight = header ? header.offsetHeight : 0;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // Header scroll effects
  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > 100) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    if (currentScrollY > lastScrollY && currentScrollY > 200) {
      header.style.transform = 'translateY(-100%)';
    } else {
      header.style.transform = 'translateY(0)';
    }

    lastScrollY = currentScrollY;
  });

  // Intersection Observer for animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');

        if (entry.target.classList.contains('service-card')) {
          const cardIndex = Array.from(serviceCards).indexOf(entry.target);
          entry.target.style.animationDelay = `${cardIndex * 0.1}s`;
        }
      }
    });
  }, observerOptions);

  // العناصر التي سيتم مراقبتها للأنيميشن
  const elementsToAnimate = [
    '.service-card',
    '.contact-item',
    '.stat-item',
    '.testimonial-card',
    '.about-text',
    '.working-hours'
  ];

  elementsToAnimate.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => observer.observe(el));
  });

  // Parallax effect for hero section
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.hero-pattern, .hero-decoration');

    parallaxElements.forEach(element => {
      const speed = element.classList.contains('hero-pattern') ? 0.5 : 0.3;
      element.style.transform = `translateY(${scrolled * speed}px)`;
    });
  });

  // Validators for form fields
  const validators = {
    name: (value) => {
      if (!value.trim()) return 'الرجاء إدخال الاسم';
      if (value.trim().length < 2) return 'الاسم يجب أن يكون أكثر من حرفين';
      return null;
    },
    email: (value) => {
      if (!value.trim()) return 'الرجاء إدخال البريد الإلكتروني';
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) return 'الرجاء إدخال بريد إلكتروني صحيح';
      return null;
    },
    phone: (value) => {
      if (!value || !value.trim()) {
        return 'الرجاء إدخال رقم الجوال';
      }
      return null; // بدون تحقق صيغة رقمي معتمد كما طلبت
    },
    message: (value) => {
      if (!value.trim()) return 'الرجاء كتابة الرسالة';
      if (value.trim().length < 1) return 'الرسالة يجب أن تكون أكثر من 1 أحرف';
      return null;
    }
  };

  // Real-time validation events
  Object.keys(validators).forEach(fieldName => {
    const field = contactForm.querySelector(`[name="${fieldName}"]`);
    if (field) {
      field.addEventListener('blur', () => validateField(fieldName));
      field.addEventListener('input', () => clearFieldError(fieldName));
    }
  });

  function validateField(fieldName) {
    const field = contactForm.querySelector(`[name="${fieldName}"]`);
    if (!field) return true;
    const formGroup = field.closest('.form-group');
    if (!formGroup) return true;
    const errorElement = formGroup.querySelector('.error-message');
    const validator = validators[fieldName];

    if (validator) {
      const error = validator(field.value);
      if (error) {
        formGroup.classList.add('error');
        if (errorElement) errorElement.textContent = error;
        return false;
      } else {
        formGroup.classList.remove('error');
        if (errorElement) errorElement.textContent = '';
        return true;
      }
    }
    return true;
  }

  function clearFieldError(fieldName) {
    const field = contactForm.querySelector(`[name="${fieldName}"]`);
    if (!field) return;
    const formGroup = field.closest('.form-group');
    if (formGroup) formGroup.classList.remove('error');
  }

  function validateForm() {
    let isValid = true;
    Object.keys(validators).forEach(fieldName => {
      if (!validateField(fieldName)) isValid = false;
    });
    return isValid;
  }

  // Form submission handler
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    try {
      const formData = new FormData(contactForm);
      

      const scriptURL = "https://script.google.com/macros/s/AKfycbwv01MBK2FKRj6xwwSreQyYxZ5W0fqf4W6_5seZftM_LNJ7N85IVebHZw-c_nxPj35kdA/exec";

      const response = await fetch(scriptURL, {
        method: "POST",
        body: formData,
      });

      

      if (!response.ok) throw new Error("فشل الاتصال بالخادم");

      const result = await response.text();
    //   console.log("تم الإرسال بنجاح ✅:", result);
      showSuccessMessage();
      contactForm.reset();

    } catch (error) {
      console.error("❌ خطأ في الإرسال:", error);
        showErrorMessage();
    } finally {
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
    }
  });

  // Notification helper
  function createNotification(text, type) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <span class="notification-icon">${type === 'success' ? '✅' : '❌'}</span>
        <span class="notification-text">${text}</span>
        <button class="notification-close" aria-label="إغلاق التنبيه">&times;</button>
      </div>
    `;

    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => notification.remove());

    notification.style.cssText = `
      position: fixed;
      top: 100px;
      right: 20px;
      z-index: 10000;
      max-width: 400px;
      background: ${type === 'success' ? '#48bb78' : '#f56565'};
      color: white;
      padding: 1rem;
      border-radius: 12px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.2);
      animation: slideInRight 0.3s ease;
      font-family: 'Tajawal', Arial, sans-serif;
      direction: rtl;
    `;

    return notification;
  }

  function showSuccessMessage() {
    const message = createNotification('تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.', 'success');
    document.body.appendChild(message);
    setTimeout(() => message.remove(), 5000);
  }

  function showErrorMessage() {
    const message = createNotification('حدث خطأ أثناء إرسال الرسالة. الرجاء المحاولة مرة أخرى.', 'error');
    document.body.appendChild(message);
    setTimeout(() => message.remove(), 5000);
  }

  // Keyboard navigation enhancement: close mobile menu on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
      navMenu.classList.remove('active');
      mobileMenuToggle.classList.remove('active');
      mobileMenuToggle.setAttribute('aria-expanded', 'false');
    }
  });

  // Social media tracking (optional)
  document.querySelectorAll('.social-link').forEach(link => {
    link.addEventListener('click', (e) => {
      const platform = e.currentTarget.classList.contains('whatsapp') ? 'WhatsApp' :
        e.currentTarget.classList.contains('twitter') ? 'Twitter' :
          e.currentTarget.classList.contains('linkedin') ? 'LinkedIn' :
            e.currentTarget.classList.contains('instagram') ? 'Instagram' : 'Unknown';

      console.log(`Social media click: ${platform}`);
    });
  });

  // Lazy load images
  function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          observer.unobserve(img);
        }
      });
    });

    images.forEach(img => imageObserver.observe(img));
  }

  lazyLoadImages();

  // Initialize aria-expanded attribute for mobile menu toggle
  mobileMenuToggle.setAttribute('aria-expanded', 'false');

}

// Styles for notification animation (يُحقن تلقائياً)
const notificationStyles = `
@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
.notification-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.notification-icon {
  font-size: 1.2rem;
}
.notification-text {
  flex: 1;
  font-size: 0.9rem;
  line-height: 1.4;
}
.notification-close {
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  margin-left: 0.5rem;
  opacity: 0.8;
  transition: opacity 0.3s ease;
}
.notification-close:hover {
  opacity: 1;
}
`;
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);

// تشغيل كل شيء عند تحميل الـ DOM
document.addEventListener('DOMContentLoaded', init);
