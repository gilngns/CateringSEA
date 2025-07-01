// =======================
// === Variabel Global ===
// =======================
let allSubscriptions = [];
let currentPage = 1;
const itemsPerPage = 5;
let currentMonth  = '';
let currentSearch = '';
let actionColumn = '';
let deleteColumn = '';
let availablePlans = [];

// ==========================
// === DOM Loaded Event ===
// ==========================
document.addEventListener('DOMContentLoaded', async () => {
  try {
    // === Total Meal Plans ===
    const res = await fetch('https://cateringsea.my.id//api/meal-plans');
    const data = await res.json();
    const totalPlansEl = document.getElementById('total-plans');
    if (totalPlansEl) {
      totalPlansEl.textContent = data.length;
    }
  } catch (err) {
    console.error('❌ Gagal mengambil data meal plans:', err);
  }

  loadMealPlansForm();  
  loadSubscriptions();
  setupMonthFilter();
  setupSearchInput();
});

// ==========================
// === Load Meal Plans ===
// ==========================
async function loadMealPlansForm() {
  const planSelect = document.getElementById('plan');
  if (!planSelect) return;

  try {
    const res = await fetch('https://cateringsea.my.id//api/meal-plans');
    const plans = await res.json();

    availablePlans = plans;

    plans.forEach(plan => {
      const option = document.createElement('option');
      option.value = plan.id;
      option.textContent = `${plan.name} (Rp.${new Intl.NumberFormat('id-ID').format(plan.price)})`;
      option.setAttribute('data-price', plan.price);
      planSelect.appendChild(option);
    });
  } catch (err) {
    console.error('❌ Gagal mengambil data plan:', err);
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Gagal memuat pilihan plan.',
    });
  }

  // === Bind event untuk update preview harga
  planSelect.addEventListener('change', updateTotalPricePreview);

  document.querySelectorAll('input[name="meal_type"]').forEach(el => {
    el.addEventListener('change', updateTotalPricePreview);
  });

  document.querySelectorAll('input[name="delivery_days"]').forEach(el => {
    el.addEventListener('change', updateTotalPricePreview);
  });

  // === Form Submission
  const form = document.getElementById('subscribeForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const selectedMeals = Array.from(document.querySelectorAll('input[name="meal_type"]:checked')).map(i => i.value);
    const selectedDays = Array.from(document.querySelectorAll('input[name="delivery_days"]:checked')).map(i => i.value);

    if (selectedMeals.length === 0 || selectedDays.length === 0) {
      return Swal.fire({
        icon: 'warning',
        title: 'Perhatian!',
        text: 'Silakan pilih minimal 1 Meal Type dan 1 Delivery Day.',
      });
    }

    const planId = planSelect.value;
    const selectedPlan = availablePlans.find(p => p.id == planId);

    if (!selectedPlan) {
      return Swal.fire({
        icon: 'error',
        title: 'Plan Tidak Ditemukan!',
        text: 'Silakan pilih meal plan yang valid.',
      });
    }

    const planPrice = parseFloat(selectedPlan.price);
    const mealCount = selectedMeals.length;
    const dayCount = selectedDays.length;
    const multiplier = 4.3;

    const totalPrice = Math.round(planPrice * mealCount * dayCount * multiplier);

    const formData = {
      phone_number: document.getElementById('phone')?.value,
      plan_id: planId,
      meal_type: selectedMeals,
      delivery_days: selectedDays,
      allergies: document.getElementById('allergies')?.value,
      total_price: totalPrice
    };

    try {
      const res = await fetch('https://cateringsea.my.id//api/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.status === 401) {
        window.location.href = data.redirect || '/login';
      } else if (res.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Subscription berhasil dibuat.',
          timer: 2500,
          showConfirmButton: false
        }).then(() => location.reload());
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Gagal!',
          text: data.error || 'Terjadi kesalahan.',
        });
      }
    } catch (err) {
      console.error('❌ Gagal submit:', err);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Terjadi kesalahan pada server.',
      });
    }
  });
}


// ============================
// === Load Subscriptions ===
// ============================
async function loadSubscriptions() {
  try {
    const res = await fetch('https://cateringsea.my.id//api/subscriptions', {
      credentials: 'include',
    });

    const contentType = res.headers.get('content-type');

    if (!res.ok) {
      const text = await res.text();
      console.error('❌ Gagal fetch:', res.status, text);
      return;
    }

    if (!contentType || !contentType.includes('application/json')) {
      const text = await res.text();
      console.error('❌ Bukan JSON:', text);
      return;
    }

    const data = await res.json();
    allSubscriptions = data;
    renderSubscriptionTable();
  } catch (err) {
    console.error('❌ Gagal load subscriptions:', err);
  }
}

