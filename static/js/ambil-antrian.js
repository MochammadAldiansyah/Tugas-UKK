/* QR scanner & phone validation — halaman Ambil Antrian */
(function () {
  var qrStream = null;
  var qrAnimFrame = null;
  var phoneInput = document.getElementById('customer_phone');
  var phoneWarning = document.getElementById('phoneWarning');
  var queueForm = document.getElementById('queueForm');
  var qrModal = document.getElementById('qrModal');

  function validatePhone(value) {
    if (!value) {
      if (phoneWarning) phoneWarning.classList.remove('is-visible');
      return true;
    }
    var valid = /^08[0-9]{8,11}$/.test(value);
    if (phoneWarning) phoneWarning.classList.toggle('is-visible', !valid);
    return valid;
  }

  if (phoneInput) {
    phoneInput.addEventListener('input', function () {
      this.value = this.value.replace(/[^0-9]/g, '');
      validatePhone(this.value);
    });
    phoneInput.addEventListener('blur', function () {
      validatePhone(this.value);
    });
  }

  if (queueForm) {
    queueForm.addEventListener('submit', function (e) {
      if (phoneInput && phoneInput.value && !validatePhone(phoneInput.value)) {
        e.preventDefault();
        phoneInput.focus();
      }
    });
  }

  window.openQRScanner = function () {
    if (!qrModal) return;
    qrModal.classList.add('is-open');
    var statusEl = document.getElementById('qrStatus');
    if (statusEl) statusEl.textContent = 'Memulai kamera...';
    var video = document.getElementById('qrVideo');
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      .then(function (stream) {
        qrStream = stream;
        video.srcObject = stream;
        video.play();
        if (statusEl) statusEl.textContent = 'Kamera aktif — arahkan ke QR Code';
        requestAnimationFrame(scanQR);
      })
      .catch(function (err) {
        if (statusEl) statusEl.innerHTML = '<span class="text-red-600">Gagal akses kamera: ' + err.message + '</span>';
      });
  };

  function scanQR() {
    var video = document.getElementById('qrVideo');
    var canvas = document.getElementById('qrCanvas');
    if (!video || !canvas) return;
    var ctx = canvas.getContext('2d');
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      var code = jsQR(ctx.getImageData(0, 0, canvas.width, canvas.height).data, canvas.width, canvas.height, { inversionAttempts: 'dontInvert' });
      if (code) {
        handleQRResult(code.data);
        return;
      }
    }
    qrAnimFrame = requestAnimationFrame(scanQR);
  }

  function handleQRResult(data) {
    var statusEl = document.getElementById('qrStatus');
    if (statusEl) statusEl.innerHTML = '<span class="text-brand-blue">QR Terdeteksi! Memproses...</span>';
    var resiCode = null, customerName = null, customerPhone = null, serviceCode = null;
    var parts = data.split('|');
    if (parts.length >= 4) {
      resiCode = parts[0].trim();
      customerName = parts[1].trim();
      customerPhone = parts[2].trim();
      serviceCode = parts[3].trim().toUpperCase();
    } else if (parts.length === 2) {
      resiCode = parts[0].trim();
      serviceCode = parts[1].trim().toUpperCase();
    } else {
      try {
        var url = new URL(data);
        serviceCode = url.searchParams.get('service');
        if (serviceCode) serviceCode = serviceCode.toUpperCase();
      } catch (e) {
        var match = data.match(/^(?:ANTRIAN[:\-])?([A-D])$/i);
        if (match) serviceCode = match[1].toUpperCase();
      }
    }
    if (!serviceCode) {
      if (statusEl) statusEl.innerHTML = '<span class="text-amber-600">Format QR tidak dikenali</span>';
      setTimeout(function () { requestAnimationFrame(scanQR); }, 2500);
      return;
    }
    var serviceSelect = document.getElementById('service_type');
    var serviceFound = false;
    if (serviceSelect) {
      for (var i = 0; i < serviceSelect.options.length; i++) {
        var opt = serviceSelect.options[i];
        if (opt.text.toUpperCase().startsWith(serviceCode + ' ') || opt.text.toUpperCase().startsWith(serviceCode + '-')) {
          serviceSelect.value = opt.value;
          serviceFound = true;
          break;
        }
      }
    }
    if (!serviceFound) {
      if (statusEl) statusEl.innerHTML = '<span class="text-red-600">Kode layanan tidak ditemukan</span>';
      setTimeout(function () { requestAnimationFrame(scanQR); }, 2500);
      return;
    }
    if (customerName) document.getElementById('customer_name').value = customerName;
    if (customerPhone) {
      document.getElementById('customer_phone').value = customerPhone;
      validatePhone(customerPhone);
    }
    window.closeQRScanner();
    showQRSuccess(resiCode ? 'Resi ' + resiCode + ' ditemukan! Silakan klik Ambil Nomor Antrian.' : 'Layanan ' + serviceCode + ' dipilih!');
  }

  function showQRSuccess(msg) {
    var toast = document.createElement('div');
    toast.className = 'qr-toast';
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(function () { toast.classList.add('is-visible'); }, 10);
    setTimeout(function () {
      toast.classList.remove('is-visible');
      setTimeout(function () { toast.remove(); }, 300);
    }, 4000);
  }

  window.closeQRScanner = function () {
    if (qrModal) qrModal.classList.remove('is-open');
    if (qrStream) {
      qrStream.getTracks().forEach(function (t) { t.stop(); });
      qrStream = null;
    }
    if (qrAnimFrame) {
      cancelAnimationFrame(qrAnimFrame);
      qrAnimFrame = null;
    }
  };
})();
