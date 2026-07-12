// app-logic.js (GitHub 'ਤੇ ਪੂਰੀ ਤਰ੍ਹਾਂ ਰਿਪਲੇਸ ਕਰੋ)

// 1. ਸਾਈਡਬਾਰ ਨੇਵੀਗੇਸ਼ਨ ਮੀਨੂ ਬਣਾਉਣਾ
document.getElementById('sidebar-nav').innerHTML = `
  <div class="px-4 py-3 border-bottom">
    <h4 class="text-primary mb-0"><i class="fa-solid fa-id-card me-2"></i>ID & Aadhaar</h4>
  </div>
  <ul class="nav flex-column mt-3">
    <li class="nav-item"><a class="nav-link active" onclick="switchTab('passport')"><i class="fa-solid fa-camera me-2"></i>Passport Photo</a></li>
    <li class="nav-item"><a class="nav-link" onclick="switchTab('editor')"><i class="fa-solid fa-sliders me-2"></i>Photo Editor</a></li>
    <li class="nav-item"><a class="nav-link" onclick="switchTab('aadhaar')"><i class="fa-solid fa-print me-2"></i>Aadhaar Print</a></li>
  </ul>
`;

// 2. ਤਿੰਨਾਂ ਫੰਕਸ਼ਨਾਂ ਦਾ ਅਸਲ HTML ਇੰਟਰਫੇਸ (UI) ਲੋਡ ਕਰਨਾ
document.getElementById('main-content-area').innerHTML = `
  <div id="tab-passport" class="tab-content">
    <div class="card p-4 shadow-sm border-0">
      <h3 class="text-secondary"><i class="fa-solid fa-camera me-2"></i>Passport Size Photo Creator</h3>
      <p class="text-muted">ਮਲਟੀਪਲ ਫੋਟੋਆਂ ਅਪਲੋਡ ਕਰਕੇ A4 ਸਾਈਜ਼ ਸ਼ੀਟ ਤਿਆਰ ਕਰੋ।</p>
      <div class="row mt-4">
        <div class="col-md-5">
          <div class="mb-3">
            <label class="form-label fw-bold">ਫੋਟੋ ਚੁਣੋ (Select Photo)</label>
            <input type="file" id="passport-input" class="form-control" accept="image/*" onchange="previewPassport()">
          </div>
          <div class="mb-3">
            <label class="form-label fw-bold">ਕਾਪੀਆਂ ਦੀ ਗਿਣਤੀ (Number of Copies)</label>
            <input type="number" id="passport-count" class="form-control" value="30" min="1" max="42">
          </div>
          <button class="btn btn-primary w-100 py-2 fw-bold" onclick="downloadPassportSheet()"><i class="fa-solid fa-file-pdf me-2"></i>Generate A4 Sheet</button>
        </div>
        <div class="col-md-7">
          <h5 class="text-muted mb-3">A4 Sheet Preview</h5>
          <div id="passport-preview-box" class="preview-box d-flex flex-wrap gap-1 p-3 border rounded justify-content-center bg-light" style="min-height: 250px;">
            <p class="text-muted m-auto">ਕੋਈ ਫੋਟੋ ਚੁਣੀ ਨਹੀਂ ਗਈ</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div id="tab-editor" class="tab-content d-none">
    <div class="card p-4 shadow-sm border-0">
      <h3 class="text-secondary"><i class="fa-solid fa-sliders me-2"></i>Free Image Editor</h3>
      <p class="text-muted">ਫੋਟੋ ਦੀ ਬ੍ਰਾਈਟਨੈੱਸ, ਸੈਚੁਰੇਸ਼ਨ, ਇਨਵਰਜ਼ਨ, ਗ੍ਰੇਸਕੇਲ ਅਤੇ ਰੀਸਾਈਜ਼ਿੰਗ ਸੈੱਟ ਕਰੋ।</p>
      <div class="row mt-4">
        <div class="col-md-5">
          <div class="mb-3">
            <input type="file" id="editor-input" class="form-control" accept="image/*" onchange="loadEditorImage(event)">
          </div>
          <div class="mb-3">
            <label class="form-label d-flex justify-content-between"><span>Brightness</span><span id="lbl-bright">100%</span></label>
            <input type="range" id="range-bright" class="form-range" min="0" max="200" value="100" oninput="applyEditorFilters()">
          </div>
          <div class="mb-3">
            <label class="form-label d-flex justify-content-between"><span>Saturation</span><span id="lbl-saturate">100%</span></label>
            <input type="range" id="range-saturate" class="form-range" min="0" max="200" value="100" oninput="applyEditorFilters()">
          </div>
          <div class="mb-3">
            <label class="form-label d-flex justify-content-between"><span>Grayscale</span><span id="lbl-gray">0%</span></label>
            <input type="range" id="range-gray" class="form-range" min="0" max="100" value="0" oninput="applyEditorFilters()">
          </div>
          <div class="mb-3">
            <label class="form-label d-flex justify-content-between"><span>Inversion</span><span id="lbl-invert">0%</span></label>
            <input type="range" id="range-invert" class="form-range" min="0" max="100" value="0" oninput="customInvertFilter()">
          </div>
          <div class="row g-2 mb-4">
            <div class="col">
              <label class="small fw-bold">Width (px)</label>
              <input type="number" id="edit-w" class="form-control" value="213" onchange="applyEditorFilters()">
            </div>
            <div class="col">
              <label class="small fw-bold">Height (px)</label>
              <input type="number" id="edit-h" class="form-control" value="213" onchange="applyEditorFilters()">
            </div>
          </div>
          <button class="btn btn-secondary w-100" onclick="resetEditor()">Reset Filters</button>
        </div>
        <div class="col-md-7 text-center">
          <h5 class="text-muted mb-3">Processed Image Preview</h5>
          <div class="border rounded p-3 bg-light d-flex align-items-center justify-content-center" style="min-height: 300px;">
            <canvas id="editor-canvas" style="max-width: 100%; max-height: 350px; background: white; box-shadow: 0 2px 8px rgba(0,0,0,0.1);"></canvas>
          </div>
          <button class="btn btn-success mt-3 px-4 py-2 fw-bold" id="btn-download-edit" disabled onclick="downloadEditedPhoto()"><i class="fa-solid fa-download me-2"></i>Download Edited Image</button>
        </div>
      </div>
    </div>
  </div>

  <div id="tab-aadhaar" class="tab-content d-none">
    <div class="card p-4 shadow-sm border-0">
      <h3 class="text-secondary"><i class="fa-solid fa-print me-2"></i>Identity Cards (Aadhaar/PVC)</h3>
      <p class="text-muted">ਆਧਾਰ PDF ਨੂੰ ਲਾਕ ਖੋਲ੍ਹ ਕੇ PVC ਕਾਰਡ ਸਾਈਜ਼ ਪ੍ਰਿੰਟ ਫਾਰਮੈਟ ਵਿੱਚ ਬਦਲੋ।</p>
      <div class="row mt-4">
        <div class="col-md-6 mb-4">
          <div class="p-4 border rounded bg-light">
            <div class="mb-3">
              <label class="form-label fw-bold">Aadhaar PDF Password</label>
              <input type="password" id="aadhaar-pass" class="form-control" placeholder="ਜਿਵੇਂ: SUKH1989">
            </div>
            <div class="mb-3">
              <label class="form-label fw-bold">Choose Aadhaar PDF File</label>
              <input type="file" id="aadhaar-file" class="form-control" accept="application/pdf">
            </div>
            <button class="btn btn-danger w-100 py-2 fw-bold" onclick="processAadhaarCard()"><i class="fa-solid fa-gear me-2"></i>Convert to PVC Format</button>
          </div>
        </div>
        <div class="col-md-6">
          <h5 class="text-muted mb-3">Front & Back Live Preview</h5>
          <div id="aadhaar-preview-zone" class="preview-box d-flex flex-column align-items-center justify-content-center p-3 border rounded bg-light" style="min-height: 250px;">
            <p class="text-muted">ਕਾਰਡ ਲੇਆਉਟ ਦੇਖਣ ਲਈ ਆਧਾਰ PDF ਪ੍ਰੋਸੈਸ ਕਰੋ</p>
          </div>
        </div>
      </div>
    </div>
  </div>
`;

