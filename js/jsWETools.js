// Deklarasi untuk Progressbar
const steps       = document.querySelectorAll('.form-step');
const progressBar = document.getElementById('progressBar');
let currentStep   = 0;

// Harga & Gambar Produk (letakkan di global agar bisa diakses semua fungsi)
const hargaMap = { '10': 700000, '21': 2100000, '90': 7000000 };
const imgMap = {
  '10': 'images/produk10hari.webp',
  '21': 'images/produk21hari.webp',
  '90': 'images/produk3bulan.webp'
};

function showStep(idx) {
  steps.forEach((step, i) => step.classList.toggle('active', i === idx));
  progressBar.style.width = ((idx+1)/steps.length*100) + '%';
  progressBar.textContent = `Step ${idx+1} dari 3`;
}
showStep(currentStep);

// Generate No Pesanan otomatis
function generateNoPesanan() {
  const now = new Date();
  const pad = n => n.toString().padStart(2,'0');
  const tgl = pad(now.getDate())+pad(now.getMonth()+1)+now.getFullYear().toString().slice(-2);
  let urut = Math.floor(Math.random()*9000)+1000;
  return `PS${tgl}-${urut}`;
}
document.getElementById('tgl_daftar').valueAsDate = new Date();
document.getElementById('no_pesanan').value = generateNoPesanan();

// Tombol LANJUT pada Halaman 1
document.getElementById('btnNext1').onclick = function() {
  if(validateStep1()) {
    showStep(1);
    currentStep = 1;
    updateTotal(); // Pastikan biaya langsung terupdate saat masuk step 2
  }
};

// Tombol SEBELUM pada Halaman 2
document.getElementById('btnPrev2').onclick = function() {
  showStep(0); currentStep = 0;
};

// Tombol LANJUT pada halaman2
document.getElementById('btnNext2').onclick = function() {
  if(validateStep2()) {
    const harga  = parseInt(document.getElementById('harga_program').getAttribute('data-raw')) || 0;
    const ongkir = parseInt(document.getElementById('by_kirim').getAttribute('data-raw')) || 0;
    const tlp    = document.getElementById('tlp').value.trim();
    const last3  = parseInt(tlp.slice(-3).padStart(3, '0'), 10) || 0;
    const total  = harga + ongkir + last3;
    document.getElementById('transfer_dana').value = total.toLocaleString('id-ID', {minimumFractionDigits: 0, maximumFractionDigits: 0});
    document.getElementById('transfer_dana').setAttribute('data-raw', total);
    showStep(2); currentStep = 2;
  }
};

// Validasi Halaman 1
function validateStep1() {
  let msg = [];
  // Validasi Nama 
  const nama = document.getElementById('nama').value.trim();
  if(nama.length < 3 || nama.length > 40) msg.push('Nama wajib diisi, min 3 dan maks 40 karakter');
 
  // Validasi Email
  const email = document.getElementById('email').value.trim().toLowerCase();
  if(!/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(email)) msg.push('Email tidak valid');

  // Validasi Telepon
  const tlp = document.getElementById('tlp').value.trim();
  if(!/^\d{10,14}$/.test(tlp)) msg.push('No telepon wajib 10-14 digit angka.');
 
  // Validasi Alamat, Kecamatan, Kelurahan, Kota, Propensi
  const alamat = document.getElementById('alamat').value.trim();
  if(alamat.length < 3 || alamat.length > 60) msg.push('Alamat wajib diisi, min 3 dan maks 60 karakter.');
  ['kecamatan','kelurahan','kota','propinsi'].forEach(id=>{
    const val = document.getElementById(id).value.trim();
    if(val.length < 3 || val.length > 40) msg.push(id.charAt(0).toUpperCase()+id.slice(1)+' wajib diisi, min 3 dan maks 40 karakter.');
  });
 
  if(msg.length) {
    showMsg(msg.join('<br>'),'error');
    return false;
  }
  showMsg('','');
  return true;
}

