function generateRandomResi() {
  var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  var result = 'RESI-';
  for (var i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  var el = document.getElementById('resi_number');
  if (el) el.value = result;
}

window.regenerateResi = function () { generateRandomResi(); };

function renderAllQR() {
  document.querySelectorAll('.resi-item').forEach(function (card) {
    var id = card.getAttribute('data-resi-id');
    var qrValue = card.getAttribute('data-qr-value');
    var el = document.getElementById('qr-' + id);
    if (el && qrValue && !el.querySelector('canvas')) {
      var canvas = document.createElement('canvas');
      el.appendChild(canvas);
      new QRious({
        element: canvas,
        value: qrValue,
        size: 180,
        background: '#ffffff',
        foreground: '#000000',
        level: 'M',
      });
    }
  });
}

window.filterResi = function () {
  var query = document.getElementById('searchResi').value.toLowerCase().trim();
  var found = 0;
  document.querySelectorAll('.resi-item').forEach(function (card) {
    var data = card.getAttribute('data-search');
    var match = data.indexOf(query) !== -1;
    card.classList.toggle('is-hidden', !match);
    if (match) found++;
  });
  var emptyEl = document.getElementById('emptySearch');
  if (emptyEl) emptyEl.classList.toggle('is-hidden', !(found === 0 && query.length > 0));
};

function downloadQR(id, resiNum) {
  var canvas = document.querySelector('#qr-' + id + ' canvas');
  if (!canvas) return;
  var link = document.createElement('a');
  link.download = 'QR-' + resiNum + '.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
}

function printQR(id, resiNum, customerName, serviceName) {
  var canvas = document.querySelector('#qr-' + id + ' canvas');
  if (!canvas) return;
  var dataUrl = canvas.toDataURL('image/png');
  var w = window.open('', '_blank');
  w.document.write('<html><head><title>Resi ' + resiNum + '</title><style>body{font-family:Arial,sans-serif;text-align:center;padding:40px}h1{font-size:20px}img{border:4px solid #000;margin:16px 0}.resi{font-family:monospace;font-size:24px;font-weight:bold}</style></head><body><h1>Bukti Pengambilan Barang</h1><img src="' + dataUrl + '" width="220"><p class="resi">' + resiNum + '</p><p><strong>' + customerName + '</strong> — ' + serviceName + '</p></body></html>');
  w.document.close();
  setTimeout(function () { w.print(); }, 300);
}

function bindButtons() {
  document.querySelectorAll('.btn-download-qr').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var card = btn.closest('.resi-item');
      downloadQR(card.getAttribute('data-resi-id'), card.getAttribute('data-resi-number'));
    });
  });
  document.querySelectorAll('.btn-print-qr').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var card = btn.closest('.resi-item');
      printQR(card.getAttribute('data-resi-id'), card.getAttribute('data-resi-number'), card.getAttribute('data-customer-name'), card.getAttribute('data-service-name'));
    });
  });
}

document.addEventListener('DOMContentLoaded', function () {
  generateRandomResi();
  renderAllQR();
  bindButtons();
});
