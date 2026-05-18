function toggleFaq(btn) {
  var item = btn.closest('.faq-item');
  var wasOpen = item.classList.contains('is-open');
  item.closest('.brutal-card__body').querySelectorAll('.faq-item').forEach(function (i) {
    i.classList.remove('is-open');
  });
  if (!wasOpen) item.classList.add('is-open');
}

function filterFAQ(query) {
  var q = query.toLowerCase();
  document.querySelectorAll('.faq-item').forEach(function (item) {
    item.classList.toggle('is-hidden', !item.textContent.toLowerCase().includes(q));
  });
  document.querySelectorAll('.faq-card').forEach(function (card) {
    var hasVisible = Array.from(card.querySelectorAll('.faq-item')).some(function (i) {
      return !i.classList.contains('is-hidden');
    });
    card.classList.toggle('is-hidden', !hasVisible);
  });
}
