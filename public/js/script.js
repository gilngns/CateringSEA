// === Navbar scroll effect ===
document.addEventListener("DOMContentLoaded", () => {
    const navbar = document.querySelector(".navbar");
  
    function handleNavbarBackground() {
      if (window.scrollY > 50) {
        navbar.classList.add("scrolled");
      } else {
        navbar.classList.remove("scrolled");
      }
    }
  
    handleNavbarBackground();
    window.addEventListener("scroll", handleNavbarBackground);
  });
  
  // === Count Animation ===
  function animateCount(id, target, duration) {
    const el = document.getElementById(id);
    let start = 0;
    const stepTime = Math.abs(Math.floor(duration / target));
    const timer = setInterval(() => {
      start += 1;
      el.textContent = start;
      if (start >= target) {
        clearInterval(timer);
      }
    }, stepTime);
  }
  
  document.addEventListener("DOMContentLoaded", function () {
    animateCount("count-experience", 15, 2000);
    animateCount("count-chefs", 50, 2000);
  });
  
  // === Menu Filtering ===
  document.addEventListener("DOMContentLoaded", function () {
    const navLinks = document.querySelectorAll("#menuTabs .nav-link");
    const menuItems = document.querySelectorAll(".menu-item");
    let currentFilter = "catering";
  
    function applyFilter(filter) {
      menuItems.forEach((item) => {
        item.style.display = item.classList.contains(filter) ? "block" : "none";
      });
  
      navLinks.forEach((link) => {
        link.classList.toggle("active", link.dataset.filter === filter);
      });
    }
  
    applyFilter(currentFilter);
  
    navLinks.forEach((link) => {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        applyFilter(this.dataset.filter);
      });
    });
  });

  document.getElementById('logoutBtn')?.addEventListener('click', async (e) => {
    e.preventDefault();
  
    try {
      const res = await fetch('https://cateringsea.my.id/api/users/logout', {
        method: 'POST',
        credentials: 'include'
      });
  
      const data = await res.json();
      if (res.ok) {
        alert('Logout berhasil!');
        window.location.href = '/login';
      } else {
        alert(data.message || 'Gagal logout');
      }
    } catch (err) {
      console.error('Logout error:', err);
    }
  });

  document.addEventListener('DOMContentLoaded', async () => {
    const authBtn = document.getElementById('authBtn');
  
    try {
      const res = await fetch('https://cateringsea.my.id/api/users/check-auth', {
        credentials: 'include'
      });
  
      if (res.ok) {
        const data = await res.json();
        authBtn.textContent = 'Logout';
        authBtn.href = '#';
        authBtn.addEventListener('click', async (e) => {
          e.preventDefault();
          await fetch('https://cateringsea.my.id/api/users/logout', {
            method: 'POST',
            credentials: 'include'
          });
          alert('Berhasil logout!');
          location.reload();
        });
      } else {
        throw new Error();
      }
    } catch (err) {
      authBtn.textContent = 'Login';
      authBtn.href = '/login';
    }
  });  

  document.addEventListener('DOMContentLoaded', () => {
    const modalElement = document.getElementById('welcomeModal');
    if (modalElement) {
      const welcomeModal = new bootstrap.Modal(modalElement);
      welcomeModal.show();
    }
  });

  const stars = document.querySelectorAll('#star-rating i');
  const ratingInput = document.getElementById('rating');

  stars.forEach((star, index) => {
    star.addEventListener('mouseenter', () => {
      stars.forEach((s, i) => {
        s.classList.toggle('bi-star-fill', i <= index);
        s.classList.toggle('bi-star', i > index);
      });
    });

    star.addEventListener('click', () => {
      ratingInput.value = index + 1;
      stars.forEach((s, i) => {
        s.classList.toggle('bi-star-fill', i <= index);
        s.classList.toggle('bi-star', i > index);
      });
    });

    star.addEventListener('mouseleave', () => {
      const currentRating = parseInt(ratingInput.value);
      stars.forEach((s, i) => {
        s.classList.toggle('bi-star-fill', i < currentRating);
        s.classList.toggle('bi-star', i >= currentRating);
      });
    });
  });

  // Form validation
  (() => {
    'use strict';
    const forms = document.querySelectorAll('.needs-validation');
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }
        form.classList.add('was-validated');
      }, false);
    });
  })();
