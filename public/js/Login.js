document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  const loginError = document.getElementById('loginError');

  // Reset error
  loginError.classList.add('d-none');
  loginError.innerHTML = '';

  try {
    const res = await fetch('https://cateringsea.my.id//api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password }),
      credentials: 'include'
    });

    const data = await res.json();

    if (!res.ok) {
      loginError.textContent = data.message || 'Login gagal';
      loginError.classList.remove('d-none');
      return;
    }

    if (data.token) {
      const payload = JSON.parse(atob(data.token.split('.')[1]));
      
      if (payload.role === 'ADMIN') {
        window.location.href = '/dashboard';
      } else {
        window.location.href = '/';
      }
    } else {
      window.location.href = '/';
    }
    

  } catch (err) {
    console.error('Login error:', err);
    loginError.textContent = 'Terjadi kesalahan, coba lagi';
    loginError.classList.remove('d-none');
  }
});
