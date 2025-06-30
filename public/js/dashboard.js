document.addEventListener('DOMContentLoaded', async () => {
  try {
    // === Total Meal Plans ===
    const res = await fetch('http://localhost:3000/api/meal-plans');
    const data = await res.json();
    setText('total-plans', data.length);
    animateCounter('total-plans');
  } catch (err) {
    console.error('❌ Gagal mengambil data meal plans:', err);
  }

// ✅ Tunggu semua elemen penting tersedia (hanya yang benar-benar ada di DOM kamu)
await Promise.all([
  waitUntilElementExists('total-income'),
  waitUntilElementExists('total-expense'),
  waitUntilElementExists('chartBars') // tambahkan ini untuk memastikan grafik siap
]);

// ✅ Delay sebentar biar DOM ready (jaga-jaga render lambat)
await new Promise(resolve => setTimeout(resolve, 100));

// ✅ Aktifkan tab "daily" (UI)
const dailyTab = document.querySelector('.nav-tabs .nav-link[data-range="daily"]');
if (dailyTab) dailyTab.classList.add('active');

// ✅ Atur teks dropdown ke "Daily" kalau ada dropdown
const dropdownToggle = document.querySelector('.dropdown-toggle');
if (dropdownToggle) dropdownToggle.textContent = 'Daily';

// ✅ Langsung panggil dashboard daily
await updateDashboardByRange('daily');


  // === Dropdown Filter Handler ===
  document.querySelectorAll('.dropdown-menu .dropdown-item').forEach(item => {
    item.addEventListener('click', async e => {
      const selectedRange = e.target.textContent.toLowerCase();
      document.querySelector('.dropdown-toggle').textContent = e.target.textContent;
      await updateDashboardByRange(selectedRange);
    });
  });

  // === Tab Filter Handler ===
  document.querySelectorAll('.nav-tabs .nav-link').forEach(link => {
    link.addEventListener('click', async e => {
      const range = e.target.getAttribute('data-range');
      if (!range) return;
      await updateDashboardByRange(range);

      // Ubah visual tab active
      document.querySelectorAll('.nav-tabs .nav-link').forEach(l => l.classList.remove('active'));
      e.target.classList.add('active');
    });
  });
});


// ========== Update Both Revenue & Orders ==========
async function updateDashboardByRange(range) {
  await loadRevenueFromFrontend(range);
  await loadOrderStatusSummary(range);
}

// ========== Utilities ==========
function waitUntilElementExists(id, timeout = 3000) {
  return new Promise((resolve, reject) => {
    const interval = 50;
    let elapsed = 0;
    const checker = setInterval(() => {
      const el = document.getElementById(id);
      if (el) {
        clearInterval(checker);
        resolve();
      } else if ((elapsed += interval) >= timeout) {
        clearInterval(checker);
        reject(`Element #${id} tidak ditemukan setelah ${timeout}ms`);
      }
    }, interval);
  });
}

function parseHarga(value) {
  if (typeof value === 'string') {
    return Math.floor(parseFloat(value)) || 0;
  }
  return typeof value === 'number' ? Math.floor(value) : 0;
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (!el) return;

  const num = parseHarga(value);
  el.textContent = '0'; // biar animasi dari nol

  // Delay sedikit biar counterUp bisa animasi
  setTimeout(() => {
    el.setAttribute('data-raw', num);
    animateCounter(id);
  }, 100);
}

function animateCounter(id) {
  const el = document.getElementById(id);
  if (!el) return;

  const raw = parseInt(el.getAttribute('data-raw')) || 0;

  console.log(`▶ Animating ${id}:`, raw);

  if (typeof counterUp === 'function') {
    counterUp(el, {
      duration: 1000,
      delay: 16,
      onComplete: () => {
        console.log(`✅ Done animating ${id}`);
        el.textContent = raw.toLocaleString('id-ID');
        if (id === 'total-revenue') formatRevenueSuffix();
      }
    });
  } else {
    console.warn('❌ counterUp not found');
    el.textContent = raw.toLocaleString('id-ID');
    if (id === 'total-revenue') formatRevenueSuffix();
  }
}


function formatRevenueSuffix() {
  const el = document.getElementById('total-revenue');
  const suffixEl = document.getElementById('revenue-suffix');
  if (!el || !suffixEl) return;

  const raw = parseInt(el.getAttribute('data-raw')) || 0;
  let suffix = '';
  if (raw >= 1_000_000_000) suffix = 'Miliar';
  else if (raw >= 1_000_000) suffix = 'Jt';
  else if (raw >= 1_000) suffix = 'Rb';

  suffixEl.textContent = suffix;
}