// ============================
// === Render Tabel Orders ===
// ============================
function renderSubscriptionTable() {
  const tbody = document.getElementById('orders-body');
  if (!tbody) return;

  tbody.innerHTML = '';

  if (!Array.isArray(allSubscriptions) || allSubscriptions.length === 0) {
    tbody.innerHTML = '<tr><td colspan="10">Tidak ada data</td></tr>';
    return;
  }

  let filtered = [...allSubscriptions].sort((a, b) => b.id - a.id);
  const isAdmin = currentUserRole === 'ADMIN';

  if (!isAdmin || currentMonth || currentSearch) {
    if (currentMonth) {
      const [year, month] = currentMonth.split('-').map(Number);
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59, 999);

      filtered = filtered.filter(sub => {
        const subDate = new Date(new Date(sub.start_date).getTime() + 7 * 60 * 60 * 1000);
        return subDate >= startDate && subDate <= endDate;
      });
    }

    if (currentSearch) {
      filtered = filtered.filter(order => {
        const phone = order.phone_number?.toLowerCase() || '';
        const meal = order.meal_type?.toLowerCase() || '';
        const user = order.user_name?.toLowerCase() || '';
        return phone.includes(currentSearch) || meal.includes(currentSearch) || user.includes(currentSearch);
      });
    }
  }

  if (filtered.length === 0) {
    tbody.innerHTML = '<tr><td colspan="10">Tidak ada data</td></tr>';
    return;
  }

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filtered.slice(startIndex, startIndex + itemsPerPage);

  paginatedData.forEach(order => {
    const row = document.createElement('tr');
    row.setAttribute('data-id', order.id);
    if (order.end_date) row.classList.add('table-light');

    let actionColumn = '';
    let deleteColumn = '';

    actionColumn = `
    <select class="form-select form-select-sm status-select" data-id="${order.id}" ${order.status === 'END' ? 'disabled' : ''}>
      <option value="ACTIVE" ${order.status === 'ACTIVE' ? 'selected' : ''}>ACTIVE</option>
      <option value="PAUSE" ${order.status === 'PAUSE' ? 'selected' : ''}>PAUSE</option>
      <option value="CANCEL" ${order.status === 'CANCEL' ? 'selected' : ''}>CANCEL</option>
      <option value="END" ${order.status === 'END' ? 'selected' : ''}>END</option>
    </select>
    ${order.status === 'PAUSE' && currentUserRole === 'ADMIN' ? `
      <button class="btn btn-sm btn-success mt-1 resume-btn" data-id="${order.id}">Resume</button>
    ` : ''}
  `;
  
  deleteColumn = currentUserRole === 'ADMIN' ? `
    <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${order.id}">
      <i class="fa fa-trash"></i>
    </button>
  ` : '';
  

    row.innerHTML = `
      <td>${order.user_name}</td>
      <td>${order.phone_number}</td>
      <td>${parseArray(order.meal_type)}</td>
      <td>${parseArray(order.delivery_days)}</td>
      <td>${order.allergies || '-'}</td>
      <td>Rp${parseFloat(order.total_price || 0).toLocaleString('id-ID')}</td>
      <td>${actionColumn}</td>
      <td>${formatDate(order.start_date)}</td>
      <td>${formatDate(order.end_date)}</td>
      <td>${formatDate(order.pause_period_start)}</td>
      <td>${formatDate(order.pause_period_end)}</td>
      <td>${deleteColumn}</td>

    `;

    tbody.appendChild(row);
  });

  bindStatusSelect();
  if (currentUserRole === 'ADMIN') {
    bindResumeButton();
    bindEndButton();
    bindDeleteButton();
  }

  renderPaginationControls(filtered.length);
}

// ============================
// === Helper Functions ===
// ============================
function formatDate(dateStr) {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('id-ID');
}

function parseArray(field) {
  if (!field) return '-';
  try {
    const items = Array.isArray(field) ? field : field.split(',');
    return items.map(item => item.trim().charAt(0).toUpperCase() + item.trim().slice(1)).join(', ');
  } catch (err) {
    console.warn('⚠️ Gagal parsing array:', field);
    return '-';
  }
}

async function updateStatus(id, newStatus) {
  try {
    let bodyData = { status: newStatus };

    if (newStatus === 'END') {
      const today = new Date().toISOString().split('T')[0];
      bodyData.end_date = today;
    }

    const res = await fetch(`https://cateringsea.my.id//api/subscriptions/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bodyData)
    });

    if (res.ok) {
      Swal.fire('Berhasil', `Status diubah ke ${newStatus}`, 'success');

      // Untuk menghindari race condition antara END dan Resume
      setTimeout(() => loadSubscriptions(), 300);
    } else {
      Swal.fire('Gagal', 'Permintaan gagal diproses', 'error');
    }
  } catch (err) {
    console.error('❌ Error update status:', err);
    Swal.fire('Error', 'Terjadi kesalahan saat update', 'error');
  }
}


// ============================
// === Event Bindings ===
// ============================
function bindStatusSelect() {
  document.querySelectorAll('.status-select').forEach(select => {
    select.addEventListener('change', function () {
      const id = this.getAttribute('data-id');
      updateStatus(id, this.value);
    });
  });
}

function bindResumeButton() {
  document.querySelectorAll('.resume-btn').forEach(btn => {
    btn.addEventListener('click', async function () {
      const id = this.getAttribute('data-id');
      try {
        const res = await fetch(`https://cateringsea.my.id//api/subscriptions/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'ACTIVE' })
        });

        if (res.ok) {
          Swal.fire('Berhasil', 'Subscription dilanjutkan kembali', 'success');
          loadSubscriptions();
        } else {
          Swal.fire('Gagal', 'Gagal melanjutkan subscription', 'error');
        }
      } catch (err) {
        console.error('❌ Gagal resume:', err);
        Swal.fire('Error', 'Terjadi kesalahan saat resume', 'error');
      }
    });
  });
}

