document.addEventListener('DOMContentLoaded', async () => {
  try {
    const res = await fetch('http://localhost:3000/api/meal-plans');
    const mealPlans = await res.json();

    const container = document.getElementById('meal-cards');
    if (!container) return;

    mealPlans.slice(0, 3).forEach((plan, index) => {
      const card = document.createElement('div');
      card.className = 'col-md-4';
      card.setAttribute('data-aos', 'zoom-in');
      card.setAttribute('data-aos-delay', `${100 * (index + 1)}`);

      // Format harga (pakai ribuan)
      const formattedPrice = new Intl.NumberFormat('id-ID').format(plan.price);

      // Path gambar fallback
      const imagePath = plan.image_url
        ? `/uploads/${plan.image_url}`
        : '/img/default-meal.jpg';

      card.innerHTML = `
        <div class="card border-0 shadow-sm rounded-4 h-100 text-center">
          <img 
            src="${imagePath}" 
            alt="${plan.name}" 
            class="card-img-top rounded-top-4" 
            onerror="this.onerror=null;this.src='/img/default-meal.jpg';"
            style="height: 600px; object-fit: cover;"
          >
          <div class="card-body d-flex flex-column">
            <h5 class="card-title fw-bold text-dark">${plan.name}</h5>
            <div class="mt-auto">
              <a href="/menu" class="btn btn-outline-warning btn-sm mt-2">See More Detail</a>
            </div>
          </div>
        </div>
      `;

      container.appendChild(card);
    });
  } catch (err) {
    console.error('❌ Error fetching meal plans:', err);
  }
});

