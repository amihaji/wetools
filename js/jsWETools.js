// Fungsi inisialisasi saat dokumen siap
document.addEventListener('DOMContentLoaded', function() {
  console.log("Document ready, initializing WETools...");
  
  // Inisialisasi halaman pertama
  navigate(null, 1);
});

// Untuk navigasi halaman  
function navigate(from, to) {
  console.log(`Navigating from ${from} to ${to}`);
  
  if (from) {
    const fromPage = document.getElementById("page" + from);
    if (fromPage) fromPage.classList.remove("active");
  }
  
  const toPage = document.getElementById("page" + to);
  if (toPage) toPage.classList.add("active");
  
  updateProgressBar(to);
  clearMessage(to);
}

// Untuk progress bar
function updateProgressBar(page) {
  const percent = page === 1 ? 33 : page === 2 ? 66 : 100;
  const progressBar = document.getElementById("progressBar");
  if (progressBar) {
    progressBar.style.width = percent + "%";
    progressBar.setAttribute('aria-valuenow', percent);
  }
}

// Untuk menghapus pesan
function clearMessage(page) {
  const msg = document.getElementById("formMessage" + page);
  if (msg) msg.innerHTML = "";
}

// Menampilkan pesan
function showMessage(page, text, type) {
  const msgBox = document.getElementById("formMessage" + page);
  if (msgBox) {
    msgBox.innerHTML = `<div class="message-box ${type === 'error' ? 'message-error' : 'message-success'}">${text}</div>`;
    msgBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

// Untuk validasi halaman1
function validatePage1() {
  console.log("Validating page 1...");
  
  const nama   = document.getElementById("mNama").value.trim();
  const hp     = document.getElementById("mNomorHp").value.trim();
  const email  = document.getElementById("mEmail").value.trim();
  const umur   = +document.getElementById("mUmur").value;
  const berat  = +document.getElementById("mBeratBadan").value;
  const tinggi = +document.getElementById("mTinggiBadan").value;
 
  // Validasi nama
  if (nama.length < 3 || nama.length > 40) {
    showMessage(1, "Nama harus 3-40 karakter dan huruf besar", "error");
    document.getElementById("mNama").focus();
    return false;
  }
  
  // Validasi nomor HP
  if (!/^[0-9]{10,14}$/.test(hp)) {
    showMessage(1, "Nomor HP harus 10-14 digit angka", "error");
    document.getElementById("mNomorHp").focus();
    return false;
  }
  
  // Validasi email
  if (email && !/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
    showMessage(1, "Format email tidak valid", "error");
    document.getElementById("mEmail").focus();
    return false;
  }
  
  // Validasi umur
  if (umur < 18 || umur > 80 || isNaN(umur)) {
    showMessage(1, "Umur harus antara 18-80 tahun", "error");
    document.getElementById("mUmur").focus();
    return false;
  }
  
  // Validasi berat badan
  if (berat < 40 || berat > 150 || isNaN(berat)) {
    showMessage(1, "Berat Badan harus antara 40-150 kg", "error");
    document.getElementById("mBeratBadan").focus();
    return false;
  }
  
  // Validasi tinggi badan
  if (tinggi < 100 || tinggi > 190 || isNaN(tinggi)) {
    showMessage(1, "Tinggi Badan harus antara 100-190 cm", "error");
    document.getElementById("mTinggiBadan").focus();
    return false;
  }
   
  const lingkarPerut   = document.getElementById("mLingkarPerut").value;
  const aktivitasFisik = document.getElementById("mAktivitasFisik").value;

  if (!lingkarPerut || !aktivitasFisik) {
    showMessage(1, "Harap lengkapi semua field", "error");
    return false;
  }

  // Jika semua validasi lolos, pindah ke halaman 2
  navigate(1, 2);
  return true;
}

// Untuk validasi halaman2
function validatePage2() {
  console.log("Validating page 2...");
  
  const required = [
    "mSarapan", "mMenu", "mNgantuk", "mLelah", "mLambung", 
    "mLapar", "mAir", "mKonsumsi", "mBab", "mKeram", 
    "mTidur", "mOlahraga", "mBak", "mKerutan", 
    "mSulit", "mBBNaik", "mRokok", "mAlkohol"
  ];

  let isValid = true;
  let firstMissingField = null;

  for (let id of required) {
    if (!document.querySelector(`input[name="${id}"]:checked`)) {
      if (!firstMissingField) firstMissingField = id;
      isValid = false;
    }
  }

  if (!isValid) {
    showMessage(2, "Harap jawab semua pertanyaan", "error");
    if (firstMissingField) {
      document.querySelector(`input[name="${firstMissingField}"]`).focus();
    }
    return false;
  }
  
  submitForm();
  return true;
}

// Untuk proses penyimpanan
function submitForm() {
  console.log("Submitting form data...");
  
  const data = {
    // Data pribadi
    mNama: document.getElementById("mNama").value,
    mNomorHp: document.getElementById("mNomorHp").value,
    mEmail: document.getElementById("mEmail").value,
    mUmur: parseInt(document.getElementById("mUmur").value),
    mJenisKelamin: document.getElementById("mJenisKelamin").value,
    mBeratBadan: parseFloat(document.getElementById("mBeratBadan").value),
    mTinggiBadan: parseFloat(document.getElementById("mTinggiBadan").value),
    mLingkarPerut: parseFloat(document.getElementById("mLingkarPerut").value),
    mAktivitasFisik: document.getElementById("mAktivitasFisik").value,

    // Data pertanyaan
    mSarapan: document.querySelector('input[name="mSarapan"]:checked')?.value,
    mMenu: document.querySelector('input[name="mMenu"]:checked')?.value,
    mNgantuk: document.querySelector('input[name="mNgantuk"]:checked')?.value,
    mLelah: document.querySelector('input[name="mLelah"]:checked')?.value,
    mLambung: document.querySelector('input[name="mLambung"]:checked')?.value,
    mLapar: document.querySelector('input[name="mLapar"]:checked')?.value,
    mAir: document.querySelector('input[name="mAir"]:checked')?.value,
    mKonsumsi: document.querySelector('input[name="mKonsumsi"]:checked')?.value,
    mBab: document.querySelector('input[name="mBab"]:checked')?.value,
    mKeram: document.querySelector('input[name="mKeram"]:checked')?.value,
    mTidur: document.querySelector('input[name="mTidur"]:checked')?.value,
    mOlahraga: document.querySelector('input[name="mOlahraga"]:checked')?.value,
    mBak: document.querySelector('input[name="mBak"]:checked')?.value,
    mKerutan: document.querySelector('input[name="mKerutan"]:checked')?.value,
    mSulit: document.querySelector('input[name="mSulit"]:checked')?.value,
    mBBNaik: document.querySelector('input[name="mBBNaik"]:checked')?.value,
    mRokok: document.querySelector('input[name="mRokok"]:checked')?.value,
    mAlkohol: document.querySelector('input[name="mAlkohol"]:checked')?.value
  };

  // Simpan data ke variabel global
  window.DATA_FINAL_ANALISA = data;
  console.log("Form data prepared:", data);

  // Navigasi ke halaman hasil
  navigate(2, 3);

  // Tampilkan loading, sembunyikan tombol
  document.getElementById("btnReset").style.display = "none";         
  document.getElementById("btnKirim").style.display = "none";
  document.getElementById("hasilAnalisa").style.display = "none";
  document.getElementById("loadingSpinner").style.display = "block";
 
  // Simulasi pengiriman data (untuk testing)
  setTimeout(function() {
    document.getElementById("loadingSpinner").style.display = "none";
    document.getElementById("hasilAnalisa").style.display = "block";
    document.getElementById("hasilAnalisa").innerHTML = `
      <div class="alert alert-success">
        <h4>Hasil Analisa Kebugaran</h4>
        <p>Data berhasil diproses!</p>
        <hr>
        <p>Nama: ${data.mNama}</p>
        <p>Umur: ${data.mUmur} tahun</p>
        <p>IMT: ${(data.mBeratBadan/((data.mTinggiBadan/100)**2)).toFixed(1)}</p>
      </div>
    `;
    
    document.getElementById("btnReset").style.display = "block";
    document.getElementById("btnKirim").style.display = "block";
    showMessage(3, "Analisa berhasil dibuat!", "success");
  }, 1500);

  // Jika menggunakan Google Apps Script, gunakan ini:
  /*
  google.script.run.withSuccessHandler(function(response) {
    document.getElementById("loadingSpinner").style.display = "none";
    document.getElementById("hasilAnalisa").style.display = "block";
    document.getElementById("hasilAnalisa").innerHTML = response;
    document.getElementById("btnReset").style.display = "block";
    document.getElementById("btnKirim").style.display = "block";
    showMessage(3, "Data berhasil disimpan!", "success");
  }).withFailureHandler(function(error) {
    document.getElementById("loadingSpinner").style.display = "none";
    showMessage(3, "Gagal menyimpan data: " + error.message, "error");
    document.getElementById("btnReset").style.display = "block";
    document.getElementById("btnKirim").style.display = "block";
  }).simpanData(data);
  */
}

// Untuk mereset form
function resetForm() {
  console.log("Resetting form...");
  
  document.getElementById("fitnessForm").reset();
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById("page1").classList.add("active");
  updateProgressBar(1);
  
  // Clear all messages
  for (let i = 1; i <= 3; i++) {
    clearMessage(i);
  }
  
  document.getElementById("hasilAnalisa").innerHTML = "";
  document.getElementById("hasilAnalisa").style.display = "none";
  document.getElementById("loadingSpinner").style.display = "none";
  
  document.getElementById("btnKirim").innerHTML = `<i class="fas fa-share-square me-2"></i> Kirim`;
  document.getElementById("btnKirim").style.display = "block";
  document.getElementById("btnReset").style.display = "block";
  document.getElementById("btnKirim").disabled = false;
  document.getElementById("btnReset").disabled = false;
 
  // Tampilkan pesan reset
  showMessage(1, "Form berhasil direset", "success");
  document.getElementById("mNama").focus();
}

// Untuk penanganan tombol kirim data
function kirimData() {
  console.log("Mengirim data...");
  
  const bKirim = document.getElementById("btnKirim");
  const bReset = document.getElementById("btnReset");
  const pesan = document.getElementById("pesan-kirim");

  bReset.disabled = true;
  bKirim.disabled = true;
  bKirim.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span> Mengirim...`;
  pesan.innerHTML = "";

  // Simulasi pengiriman (untuk testing)
  setTimeout(function() {
    pesan.innerHTML = `<div class="alert alert-success">Data berhasil dikirim!</div>`;
    bKirim.innerHTML = `<i class="fas fa-check-circle me-2"></i> Terkirim`;
    bKirim.disabled = true;
    bReset.disabled = false;
  }, 2000);

  // Jika menggunakan Google Apps Script, gunakan ini:
  /*
  google.script.run.withSuccessHandler(function(res) {
    pesan.innerHTML = `<div class="alert alert-success">${res}</div>`;
    bKirim.innerHTML = `<i class="fas fa-check-circle me-2"></i> Terkirim`;
    bKirim.disabled = true;
    bReset.disabled = false;
  }).withFailureHandler(function(err) {
    pesan.innerHTML = `<div class="alert alert-danger">Gagal: ${err.message}</div>`;
    bKirim.innerHTML = `<i class="fas fa-share-square me-2"></i> Kirim Ulang`;
    bKirim.disabled = false;
    bReset.disabled = false;
  }).prosesKirim(window.DATA_FINAL_ANALISA);
  */
}