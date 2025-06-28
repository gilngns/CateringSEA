document.addEventListener('DOMContentLoaded', async () => {
    try {
      const res = await fetch('http://localhost:3000/api/meal-plans');
      const json = await res.json();
  
      const mealPlans = Array.isArray(json) ? json : (json.data || []);
  
      const container = document.getElementById('meal-card');
      if (!container) return;
  
      container.innerHTML = '';
  
      for (let i = 0; i < mealPlans.length; i += 3) {
        const row = document.createElement('div');
        row.className = 'row g-4 mb-4';
  
        const rowPlans = mealPlans.slice(i, i + 3);
  
        rowPlans.forEach((plan, index) => {
          const col = document.createElement('div');
          col.className = 'col-md-4';
          col.setAttribute('data-aos', 'zoom-in');
          col.setAttribute('data-aos-delay', `${100 * (index + 1)}`);
  
          const formattedPrice = new Intl.NumberFormat('id-ID').format(plan.price);
          const imagePath = plan.image_url
            ? `/uploads/${plan.image_url}`
            : '/img/default-meal.jpg';
  
          col.innerHTML = `
            <div class="card h-100 border-0 shadow-sm rounded-4 overflow-hidden">
              <div class="ratio ratio-4x3">
                <img 
                  src="${imagePath}" 
                  alt="${plan.name}" 
                  class="img-fluid object-fit-cover w-100 h-100" 
                  onerror="this.onerror=null;this.src='/img/default-meal.jpg';">
              </div>
              <div class="card-body d-flex flex-column text-start">
                <h5 class="card-title fw-semibold text-dark">${plan.name}</h5>
                <p class="card-text small text-muted flex-grow-1">${plan.description}</p>
                <div class="mt-3 d-flex justify-content-between align-items-center">
                  <span class="badge text-bg-warning">Rp${formattedPrice} / Meal</span>
                </div>
              </div>
            </div>
          `;
  
          row.appendChild(col);
        });
  
        container.appendChild(row);
      }
    } catch (err) {
      console.error('❌ Error fetching meal plans:', err);
    }
  });
  