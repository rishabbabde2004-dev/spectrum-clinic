/* Spectrum Family Clinic & Diagnostic Centre - Main JS */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileMenu();
  initLightboxGallery();
  initBookingTabs();
  initAppointmentForms();
  initQueryParameters();
  initScrollReveal();
});

/* 1. Sticky Header Scroll Effect */
function initStickyHeader() {
  const header = document.querySelector('.header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Check on load
}

/* 2. Mobile Menu / Hamburger Toggle */
function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!hamburger || !navMenu) return;

  hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    
    // Animate hamburger spans to 'X'
    const spans = hamburger.querySelectorAll('span');
    if (navMenu.classList.contains('active')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 6px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -6px)';
    } else {
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
    }
  });

  // Close menu when clicking links
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      const spans = hamburger.querySelectorAll('span');
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
    });
  });
}

/* 3. Custom Lightbox Gallery with Multi-Image Navigation */
function initLightboxGallery() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightboxModal');
  
  if (!lightbox || galleryItems.length === 0) return;

  const lightboxImg = lightbox.querySelector('.lightbox-img');
  const lightboxCaption = lightbox.querySelector('.lightbox-caption');
  const closeBtn = lightbox.querySelector('.lightbox-close');
  const prevBtn = lightbox.querySelector('.lightbox-prev');
  const nextBtn = lightbox.querySelector('.lightbox-next');

  let currentIndex = 0;

  // Gather all image details
  const images = Array.from(galleryItems).map(item => {
    const img = item.querySelector('img');
    return {
      src: img.src,
      alt: img.alt || 'Clinic Photo'
    };
  });

  const showImage = (index) => {
    if (index < 0) index = images.length - 1;
    if (index >= images.length) index = 0;
    currentIndex = index;
    
    lightboxImg.src = images[currentIndex].src;
    lightboxCaption.textContent = images[currentIndex].alt;
  };

  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      lightbox.style.display = 'flex';
      showImage(index);
      document.body.style.overflow = 'hidden'; // Lock scroll
    });
  });

  const closeLightbox = () => {
    lightbox.style.display = 'none';
    document.body.style.overflow = ''; // Unlock scroll
  };

  closeBtn.addEventListener('click', closeLightbox);
  
  // Click outside to close
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.classList.contains('lightbox-content')) {
      closeLightbox();
    }
  });

  prevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    showImage(currentIndex - 1);
  });

  nextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    showImage(currentIndex + 1);
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (lightbox.style.display === 'flex') {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
      if (e.key === 'ArrowRight') showImage(currentIndex + 1);
    }
  });
}

/* 4. Booking Tabs Interaction */
function initBookingTabs() {
  const tabs = document.querySelectorAll('.booking-tab-btn');
  const forms = document.querySelectorAll('.booking-form-box');

  if (tabs.length === 0) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetType = tab.getAttribute('data-tab');

      // Update active tab button
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // Update active form block
      forms.forEach(form => {
        if (form.getAttribute('id') === `form-${targetType}`) {
          form.classList.add('active');
        } else {
          form.classList.remove('active');
        }
      });
    });
  });
}