// Validasi Halaman 2
function validateStep2() {
  let msg = [];
  if(!document.getElementById('program').value) msg.push('Program wajib dipilih.');
  if(!document.getElementById('ongkir').value) msg.push('Ekspedisi wajib dipilih.');
  if(msg.length) {
    showMsg(msg.join('<br>'),'error');
    return false;
  }
  showMsg('','');
  return true;
}

// Tampilkan Pesan
function showMsg(msg,type) {
  // Tampilkan pesan pada msgBox di step yang aktif saja
  const activeStep = document.querySelector('.form-step.active');
  if (!activeStep) return;
  const box = activeStep.querySelector('#msgBox');
  if(!msg) { box.innerHTML=''; return; }
  box.innerHTML = `<div class="${type==='error'?'msg-error':'msg-success'}">${msg}</div>`;
}

// Update Harga & Gambar Produk
document.getElementById('program').onchange = function() {
  const val   = this.value;
  const harga = val ? hargaMap[val] : '';
  // Tampilkan harga terformat di input
  document.getElementById('harga_program').value = harga ? harga.toLocaleString('id-ID', {minimumFractionDigits: 0, maximumFractionDigits: 0}) : '';
  // Simpan nilai angka mentah di atribut data-raw
  document.getElementById('harga_program').setAttribute('data-raw', harga || '');
  // Tampilkan gambar produk sesuai program
  const img = document.getElementById('img_produk');
  if(val) {
    img.src = imgMap[val];
    img.classList.remove('d-none');
  } else {
    img.classList.add('d-none');
  }
  // Update total biaya dan by kirim
  updateTotal();
};

// Update TOTAL HARGA
document.getElementById('ongkir').onchange = updateTotal;
function updateTotal() {
  const harga  = hargaMap[document.getElementById('program').value]||0;
  const ongkir = { 'Gojek':20000, 'Gosend':30000, 'POS':40000, 'Gratis':0 }[document.getElementById('ongkir').value];
  document.getElementById('by_kirim').value = (ongkir !== undefined && ongkir !== null) ? ongkir.toLocaleString('id-ID', {minimumFractionDigits: 0, maximumFractionDigits: 0}) : '';
  document.getElementById('by_kirim').setAttribute('data-raw', ongkir || 0);

  const tlp   = document.getElementById('tlp').value.trim();
  const last3 = parseInt(tlp.slice(-3).padStart(3, '0'), 10) || 0;
  const total = harga + (ongkir || 0) + last3;

  document.getElementById('total_biaya').value = (harga && ongkir !== undefined && ongkir !== null) ? total.toLocaleString('id-ID', {minimumFractionDigits: 0, maximumFractionDigits: 0}) : '';
  document.getElementById('total_biaya').setAttribute('data-raw', total);
}

// Submit Data Inputan
document.getElementById('formDaftar').onsubmit = async function(e) {
  e.preventDefault();

  // Ambil semua inputan form
  const form = document.getElementById('formDaftar');
  const inputs = form.querySelectorAll("input, select");

  const params = new URLSearchParams();
  inputs.forEach(input => {
    if (input.name) {
      params.append(input.name, input.value);
    }
  });

  try {
    const response = await fetch('https://script.google.com/macros/s/AKfycbzJ0HYpqWn4bvSwBEcOyJkAn6v1l4JRSBVrZuM5ehRSnIH5FGXoOKx5dkTGSzYeYN0y/exec', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params
    });

    const result = await response.text();
    console.log("Response:", result);
    
    // Tampilkan pesan sukses di msgBox step 3
    const msgBox = document.querySelector('#step3 #msgBox');
    msgBox.innerHTML = '<div class="msg-confirm">Data telah terdaftar. Anda akan diarahkan ke halaman utama</div>';
    
    // Nonaktifkan tombol submit untuk menghindari multiple submission
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    
    // Redirect setelah 3 detik kembali ke halaman utam
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 3000);

  } catch (err) {
    const msgBox = document.querySelector('#step3 #msgBox');
    msgBox.innerHTML = '<div class="msg-error">Terjadi error: ' + err.message + '</div>';
  }
}