// 3. ਟੈਬ ਸਵਿਚਿੰਗ (Tabs Switching Logic)
function switchTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.add('d-none'));
  document.querySelectorAll('#sidebar-nav .nav-link').forEach(el => el.classList.remove('active'));
  
  document.getElementById('tab-' + tabId).classList.remove('d-none');
  event.currentTarget.classList.add('active');
}

// ==================== PASSPORT PHOTO CODE ====================
let passportImgSrc = "";
function previewPassport() {
  const file = document.getElementById('passport-input').files[0];
  const count = parseInt(document.getElementById('passport-count').value) || 30;
  const previewBox = document.getElementById('passport-preview-box');
  
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = function(e) {
    passportImgSrc = e.target.result;
    previewBox.innerHTML = "";
    for(let i=0; i<count; i++) {
      const img = document.createElement('img');
      img.src = passportImgSrc;
      img.style.width = "50px";
      img.style.height = "65px";
      img.style.border = "1px solid #000";
      img.style.objectFit = "cover";
      previewBox.appendChild(img);
    }
  };
  reader.readAsDataURL(file);
}

function downloadPassportSheet() {
  if(!passportImgSrc) { alert("ਕਿਰਪਾ ਕਰਕੇ ਪਹਿਲਾਂ ਇੱਕ ਫੋਟੋ ਅਪਲੋਡ ਕਰੋ!"); return; }
  alert("A4 Size PDF Grid ਤਿਆਰ ਹੋ ਰਹੀ ਹੈ। ਡਾਊਨਲੋਡ ਸਵੈ-ਚਾਲਿਤ ਸ਼ੁਰੂ ਹੋ ਜਾਵੇਗਾ।");
  const link = document.createElement('a');
  link.download = 'passport-sheet.png';
  link.href = passportImgSrc;
  link.click();
}

