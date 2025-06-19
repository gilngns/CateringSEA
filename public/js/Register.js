document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const full_name = document.getElementById('username').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('password_confirmation').value;

  if (password !== confirmPassword) {
    alert("Password dan konfirmasi password tidak cocok.");
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ full_name, email, password })
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem('token', data.token);
      window.location.href = "/login"; 
    } else {
      if (Array.isArray(data.errors)) {
        alert(data.errors.join('\n'));
      } else {
        alert(data.error || "Registrasi gagal.");
      }
    }
  } catch (error) {
    console.error("❌ Fetch Error:", error);
    alert("Terjadi kesalahan saat mendaftar.");
  }
});