// ========== Load Revenue ==========
async function loadRevenueFromFrontend(range = 'daily') {
  try {
    const res = await fetch('http://localhost:3000/api/subscriptions');
    const subscriptions = await res.json();

    const now = new Date();
    const wibNow = new Date(now.getTime() + (7 * 60 * 60 * 1000)); 
    const endDate = new Date(wibNow);
    endDate.setHours(23, 59, 59, 999);

    const startDate = new Date(endDate);

    switch (range) {
      case 'daily':
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'weekly':
        startDate.setDate(startDate.getDate() - 6);
        break;
      case 'monthly':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
    }

    const filtered = subscriptions.filter(sub => {
      const localStart = new Date(new Date(sub.start_date).getTime() + 7 * 60 * 60 * 1000); // Anggap semua UTC dan konversi ke WIB
      return localStart >= startDate && localStart <= endDate;
    });

    // Logging untuk debug
    console.log("🟡 WIB Start:", startDate.toLocaleString());
    console.log("🟡 WIB End:", endDate.toLocaleString());
    console.log("🟡 Subs found:", filtered.length);

    const income = filtered
      .filter(sub => sub.status === 'ACTIVE')
      .reduce((sum, sub) => sum + parseHarga(sub.total_price), 0);

    const expense = filtered
      .filter(sub => sub.status !== 'ACTIVE')
      .reduce((sum, sub) => sum + parseHarga(sub.total_price), 0);

    const revenue = income - expense;

    setText('total-revenue', revenue);
    setText('total-income', income);
    setText('total-expense', expense);
    setText('total-orders', filtered.length);
    setText('total-clients', new Set(filtered.map(sub => sub.user_id)).size);

    ['total-revenue', 'total-income', 'total-expense', 'total-orders', 'total-clients'].forEach(animateCounter);

    // Chart data
    const grouped = {};
    filtered.forEach(sub => {
      const d = new Date(new Date(sub.start_date).getTime() + 7 * 60 * 60 * 1000);
      let key = range === 'daily'
        ? `${d.getHours().toString().padStart(2, '0')}:00`
        : range === 'weekly'
        ? d.toLocaleDateString('id-ID', { weekday: 'short' })
        : `${d.getDate()}`;

      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(sub);
    });

    const candlestickData = Object.entries(grouped).map(([key, list]) => {
      const incomeList = list.filter(s => s.status === 'ACTIVE').map(s => parseHarga(s.total_price));
      const expenseList = list.filter(s => s.status !== 'ACTIVE').map(s => parseHarga(s.total_price));
      const all = [...incomeList, ...expenseList];
      return {
        x: key,
        y: [
          expenseList[0] || 0,
          Math.max(...all, 0),
          Math.min(...all, 0),
          incomeList[incomeList.length - 1] || 0
        ]
      };
    });

    renderRevenueChart(candlestickData);
  } catch (err) {
    console.error('❌ Gagal ambil data subscriptions:', err);
  }
}

// ========== Revenue Chart ==========
let revenueChart = null;

function renderRevenueChart(data = []) {
  const chartContainer = document.querySelector('#chartBars');
  if (!chartContainer) return;

  if (revenueChart) {
    revenueChart.destroy();
    revenueChart = null;
  }

  const options = {
    series: [{ data }],
    chart: { type: 'candlestick', height: 250, toolbar: { show: false } },
    title: {
      text: 'Income vs Expense',
      align: 'left',
      style: { fontSize: '16px', fontWeight: 'bold' }
    },
    xaxis: { type: 'category' },
    yaxis: {
      tooltip: { enabled: true },
      labels: { formatter: val => `Rp ${val.toLocaleString('id-ID')}` }
    },
    tooltip: {
      y: { formatter: val => `Rp ${val.toLocaleString('id-ID')}` }
    },
    plotOptions: {
      candlestick: {
        colors: {
          upward: '#28a745',
          downward: '#dc3545'
        }
      }
    }
  };

  revenueChart = new ApexCharts(chartContainer, options);
  revenueChart.render();
}

// ========== Order Summary ==========
async function loadOrderStatusSummary(range = 'daily') {
  try {
    const res = await fetch('http://localhost:3000/api/subscriptions');
    const subscriptions = await res.json();

    const today = new Date();
    today.setHours(23, 59, 59, 999);
    const startDate = new Date(today);

    switch (range) {
      case 'daily': startDate.setHours(0, 0, 0, 0); break;
      case 'weekly': startDate.setDate(today.getDate() - 6); break;
      case 'monthly': startDate.setMonth(today.getMonth() - 1); break;
    }

    const filtered = subscriptions.filter(sub => {
      const local = new Date(new Date(sub.start_date).getTime() + 7 * 60 * 60 * 1000);
      return !isNaN(local) && local >= startDate && local <= today;
    });

    const onDelivery = filtered.filter(sub => sub.status === 'ACTIVE').length;
    const delivered = filtered.filter(sub => sub.status === 'PAUSE').length;
    const canceled = filtered.filter(sub => sub.status === 'CANCEL').length;

    setText('on-delivery', onDelivery);
    setText('delivered', delivered);
    setText('canceled', canceled);
    setText('new-orders', onDelivery);

    animateCounter('new-orders');
    ['on-delivery', 'delivered', 'canceled'].forEach(animateCounter);

    updateAllProgressBars(onDelivery, delivered, canceled);
    renderStatusDonut(onDelivery, delivered, canceled);
  } catch (err) {
    console.error('❌ Gagal mengambil data status order:', err);
  }
}

function renderStatusDonut(onDelivery, delivered, canceled) {
  const donut = document.getElementById('status-donut');
  if (donut) {
    donut.textContent = `${onDelivery},${delivered},${canceled}`;
    $(".donut").peity("donut");
  }
}

function updateProgressBar(value, total, barId, percentId, valueId) {
  const percent = total === 0 ? 0 : Math.round((value / total) * 100);
  document.getElementById(barId).style.width = `${percent}%`;
  document.getElementById(percentId).textContent = `${percent}%`;
  document.getElementById(valueId).textContent = value;
}

function updateAllProgressBars(onDelivery, delivered, canceled) {
  const total = onDelivery + delivered + canceled;
  updateProgressBar(onDelivery, total, 'on-delivery-bar', 'on-delivery-percent', 'on-delivery-value');
  updateProgressBar(delivered, total, 'delivered-bar', 'delivered-percent', 'delivered-value');
  updateProgressBar(canceled, total, 'canceled-bar', 'canceled-percent', 'canceled-value');
}
