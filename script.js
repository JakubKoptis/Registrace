document.getElementById('registration-form').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
  
    let errors = {};
    if (!/^[a-zA-Z0-9]+$/.test(username)) {
      errors.username = 'Uživatelské jméno může obsahovat pouze alfanumerické znaky.';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Email má nesprávný formát.';
    }
    if (password.length < 8 || !/[a-z]/.test(password) || !/[A-Z]/.test(password)) {
      errors.password = 'Heslo nesplňuje požadované podmínky.';
    }
  
    document.getElementById('username-error').textContent = errors.username || '';
    document.getElementById('email-error').textContent = errors.email || '';
    document.getElementById('password-error').textContent = errors.password || '';
  
    if (Object.keys(errors).length === 0) {

      try {
        const response = await fetch('/validate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, email, password })
        });
  
        if (!response.ok) {
          const serverErrors = await response.json();
          document.getElementById('username-error').textContent = serverErrors.username || '';
          document.getElementById('email-error').textContent = serverErrors.email || '';
          document.getElementById('password-error').textContent = serverErrors.password || '';
        } else {
          alert('Registrace proběhla úspěšně!');
        }
      } catch (err) {
        console.error('Chyba při komunikaci se serverem:', err);
      }
    }
  });
  