/* ==========================================================================
   TUNCER TİCARET — ANA JAVASCRIPT DOSYASI
   Vanilla JS (kütüphane / framework yok)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initMobileNav();
  initActiveNavLink();
  initScrollReveal();
  initBackToTop();
  initStatCounters();
  initGalleryFilter();
  initLightbox();
 // initContactForm();
  initFooterYear();
});

/* --------------------------------------------------------------------------
   1. BAŞLIK — SAYFA KAYDIRILDIĞINDA ARKAPLAN EKLE
   -------------------------------------------------------------------------- */
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const toggleScrolledClass = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 40);
  };

  toggleScrolledClass();
  window.addEventListener('scroll', toggleScrolledClass, { passive: true });
}

/* --------------------------------------------------------------------------
   2. MOBİL HAMBURGER MENÜ
   -------------------------------------------------------------------------- */
function initMobileNav() {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');
  const scrim = document.querySelector('.nav-scrim');
  if (!toggle || !nav) return;

  const closeMenu = () => {
    toggle.classList.remove('is-active');
    nav.classList.remove('is-open');
    scrim?.classList.remove('is-visible');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  const openMenu = () => {
    toggle.classList.add('is-active');
    nav.classList.add('is-open');
    scrim?.classList.add('is-visible');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.contains('is-open');
    isOpen ? closeMenu() : openMenu();
  });

  scrim?.addEventListener('click', closeMenu);

  // Bir bağlantıya tıklandığında menüyü kapat (mobil kullanıcı deneyimi)
  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  // ESC tuşu ile menüyü kapat
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  // Geniş ekrana geçildiğinde menüyü sıfırla
  window.addEventListener('resize', () => {
    if (window.innerWidth > 860) closeMenu();
  });
}

/* --------------------------------------------------------------------------
   3. AKTİF SAYFA BAĞLANTISINI İŞARETLE
   -------------------------------------------------------------------------- */
function initActiveNavLink() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach((link) => {
    const linkPage = link.getAttribute('href');
    if (linkPage === currentPage) {
      link.classList.add('is-active');
    }
  });
}

/* --------------------------------------------------------------------------
   4. KAYDIRMA İLE BELİRME ANİMASYONU (SCROLL REVEAL)
   IntersectionObserver kullanılarak performanslı biçimde uygulanır
   -------------------------------------------------------------------------- */
function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal');
  if (!revealEls.length) return;

  // Hareket azaltma tercihi olan kullanıcılar için doğrudan göster
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    revealEls.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
  );

  revealEls.forEach((el) => observer.observe(el));
}

/* --------------------------------------------------------------------------
   5. YUKARI ÇIK BUTONU
   -------------------------------------------------------------------------- */
function initBackToTop() {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;

  window.addEventListener(
    'scroll',
    () => {
      btn.classList.toggle('is-visible', window.scrollY > 600);
    },
    { passive: true }
  );

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* --------------------------------------------------------------------------
   6. İSTATİSTİK SAYAÇLARI (0'DAN HEDEF DEĞERE SAYMA)
   -------------------------------------------------------------------------- */
function initStatCounters() {
  const counters = document.querySelectorAll('.stat-item .num[data-count]');
  if (!counters.length) return;

  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute('data-count'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1600;
    const startTime = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      // Yumuşak çıkış (ease-out) eğrisi
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);
      el.textContent = current + suffix;

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = target + suffix;
      }
    };

    requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((el) => observer.observe(el));
}

/* --------------------------------------------------------------------------
   7. GALERİ FİLTRELEME
   -------------------------------------------------------------------------- */
function initGalleryFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  if (!filterBtns.length || !galleryItems.length) return;

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const category = btn.getAttribute('data-filter');

      // Aktif buton stilini güncelle
      filterBtns.forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');

      // Öğeleri kategoriye göre göster / gizle
      galleryItems.forEach((item) => {
        const itemCategory = item.getAttribute('data-category');
        const shouldShow = category === 'all' || itemCategory === category;
        item.classList.toggle('hidden', !shouldShow);
      });
    });
  });
}

/* --------------------------------------------------------------------------
   8. GALERİ LIGHTBOX (BÜYÜTÜLMÜŞ GÖRÜNÜM)
   -------------------------------------------------------------------------- */