function bindEndButton() {
  document.querySelectorAll('.end-btn').forEach(btn => {
    btn.addEventListener('click', async function () {
      const id = this.getAttribute('data-id');
      const today = new Date().toISOString().split('T')[0];
      try {
        const res = await fetch(`https://cateringsea.my.id//api/subscriptions/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ end_date: today, status: 'END' }) 
        });

        if (res.ok) {
          Swal.fire('Berhasil', 'Subscription diakhiri', 'success');
          loadSubscriptions();
        } else {
          Swal.fire('Gagal', 'Gagal mengakhiri subscription', 'error');
        }
      } catch (err) {
        console.error('❌ Gagal end:', err);
        Swal.fire('Error', 'Terjadi kesalahan saat mengakhiri subscription', 'error');
      }
    });
  });
}

function bindDeleteButton() {
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const id = e.target.dataset.id || e.target.closest('button').dataset.id;
      if (confirm('Yakin mau hapus order ini?')) {
        try {
          const res = await fetch(`https://cateringsea.my.id//api/subscriptions/${id}`, {
            method: 'DELETE'
          });
          const result = await res.json();
          if (res.ok) {
            alert('Order berhasil dihapus!');
            await loadSubscriptions();
          } else {
            alert('Gagal menghapus order: ' + result.message);
          }
        } catch (err) {
          console.error('❌ Error saat menghapus:', err);
        }
      }
    });
  });
}

function renderPaginationControls(totalItems = allSubscriptions.length) {
  const container = document.getElementById('pagination');
  if (!container) return;

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  container.innerHTML = '';

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    btn.className = `btn btn-sm mx-1 ${i === currentPage ? 'btn-primary' : 'btn-outline-primary'}`;
    btn.addEventListener('click', () => {
      currentPage = i;
      renderSubscriptionTable();
    });
    container.appendChild(btn);
  }
}

function setupMonthFilter() {
  const monthInput = document.getElementById('monthPicker');
  if (!monthInput) return;

  const isAdmin = currentUserRole === 'ADMIN';

  if (!isAdmin) {
    const today = new Date();
    const defaultValue = today.toISOString().slice(0, 7);
    monthInput.value = defaultValue;
    currentMonth = defaultValue;
  }

  monthInput.addEventListener('change', () => {
    currentMonth = monthInput.value;
    currentPage = 1;
    renderSubscriptionTable();
  });
}

function setupSearchInput() {
  const input = document.getElementById('searchInput');
  if (input) {
    input.addEventListener('input', () => {
      currentSearch = input.value.trim().toLowerCase();
      currentPage = 1;
      renderSubscriptionTable();
    });
  }
}

function updateTotalPricePreview() {
  const planSelect = document.getElementById('plan');
  const previewDiv = document.getElementById('totalPricePreview');

  if (!planSelect || !previewDiv) return;

  if (!planSelect.value) {
    previewDiv.textContent = 'Silakan pilih meal plan terlebih dahulu.';
    return;
  }

  const selectedPlan = availablePlans.find(p => p.id == planSelect.value);

  if (!selectedPlan) {
    previewDiv.textContent = 'Plan tidak ditemukan.';
    return;
  }

  const price = parseFloat(selectedPlan.price);
  if (isNaN(price)) {
    previewDiv.textContent = 'Harga plan tidak valid.';
    return;
  }

  const selectedMeals = Array.from(document.querySelectorAll('input[name="meal_type"]:checked'));
  const selectedDays = Array.from(document.querySelectorAll('input[name="delivery_days"]:checked'));

  if (selectedMeals.length === 0 || selectedDays.length === 0) {
    previewDiv.textContent = 'Silakan pilih minimal satu meal type dan satu delivery day.';
    return;
  }

  const mealCount = selectedMeals.length;
  const dayCount = selectedDays.length;
  const multiplier = 4.3;

  const totalPrice = Math.round(price * mealCount * dayCount * multiplier);

  previewDiv.textContent = `Total harga yang harus dibayar: Rp${totalPrice.toLocaleString('id-ID')}`;
}

