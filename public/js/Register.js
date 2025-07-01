document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const full_name = document.getElementById('username').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('password_confirmation').value;

  const errorAlert = document.getElementById('errorAlert');
  errorAlert.classList.add('d-none'); 

  if (password !== confirmPassword) {
    errorAlert.textContent = "Password dan konfirmasi password tidak cocok.";
    errorAlert.classList.remove('d-none');
    return;
  }

  try {
    const response = await fetch('https://cateringsea.my.id//api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ full_name, email, password })
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem('token', data.token);
      window.location.href = "/login";
    } else {
      let errorMessage = "Registrasi gagal.";
      if (Array.isArray(data.errors)) {
        errorMessage = data.errors.join('<br>');
      } else if (data.error) {
        errorMessage = data.error;
      }

      errorAlert.innerHTML = errorMessage;
      errorAlert.classList.remove('d-none');
    }
  } catch (error) {
    console.error("❌ Fetch Error:", error);
    errorAlert.textContent = "Terjadi kesalahan saat mendaftar.";
    errorAlert.classList.remove('d-none');
  }
});
