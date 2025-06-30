// === Variabel Global ===
let allMealPlans = [];
let currentPage = 1;
const itemsPerPage = 3;

// === DOM Loaded ===
document.addEventListener('DOMContentLoaded', () => {
  loadMealPlans();
  setupAddForm();
  setupEditForm();
});

// === Load Data dari API dan Render Tabel + Pagination ===
async function loadMealPlans() {
  try {
    const res = await fetch('http://localhost:3000/api/meal-plans');
    allMealPlans = await res.json();

    const totalPages = Math.ceil(allMealPlans.length / itemsPerPage);
    if (currentPage > totalPages) {
      currentPage = totalPages || 1;
    }

    renderTable();
    renderPagination();
  } catch (err) {
    console.error('❌ Gagal load meal plans:', err);
  }
}

// === Render Tabel Meal Plans ===
function renderTable() {
  const tbody = document.getElementById('mealTableBody');
  if (!tbody) {
    console.warn('⚠️ Element #mealTableBody tidak ditemukan.');
    return;
  }

  tbody.innerHTML = '';

  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const pageItems = allMealPlans.slice(start, end);

  pageItems.forEach((meal, i) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${start + i + 1}</td>
      <td>${meal.name}</td>
      <td>
        <img src="/uploads/${meal.image_url}" alt="${meal.name}" style="width: 80px; border-radius: 5px;" />
      </td>
      <td>Rp.${meal.price.toLocaleString('id-ID')}</td>
      <td>${meal.description}</td>
      <td class="text-center">
        <div class="d-flex justify-content-center align-items-center" style="gap: 8px;">
          <button class="btn btn-warning btn-sm edit-btn" data-id="${meal.id}">Edit</button>
          <button class="btn btn-danger btn-sm delete-btn" data-id="${meal.id}">Hapus</button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });

  bindEditButtons();
  bindDeleteButtons();
}

// === Render Pagination ===
function renderPagination() {
  const pagination = document.getElementById('pagination');
  if (!pagination) {
    console.warn('⚠️ Element #pagination tidak ditemukan.');
    return;
  }

  pagination.innerHTML = '';

  const totalPages = Math.ceil(allMealPlans.length / itemsPerPage);
  for (let i = 1; i <= totalPages; i++) {
    const li = document.createElement('li');
    li.className = `page-item ${i === currentPage ? 'active' : ''}`;
    li.innerHTML = `<a class="page-link" href="#">${i}</a>`;
    li.addEventListener('click', (e) => {
      e.preventDefault();
      currentPage = i;
      renderTable();
      renderPagination();
    });
    pagination.appendChild(li);
  }
}

// === Form Tambah Meal Plan ===
function setupAddForm() {
  const addForm = document.getElementById('addMealForm');
  if (!addForm) return;

  addForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(addForm);

    try {
      const res = await fetch('http://localhost:3000/api/meal-plans', {
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        const text = await res.text();
        console.error('❌ Server response:', text);
        return Swal.fire({
          icon: 'error',
          title: 'Gagal Menambahkan',
          text: 'Periksa error di console.',
          confirmButtonColor: '#d33'
        });
      }

      await Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Meal plan berhasil ditambahkan!',
        confirmButtonColor: '#3085d6'
      });

      addForm.reset(); 

      const modal = bootstrap.Modal.getInstance(document.getElementById('addMealModal'));
      if (modal) modal.hide();
      await loadMealPlans(); 
    } catch (err) {
      console.error('❌ Fetch error:', err);
      Swal.fire({
        icon: 'error',
        title: 'Terjadi Kesalahan',
        text: 'Gagal mengirim permintaan ke server.',
        confirmButtonColor: '#d33'
      });
    }
  });

  // ✅ Kosongkan form saat modal ditutup manual
  const modalElement = document.getElementById('addMealModal');
  if (modalElement) {
    modalElement.addEventListener('hidden.bs.modal', () => {
      addForm.reset();
    });
  }
}

// === Form Edit Meal Plan ===
function setupEditForm() {
  const editForm = document.getElementById('editMealForm');
  if (!editForm) return;

  editForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('editMealId').value;
    const formData = new FormData(editForm);

    try {
      const res = await fetch(`http://localhost:3000/api/meal-plans/${id}`, {
        method: 'PUT',
        body: formData
      });

      if (!res.ok) {
        const text = await res.text();
        console.error('❌ Server response:', text);
        return Swal.fire({
          icon: 'error',
          title: 'Gagal Update',
          text: 'Periksa error di console.',
          confirmButtonColor: '#d33'
        });
      }

      await Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Meal plan berhasil diupdate!',
        confirmButtonColor: '#3085d6'
      });

      const modal = bootstrap.Modal.getInstance(document.getElementById('editMealModal'));
      modal.hide();

      loadMealPlans();
    } catch (err) {
      console.error('❌ Fetch error:', err);
      Swal.fire({
        icon: 'error',
        title: 'Terjadi Kesalahan',
        text: 'Gagal mengirim permintaan ke server.',
        confirmButtonColor: '#d33'
      });
    }
  });
}

// === Tombol Edit ===
function bindEditButtons() {
  document.querySelectorAll('.edit-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      openEditModal(Number(id));
    });
  });
}

function openEditModal(id) {
  const meal = allMealPlans.find((m) => m.id === id);
  if (!meal) return;

  document.getElementById('editMealId').value = meal.id;
  document.getElementById('editName').value = meal.name;
  document.getElementById('editPrice').value = meal.price;
  document.getElementById('editDescription').value = meal.description;

  const modal = new bootstrap.Modal(document.getElementById('editMealModal'));
  modal.show();
}

// === Tombol Hapus ===
function bindDeleteButtons() {
  document.querySelectorAll('.delete-btn').forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const id = btn.dataset.id;

      const confirm = await Swal.fire({
        icon: 'warning',
        title: 'Yakin ingin menghapus?',
        text: 'Data ini tidak dapat dikembalikan!',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Ya, Hapus',
        cancelButtonText: 'Batal'
      });

      if (!confirm.isConfirmed) return;

      try {
        const res = await fetch(`http://localhost:3000/api/meal-plans/${id}`, {
          method: 'DELETE'
        });

        const data = await res.json();
        if (res.ok) {
          await Swal.fire({
            icon: 'success',
            title: 'Berhasil!',
            text: 'Meal plan berhasil dihapus!',
            confirmButtonColor: '#3085d6'
          });
          loadMealPlans();
        } else {
          Swal.fire('Gagal', data.message || 'Gagal menghapus data.', 'error');
        }
      } catch (err) {
        console.error('❌ Delete error:', err);
        Swal.fire('Error', 'Terjadi kesalahan saat menghapus.', 'error');
      }
    });
  });
}