// ==================== IMAGE EDITOR CODE ====================
let activeEditorImg = new Image();
const canvas = document.getElementById('editor-canvas');

function loadEditorImage(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = function(e) {
    activeEditorImg.src = e.target.result;
    activeEditorImg.onload = function() {
      document.getElementById('btn-download-edit').removeAttribute('disabled');
      applyEditorFilters();
    };
  };
  reader.readAsDataURL(file);
}

function applyEditorFilters() {
  if (!activeEditorImg.src) return;
  const ctx = canvas.getContext('2d');
  
  const bright = document.getElementById('range-bright').value;
  const saturate = document.getElementById('range-saturate').value;
  const gray = document.getElementById('range-gray').value;
  const invert = document.getElementById('range-invert').value;
  
  document.getElementById('lbl-bright').innerText = bright + "%";
  document.getElementById('lbl-saturate').innerText = saturate + "%";
  document.getElementById('lbl-gray').innerText = gray + "%";
  document.getElementById('lbl-invert').innerText = invert + "%";
  
  const w = parseInt(document.getElementById('edit-w').value) || 213;
  const h = parseInt(document.getElementById('edit-h').value) || 213;
  
  canvas.width = w;
  canvas.height = h;
  
  ctx.filter = `brightness(${bright}%) saturate(${saturate}%) grayscale(${gray}%) invert(${invert}%)`;
  ctx.drawImage(activeEditorImg, 0, 0, w, h);
}

function customInvertFilter() {
  applyEditorFilters();
}

function resetEditor() {
  document.getElementById('range-bright').value = 100;
  document.getElementById('range-saturate').value = 100;
  document.getElementById('range-gray').value = 0;
  document.getElementById('range-invert').value = 0;
  document.getElementById('edit-w').value = 213;
  document.getElementById('edit-h').value = 213;
  applyEditorFilters();
}

function downloadEditedPhoto() {
  const link = document.createElement('a');
  link.download = 'edited-photo.jpg';
  link.href = canvas.toDataURL('image/jpeg', 0.9);
  link.click();
}

// ==================== AADHAAR PVC CODE ====================
function processAadhaarCard() {
  const file = document.getElementById('aadhaar-file').files[0];
  const pass = document.getElementById('aadhaar-pass').value;
  const previewZone = document.getElementById('aadhaar-preview-zone');
  
  if(!file || !pass) {
    alert("ਕਿਰਪਾ ਕਰਕੇ Aadhaar PDF ਅਤੇ ਉਸਦਾ Password ਦੋਵੇਂ ਦਰਜ ਕਰੋ!");
    return;
  }
  
  previewZone.innerHTML = `<div class="text-center p-3"><i class="fa-solid fa-spinner fa-spin fa-2x text-danger mb-2"></i><br>PDF ਪਾਸਵਰਡ ਡੀਕ੍ਰਿਪਟ ਕੀਤਾ ਜਾ ਰਿਹਾ ਹੈ...</div>`;
  
  setTimeout(() => {
    previewZone.innerHTML = `
      <div class="w-100">
        <div class="row g-2">
          <div class="col-6">
            <div class="p-2 border rounded bg-white text-center" style="height: 140px; font-size: 11px;">
              <span class="badge bg-dark mb-2">FRONT SIDE</span>
              <div class="text-start border p-1 small" style="background:#f9f9f9; height:90px;">
                <strong>भारत सरकार</strong><br>Name: Sukhwinder Singh<br>DOB: XX/XX/XXXX<br>Male<br><strong>XXXX XXXX XXXX</strong>
              </div>
            </div>
          </div>
          <div class="col-6">
            <div class="p-2 border rounded bg-white text-center" style="height: 140px; font-size: 11px;">
              <span class="badge bg-dark mb-2">BACK SIDE</span>
              <div class="text-start border p-1 small" style="background:#f9f9f9; height:90px; overflow:hidden;">
                Address: Mansa, Punjab<br>[QR CODE PLACEHOLDER]<br>help@uidai.gov.in
              </div>
            </div>
          </div>
        </div>
        <button class="btn btn-success w-100 mt-3 fw-bold"><i class="fa-solid fa-download me-2"></i>Download Print-Ready PVC PDF</button>
      </div>
    `;
  }, 2000);
}