function initLightbox() {
  const lightbox = document.querySelector('#galleryLightbox');
  const lightboxMedia = lightbox?.querySelector('.lightbox-media');
  const closeBtn = lightbox?.querySelector('.lightbox-close');
  const galleryMedia = document.querySelectorAll('.gallery-media');

  if (!lightbox || !lightboxMedia || !galleryMedia.length) return;

  const openLightbox = (media) => {
    lightboxMedia.innerHTML = '';

    if (media.tagName === 'IMG') {
      const image = document.createElement('img');

      image.src = media.currentSrc || media.src;
      image.alt = media.alt || 'Galeri görseli';
      image.className = 'lightbox-image';

      lightboxMedia.appendChild(image);
    }

    if (media.tagName === 'VIDEO') {
      const source = media.currentSrc || media.querySelector('source')?.src;

      if (!source) return;

      const video = document.createElement('video');

      video.src = source;
      video.className = 'lightbox-video';
video.controls = false;
video.autoplay = true;
video.loop = true;
video.playsInline = true;
video.defaultMuted = true;
video.muted = true;
video.volume = 0;

      lightboxMedia.appendChild(video);
    }

    lightbox.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    const video = lightboxMedia.querySelector('video');

    if (video) {
      video.pause();
      video.removeAttribute('src');
      video.load();
    }

    lightbox.classList.remove('is-open');
    lightboxMedia.innerHTML = '';
    document.body.style.overflow = '';
  };

  galleryMedia.forEach((media) => {
    media.addEventListener('click', (event) => {
      event.stopPropagation();
      openLightbox(media);
    });
  });

  closeBtn?.addEventListener('click', closeLightbox);

  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && lightbox.classList.contains('is-open')) {
      closeLightbox();
    }
  });
}

/* --------------------------------------------------------------------------
   9. İLETİŞİM FORMU DOĞRULAMA
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.querySelector('.contact-form');
  if (!form) return;

  const successMsg = form.querySelector('.form-success');

  const validators = {
    name: (value) => value.trim().length >= 2,
    email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()),
    phone: (value) => value.trim() === '' || /^[0-9\s()+-]{7,}$/.test(value.trim()),
    subject: (value) => value.trim().length > 0,
    message: (value) => value.trim().length >= 10,
  };

  const showError = (field, hasError) => {
    const group = field.closest('.form-group');
    if (!group) return;
    group.classList.toggle('has-error', hasError);
  };

  // Kullanıcı yazarken anlık doğrulama (alan odaktan çıktığında)
  form.querySelectorAll('input, textarea, select').forEach((field) => {
    field.addEventListener('blur', () => {
      const validator = validators[field.name];
      if (validator) {
        showError(field, !validator(field.value));
      }
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    form.querySelectorAll('input, textarea, select').forEach((field) => {
      const validator = validators[field.name];
      if (validator) {
        const fieldValid = validator(field.value);
        showError(field, !fieldValid);
        if (!fieldValid) isValid = false;
      }
    });

    if (!isValid) {
      // Doğrulama başarısız — ilk hatalı alana odaklan
      const firstError = form.querySelector('.has-error input, .has-error textarea, .has-error select');
      firstError?.focus();
      return;
    }

    // NOT: Bu bir demo formudur. Gerçek gönderim için bir backend
    // servisi (örn. Formspree, kendi API'niz vb.) entegre edilmelidir.
    if (successMsg) {
      successMsg.classList.add('is-visible');
    }
    form.reset();

    // Başarı mesajını bir süre sonra otomatik gizle
    setTimeout(() => {
      successMsg?.classList.remove('is-visible');
    }, 6000);
  });
}

/* --------------------------------------------------------------------------
   10. FOOTER — GÜNCEL YILI OTOMATİK YAZDIR
   -------------------------------------------------------------------------- */
function initFooterYear() {
  const yearEl = document.querySelector('#current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}



document.querySelectorAll(".gallery-media").forEach(item => {

    item.addEventListener("click", () => {

        lightbox.classList.add("is-open");

        if(item.tagName === "IMG"){

            lightboxInner.innerHTML = `
                <button class="lightbox-close">&times;</button>
                <img src="${item.src}" class="lightbox-image">
            `;

        }else{

            const src = item.querySelector("source").src;

            lightboxInner.innerHTML = `
                <button class="lightbox-close">&times;</button>
                <video class="lightbox-video" controls autoplay>
                    <source src="${src}" type="video/mp4">
                </video>
            `;
        }

        lightboxInner.querySelector(".lightbox-close").onclick=()=>{
            lightbox.classList.remove("is-open");
        };

    });

});

lightbox.addEventListener("click",(e)=>{
    if(e.target===lightbox){
        lightbox.classList.remove("is-open");
    }
});