/* 5. Appointment Forms and WhatsApp Pre-Filled Generator */
function initAppointmentForms() {
  const forms = document.querySelectorAll('.appointment-form');
  const modal = document.getElementById('confirmationModal');
  
  if (forms.length === 0 || !modal) return;

  const confirmProceed = modal.querySelector('#confirmProceed');
  const confirmCancel = modal.querySelector('#confirmCancel');
  let currentWhatsAppUrl = '';

  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Collect field values
      const name = form.querySelector('[name="name"]').value.trim();
      const phone = form.querySelector('[name="phone"]').value.trim();
      const date = form.querySelector('[name="date"]').value;
      const message = form.querySelector('[name="message"]').value.trim();
      
      const formId = form.getAttribute('id');
      let typeText = '';
      let detailText = '';

      if (formId === 'form-doctor') {
        typeText = 'Doctor Consultation';
        const docSelect = form.querySelector('[name="doctor"]');
        detailText = docSelect.options[docSelect.selectedIndex].text;
      } else if (formId === 'form-test') {
        typeText = 'Diagnostic Test Booking';
        const testSelect = form.querySelector('[name="test"]');
        detailText = testSelect.options[testSelect.selectedIndex].text;
      } else if (formId === 'form-home') {
        typeText = 'Home Sample Collection';
        const packageSelect = form.querySelector('[name="package"]');
        detailText = packageSelect.options[packageSelect.selectedIndex].text;
      }

      // Input Validation
      if (!name || !phone || !date) {
        alert('Please fill out all required fields.');
        return;
      }

      // Generate WhatsApp text
      const waMessage = 
`Hello Spectrum Family Clinic & Diagnostic Centre,
I would like to book an appointment with the following details:

- *Patient Name:* ${name}
- *Phone Number:* ${phone}
- *Appointment Type:* ${typeText}
- *Specialist/Test/Package:* ${detailText}
- *Preferred Date:* ${date}
- *Additional Message:* ${message ? message : 'None'}`;

      // Encode URL (Clinic Phone Number: 7981484949)
      const encodedMsg = encodeURIComponent(waMessage);
      currentWhatsAppUrl = `https://wa.me/917981484949?text=${encodedMsg}`;

      // Show Custom Premium Confirmation Modal
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    });
  });

  // Modal actions
  confirmProceed.addEventListener('click', () => {
    modal.style.display = 'none';
    document.body.style.overflow = '';
    
    // Redirect to WhatsApp
    window.open(currentWhatsAppUrl, '_blank');
  });

  confirmCancel.addEventListener('click', () => {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  });

  // Click modal background to close/cancel
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
      document.body.style.overflow = '';
    }
  });
}

/* 6. Query Parameters Auto-Selector */
function initQueryParameters() {
  const urlParams = new URLSearchParams(window.location.search);
  const tabParam = urlParams.get('tab');
  const docParam = urlParams.get('doc');
  const testParam = urlParams.get('test');
  const typeParam = urlParams.get('type');

  if (!tabParam && !docParam && !testParam && !typeParam) return;

  let activeTab = 'doctor';

  if (tabParam) {
    activeTab = tabParam;
  } else if (docParam) {
    activeTab = 'doctor';
    const docSelect = document.querySelector('#docSelect');
    if (docSelect) docSelect.value = docParam;
  } else if (typeParam === 'physio') {
    activeTab = 'doctor';
    const docSelect = document.querySelector('#docSelect');
    if (docSelect) docSelect.value = 'general';
  } else if (testParam) {
    const packages = ['complete', 'diabetes', 'thyroid', 'vitamin', 'womens', 'senior'];
    if (packages.includes(testParam)) {
      activeTab = 'home';
      const packageSelect = document.querySelector('#packageSelect');
      if (packageSelect) packageSelect.value = testParam;
    } else {
      activeTab = 'test';
      const testSelect = document.querySelector('#testSelect');
      if (testSelect) testSelect.value = testParam;
    }
  }

  // Programmatically click the active tab
  const tabButton = document.querySelector(`.booking-tab-btn[data-tab="${activeTab}"]`);
  if (tabButton) {
    tabButton.click();
  }
}

/* 7. Scroll Reveal Observer */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // Trigger only once
      }
    });
  }, {
    threshold: 0,
    rootMargin: '0px 0px -50px 0px'
  });

  reveals.forEach(el => observer.observe(el));
}
// ===============================
// Doctor Carousel
// ===============================

const doctorSlides = document.querySelectorAll(".doctor-slide");
const nextBtn = document.querySelector(".doctor-arrow.next");
const prevBtn = document.querySelector(".doctor-arrow.prev");

if (doctorSlides.length > 0 && nextBtn && prevBtn) {

    let current = 0;

    function showSlide(index) {

        doctorSlides.forEach(slide => {
            slide.classList.remove("active");
        });

        doctorSlides[index].classList.add("active");
    }

    nextBtn.addEventListener("click", () => {

        current++;

        if(current >= doctorSlides.length){
            current = 0;
        }

        showSlide(current);

    });

    prevBtn.addEventListener("click", () => {

        current--;

        if(current < 0){
            current = doctorSlides.length - 1;
        }

        showSlide(current);

    });

    setInterval(() => {

        current++;

        if(current >= doctorSlides.length){
            current = 0;
        }

        showSlide(current);

    }, 4000);

    showSlide(current);

}