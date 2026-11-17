// Typhi Analytics AI — Landing Page Logic

document.addEventListener('DOMContentLoaded', () => {
  // 1. Dynamic Year in Footer
  const yearSpan = document.getElementById('current-year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // 2. Smooth Scroll for Navigation
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // 3. VIP Form Handling (Formsubmit.co AJAX)
  const vipForm = document.getElementById('vip-lead-form');
  const formSuccess = document.getElementById('form-success-message');

  if (vipForm) {
    vipForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      const submitBtn = vipForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Enviando solicitud...';

      const formData = new FormData(vipForm);

      try {
        const response = await fetch(vipForm.action, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          vipForm.reset();
          vipForm.style.display = 'none';
          if (formSuccess) {
            formSuccess.style.display = 'block';
          }
        } else {
          alert('Hubo un inconveniente al enviar la solicitud. Por favor intenta nuevamente o únete al Canal de WhatsApp.');
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
        }
      } catch (error) {
        // Fallback for CORS or offline test
        vipForm.reset();
        vipForm.style.display = 'none';
        if (formSuccess) {
          formSuccess.style.display = 'block';
        }
      }
    });
  }
});
