// Untuk navigasi halaman  
function navigate(from, to) {
  document.getElementById("page" + from).classList.remove("active");
  document.getElementById("page" + to).classList.add("active");
  updateProgressBar(to);
  clearMessage(to);
}

// Untuk progress bar
function updateProgressBar(page) {
  const percent = page === 1 ? 33 : page === 2 ? 66 : 100;
  document.getElementById("progressBar").style.width = percent + "%";
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
  }
}

// Untuk validasi halaman1
function validatePage1() {
  const nama   = document.getElementById("mNama").value.trim();
  const hp     = document.getElementById("mNomorHp").value.trim();
  const email  = document.getElementById("mEmail").value.trim();
  const umur   = +document.getElementById("mUmur").value;
  const berat  = +document.getElementById("mBeratBadan").value;
  const tinggi = +document.getElementById("mTinggiBadan").value;
 
  if (nama.length < 3 || nama.length > 40) 
     return showMessage(1, "Nama harus 3-40 karakter dan huruf besar", "error");
  if (!/^[0-9]{10,14}$/.test(hp)) 
     return showMessage(1, "Nomor HP harus 10-14 digit angka", "error");
  if (email && !/^[^@]+@[^@]+\.[^@]+$/.test(email)) 
     return showMessage(1, "Salah input email", "error");
  if (umur < 18 || umur > 80) 
     return showMessage(1, "Umur harus antara 18-80 thn", "error");
  if (berat < 40 || berat > 150) 
     return showMessage(1, "Berat Badan harus antara 40-150 kg", "error");
  if (tinggi < 100 || tinggi > 190) 
     return showMessage(1, "Tinggi Badan harus antara 100-190 cm", "error");
   
  const lingkarPerut   = document.getElementById("mLingkarPerut").value;
  const aktivitasFisik = document.getElementById("mAktivitasFisik").value;

  if (!lingkarPerut || !aktivitasFisik) {
    showMessage(1, "Inputan di isi dengan lengkap", "error");
    return false;
  }

  // Kalau semua validasi lolos, pindah ke halaman 2
  navigate(1, 2);
}

// Untuk validasi halaman2
function validatePage2() {
  const required = ["mSarapan","mMenu","mNgantuk","mLelah","mLambung","mLapar","mAir","mKonsumsi","mBab","mKeram","mTidur","mOlahraga","mBak","mKerutan","mSulit","mBBNaik","mRokok","mAlkohol"];

  for (let id of required) {
    if (!document.querySelector(`input[name="${id}"]:checked`)) {
      return showMessage(2, "Inputan di isi dengan lengkap", "error");
    }
  }
  submitForm();
}

// Untuk proses penyimpanan
function submitForm() {
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
    mSarapan: document.querySelector('input[name="mSarapan"]:checked').value,
    mMenu: document.querySelector('input[name="mMenu"]:checked').value,
    mNgantuk: document.querySelector('input[name="mNgantuk"]:checked').value,
    mLelah: document.querySelector('input[name="mLelah"]:checked').value,
    mLambung: document.querySelector('input[name="mLambung"]:checked').value,
    mLapar: document.querySelector('input[name="mLapar"]:checked').value,
    mAir: document.querySelector('input[name="mAir"]:checked').value,
    mKonsumsi: document.querySelector('input[name="mKonsumsi"]:checked').value,
    mBab: document.querySelector('input[name="mBab"]:checked').value,
    mKeram: document.querySelector('input[name="mKeram"]:checked').value,
    mTidur: document.querySelector('input[name="mTidur"]:checked').value,
    mOlahraga: document.querySelector('input[name="mOlahraga"]:checked').value,
    mBak: document.querySelector('input[name="mBak"]:checked').value,
    mKerutan: document.querySelector('input[name="mKerutan"]:checked').value,
    mSulit: document.querySelector('input[name="mSulit"]:checked').value,
    mBBNaik: document.querySelector('input[name="mBBNaik"]:checked').value,
    mRokok: document.querySelector('input[name="mRokok"]:checked').value,
    mAlkohol: document.querySelector('input[name="mAlkohol"]:checked').value
  };

  // Simpan data ke variabel global
  window.DATA_FINAL_ANALISA = data;

  // Navigasi ke halaman hasil
  navigate(2, 3);

  // Sembunyikan tombol, tampilkan spinner
  document.getElementById("btnReset").style.display       = "none";         
  document.getElementById("btnKirim").style.display       = "none";
  document.getElementById("hasilAnalisa").style.display   = "none";
  document.getElementById("loadingSpinner").style.display = "block";
 
  // Kirim data ke Apps Script, tampilkan hasil analisa
  google.script.run.withSuccessHandler(function(response) {
    document.getElementById("loadingSpinner").style.display = "none";
    document.getElementById("hasilAnalisa").style.display   = "block";
    document.getElementById("hasilAnalisa").innerHTML       = response;
 
    // Tampilkan kembali tombol setelah selesai
    document.getElementById("btnReset").style.display = "block";
    document.getElementById("btnKirim").style.display = "block";

    showMessage(2, "Data berhasil disimpan!", "success");

  }).simpanData(data);
}

// Untuk mereset form
function resetForm() {
  document.getElementById("fitnessForm").reset();
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById("page1").classList.add("active");
  updateProgressBar(1);
  ["1", "2", "3"].forEach(n => clearMessage(n));
  
  document.getElementById("hasilAnalisa").innerHTML       = "";
  document.getElementById("hasilAnalisa").style.display   = "none";
  document.getElementById("loadingSpinner").style.display = "block";
  
  document.getElementById("btnKirim").innerHTML           = `<i class="fas fa-share-square me-2"></i> Kirim`;
  document.getElementById("btnKirim").style.display       = "block";
  document.getElementById("btnReset").style.display       = "block";

  document.getElementById("btnKirim").disabled            = false;
  document.getElementById("btnReset").disabled            = false;
 
  // Tampilkan pesan reset
  showMessage(1, "Form berhasil direset", "success");
}

// Untuk penanganan tombol kirim data
function kirimData() {
  const bKirim     = document.getElementById("btnKirim");
  const bReset     = document.getElementById("btnReset");
  const pesan      = document.getElementById("pesan-kirim");

  bReset.disabled  = true;
  bKirim.disabled  = true;
  bKirim.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span> Proses kirim...`;
  pesan.innerHTML  = "";

  // Kirim data ke Google Script
  google.script.run.withSuccessHandler(function(res) {
    pesan.innerHTML  = `<span class="text-primary">${res}</span>`;
    bKirim.innerHTML = `<i class="fas fa-check-circle me-2"></i> Berhasil Terkirim`;
    bKirim.disabled  = true;
    bReset.disabled  = false;
  }).withFailureHandler(function(err) {
    pesan.innerHTML  = `<span class="text-danger">Gagal: ${err.message}</span>`;
    bKirim.innerHTML = `<i class="fas fa-share-square me-2"></i> Kirim`;
    bKirim.disabled  = false;
    bReset.disabled  = false;
  }).prosesKirim(window.DATA_FINAL_ANALISA);
}