let swiperInstance = null;

document.addEventListener('DOMContentLoaded', () => {
  const testimonialWrapper = document.querySelector('.swiper-wrapper');
  const testimonialForm = document.querySelector('#testimonialModal form');
  const ratingInput = document.getElementById('rating');
  const reviewInput = document.getElementById('review');
  const starRating = document.getElementById('star-rating');

  init();

  function init() {
    loadTestimonials();
    setupFormSubmission();
    setupInteractiveStars();
  }

  // Ambil & tampilkan data testimonial
  async function loadTestimonials() {
    try {
      const res = await fetch('https://cateringsea.my.id//api/testimonials');
      const data = await res.json();
  
      testimonialWrapper.innerHTML = '';
  
      data.forEach((item, index) => {
        const slide = document.createElement('div');
        slide.className = 'swiper-slide';
        slide.innerHTML = `
          <div class="card border-0 shadow-sm h-100 p-4 rounded-4 bg-white" data-aos="zoom-in" data-aos-delay="${300 + index * 100}">
            <div class="d-flex align-items-center mb-3">
              <i class="bi bi-person-circle fs-1 text-warning me-3"></i>
              <div>
                <h6 class="mb-0">${item.name || 'Anonymous'}</h6>
                <div class="text-warning small">${renderStars(item.rating)}</div>
              </div>
            </div>
            <p class="card-text">"${item.review}"</p>
          </div>
        `;
        testimonialWrapper.appendChild(slide);
      });
  
      // Inisialisasi ulang Swiper setelah isi diubah
      initSwiper(data.length > 1);
    } catch (err) {
      console.error('❌ Gagal mengambil testimonial:', err);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Gagal mengambil data testimonial.',
      });
    }
  }

  // Inisialisasi Swiper
  function initSwiper(loop = true) {
    if (swiperInstance) {
      swiperInstance.destroy(true, true);
    }
  
    swiperInstance = new Swiper('.swiper', {
      loop,
      grabCursor: true,
      spaceBetween: 24,
      centeredSlides: false,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      breakpoints: {
        0: {
          slidesPerView: 1,
        },
        768: {
          slidesPerView: 2,
        },
        992: {
          slidesPerView: 3,
        },
      },
    });
  }
  
  
  // Render bintang berdasarkan rating
  function renderStars(rating) {
    return Array.from({ length: 5 }, (_, i) =>
      `<i class="bi ${i < rating ? 'bi-star-fill' : 'bi-star'}"></i>`
    ).join('');
  }

  // Kirim testimonial
  function setupFormSubmission() {
    testimonialForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      if (!this.checkValidity()) {
        this.classList.add('was-validated');
        return;
      }

      const rating = parseInt(ratingInput.value) || 0;
      const review = reviewInput.value.trim();

      if (rating < 1 || rating > 5) {
        return showAlert('warning', 'Rating tidak valid', 'Beri nilai antara 1–5 bintang.');
      }

      if (!review) {
        return showAlert('warning', 'Isi kosong', 'Tulis pengalaman kamu terlebih dahulu.');
      }

      try {
        const res = await fetch('https://cateringsea.my.id//api/testimonials', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ rating, review })
        });

        if (!res.ok) throw new Error();

        resetForm();
        hideModal('testimonialModal');
        showAlert('success', 'Terima kasih!', 'Testimonial berhasil dikirim.', 2000);
        loadTestimonials();
      } catch (err) {
        console.error('❌ Kirim gagal:', err);
        showAlert('error', 'Oops...', 'Gagal mengirim testimonial. Coba lagi nanti.');
      }
    });
  }

  // Reset form setelah submit
  function resetForm() {
    testimonialForm.reset();
    testimonialForm.classList.remove('was-validated');
    ratingInput.value = 0;
    updateStarUI(0);
  }

  // Bikin bintang bisa di-klik
  function setupInteractiveStars() {
    if (!starRating) return;

    starRating.querySelectorAll('i').forEach(star => {
      star.addEventListener('click', () => {
        const value = parseInt(star.dataset.value);
        ratingInput.value = value;
        updateStarUI(value);
      });
    });
  }

  // Update tampilan bintang interaktif
  function updateStarUI(value) {
    starRating.querySelectorAll('i').forEach((star, index) => {
      star.classList.toggle('bi-star-fill', index < value);
      star.classList.toggle('bi-star', index >= value);
    });
  }

  // Swal reusable
  function showAlert(icon, title, text, timer = 0) {
    Swal.fire({
      icon,
      title,
      text,
      timer: timer || undefined,
      showConfirmButton: !timer
    });
  }

  // Modal helper
  function hideModal(modalId) {
    const modalEl = document.getElementById(modalId);
    const modal = bootstrap.Modal.getInstance(modalEl);
    if (modal) modal.hide();
  }
});
