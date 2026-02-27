// ── Global Main ──────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Mobile nav toggle
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('nav');
  if (hamburger && nav) {
    hamburger.addEventListener('click', () => nav.classList.toggle('open'));
  }
  // Sticky header shadow
  const header = document.getElementById('header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.style.boxShadow = window.scrollY > 10 ? '0 2px 20px rgba(0,0,0,.5)' : 'none';
    });
  }
  // Newsletter fake submit
  document.querySelectorAll('.newsletter-form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input');
      if (input && input.value) {
        alert('📧 Inscrito com sucesso (fictício)!');
        input.value = '';
      }
    });
  });
});
