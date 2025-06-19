document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
  
    try {
      const res = await fetch('http://localhost:3000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        alert(data.message || 'Login gagal');
        return;
      }
  
      localStorage.setItem('token', data.token);
  
      // Decode token untuk ambil role
      const payload = JSON.parse(atob(data.token.split('.')[1]));
  
      // Redirect berdasarkan role
      if (payload.role === 'ADMIN') {
        window.location.href = '/dashboard';
      } else {
        window.location.href = '/home';
      }
    } catch (err) {
      console.error('Login error:', err);
      alert('Terjadi kesalahan, coba lagi');
    }
  });
  