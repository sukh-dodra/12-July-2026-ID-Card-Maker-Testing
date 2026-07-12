// ==================== UI & TABS SETUP ====================
document.getElementById('sidebar-nav').innerHTML = `
  <div class="px-4 py-3 border-bottom"><h5 class="text-primary fw-bold"><i class="fa-solid fa-id-card me-2"></i>ID Maker Pro</h5></div>
  <ul class="nav flex-column mt-3">
    <li class="nav-item"><a class="nav-link active" onclick="switchTab('passport')"><i class="fa-solid fa-camera me-2"></i>Passport Photo</a></li>
    <li class="nav-item"><a class="nav-link" onclick="switchTab('editor')"><i class="fa-solid fa-sliders me-2"></i>Photo Editor</a></li>
    <li class="nav-item"><a class="nav-link" onclick="switchTab('aadhaar')"><i class="fa-solid fa-print me-2"></i>Aadhaar Print</a></li>
    <li class="nav-item"><a class="nav-link" onclick="switchTab('idcard')"><i class="fa-solid fa-address-card me-2"></i>ID Card (Bulk)</a></li>
  </ul>
`;

document.getElementById('main-content-area').innerHTML = `
  <div id="tab-passport" class="tab-content">
    <div class="card p-4 shadow-sm border-0">
      <h4>Passport Size Photo Creator</h4>
      <p class="text-muted small">Select a photo to create a ready-to-print A4 PDF.</p>
      <input type="file" id="pass-file" class="form-control mb-3" accept="image/*">
      <select id="pass-count" class="form-select mb-3">
        <option value="30">30 Photos (A4)</option>
        <option value="42">42 Photos (A4)</option>
      </select>
      <button class="btn btn-primary w-100" onclick="generatePassport()"><i class="fa-solid fa-download me-2"></i>Download A4 Sheet</button>
    </div>
  </div>

  <div id="tab-editor" class="tab-content d-none">
    <div class="card p-4 shadow-sm border-0">
      <h4>Advanced Photo & Signature Editor</h4>
      <input type="file" id="edit-file" class="form-control mb-3" accept="image/*" onchange="initEditor(event)">
      <div class="row">
        <div class="col-md-7"><div style="max-height: 400px; background: #eee;"><img id="cropper-img" style="max-width: 100%;"></div></div>
        <div class="col-md-5">
          <label>Brightness: <input type="range" id="fl-bright" min="0" max="200" value="100" class="form-range"></label>
          <label>Contrast: <input type="range" id="fl-contrast" min="0" max="200" value="100" class="form-range"></label>
          <label>Saturation: <input type="range" id="fl-sat" min="0" max="200" value="100" class="form-range"></label>
          <hr>
          <div class="row g-2 mb-2">
            <div class="col"><input type="number" id="dim-w" class="form-control" placeholder="Width (px)"></div>
            <div class="col"><input type="number" id="dim-h" class="form-control" placeholder="Height (px)"></div>
          </div>
          <select id="target-kb" class="form-select mb-3">
             <option value="20">Max 20 KB (Signatures)</option>
             <option value="50" selected>Max 50 KB (Photos)</option>
             <option value="100">Max 100 KB</option>
             <option value="200">Max 200 KB</option>
             <option value="500">Max 500 KB</option>
          </select>
          <button class="btn btn-success w-100" onclick="processEditedImage()"><i class="fa-solid fa-save me-2"></i>Save Final Image</button>
        </div>
      </div>
    </div>
  </div>

  <div id="tab-aadhaar" class="tab-content d-none">
    <div class="card p-4 shadow-sm border-0">
      <h4>Aadhaar PDF to PVC (CR80)</h4>
      <p class="small text-muted">Upload original Aadhaar PDF. The system will auto-crop and generate 5 PVC cards on an A4 sheet.</p>
      <input type="password" id="aadhaar-pass" class="form-control mb-2" placeholder="PDF Password (e.g. SUKH1989)">
      <input type="file" id="aadhaar-file" class="form-control mb-3" accept="application/pdf">
      <button class="btn btn-danger w-100" onclick="processAadhaar()"><i class="fa-solid fa-id-badge me-2"></i>Convert to 5 PVCs/A4</button>
      <p id="aadhaar-status" class="mt-2 text-primary fw-bold"></p>
    </div>
  </div>

  <div id="tab-idcard" class="tab-content d-none">
    <div class="card p-4 shadow-sm border-0">
      <h4>Bulk ID Card Generator (Excel)</h4>
      <label>1. Upload ID Template (PNG/JPG):</label>
      <input type="file" id="id-template" class="form-control mb-3" accept="image/*">
      <label>2. Upload Excel Data (.xlsx):</label>
      <input type="file" id="id-excel" class="form-control mb-3" accept=".xlsx, .xls">
      <button class="btn btn-info w-100 text-white" onclick="generateBulkIDs()"><i class="fa-solid fa-users me-2"></i>Generate Bulk IDs</button>
    </div>
  </div>
`;

function switchTab(t) {
  document.querySelectorAll('.tab-content').forEach(e => e.classList.add('d-none'));
  document.querySelectorAll('.nav-link').forEach(e => e.classList.remove('active'));
  document.getElementById('tab-' + t).classList.remove('d-none');
  event.currentTarget.classList.add('active');
}

// ==================== 1. PASSPORT LOGIC ====================
async function generatePassport() {
  const file = document.getElementById('pass-file').files[0];
  const count = parseInt(document.getElementById('pass-count').value);
  if(!file) return alert("Please select a photo!");
  
  const img = new Image();
  img.src = URL.createObjectURL(file);
  img.onload = async () => {
    const canvas = document.createElement('canvas');
    canvas.width = 2480; canvas.height = 3508;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = "white"; ctx.fillRect(0,0, canvas.width, canvas.height);
    
    const pw = 413, ph = 531;
    let cols = 5, startX = 150, startY = 150, gapX = 40, gapY = 50;
    if(count === 42) { cols = 6; startX = 60; startY = 80; gapX = 30; gapY = 30; }
    
    for(let i=0; i<count; i++) {
      let x = startX + (i % cols) * (pw + gapX);
      let y = startY + Math.floor(i / cols) * (ph + gapY);
      ctx.drawImage(img, x, y, pw, ph);
      ctx.lineWidth = 3; ctx.strokeRect(x, y, pw, ph);
    }
    
    const pdfDoc = await PDFLib.PDFDocument.create();
    const page = pdfDoc.addPage([595.28, 841.89]);
    const pngImage = await pdfDoc.embedPng(canvas.toDataURL('image/png'));
    page.drawImage(pngImage, { x: 0, y: 0, width: 595.28, height: 841.89 });
    
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], {type: 'application/pdf'});
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `Passport_${count}.pdf`; a.click();
  };
}

// ==================== 2. PHOTO EDITOR LOGIC ====================
let cropper;
function initEditor(e) {
  const img = document.getElementById('cropper-img');
  img.src = URL.createObjectURL(e.target.files[0]);
  if(cropper) cropper.destroy();
  img.onload = () => {
    cropper = new Cropper(img, { viewMode: 1, crop(ev) {
      if(document.activeElement.id !== 'dim-w') document.getElementById('dim-w').value = Math.round(ev.detail.width);
      if(document.activeElement.id !== 'dim-h') document.getElementById('dim-h').value = Math.round(ev.detail.height);
    }});
  };
}

function processEditedImage() {
  if(!cropper) return alert("Please select a photo!");
  const w = parseInt(document.getElementById('dim-w').value) || 200;
  const h = parseInt(document.getElementById('dim-h').value) || 200;
  const targetKb = parseInt(document.getElementById('target-kb').value);
  const b = document.getElementById('fl-bright').value;
  const c = document.getElementById('fl-contrast').value;
  const s = document.getElementById('fl-sat').value;

  const croppedCanvas = cropper.getCroppedCanvas({width: w, height: h});
  const finalCanvas = document.createElement('canvas');
  finalCanvas.width = w; finalCanvas.height = h;
  const ctx = finalCanvas.getContext('2d');
  ctx.filter = `brightness(${b}%) contrast(${c}%) saturate(${s}%)`;
  ctx.drawImage(croppedCanvas, 0, 0, w, h);
  
  let quality = 1.0;
  let dataUrl = finalCanvas.toDataURL('image/jpeg', quality);
  while(Math.round(dataUrl.length * 3/4) > (targetKb * 1024) && quality > 0.1) {
    quality -= 0.05;
    dataUrl = finalCanvas.toDataURL('image/jpeg', quality);
  }
  
  const a = document.createElement('a'); a.href = dataUrl; a.download = `Edited_${targetKb}KB.jpg`; a.click();
}

// ==================== 3. AADHAAR TO PVC LOGIC ====================
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';

async function processAadhaar() {
  const file = document.getElementById('aadhaar-file').files[0];
  const pass = document.getElementById('aadhaar-pass').value;
  if(!file) return alert("Select Aadhaar PDF!");
  document.getElementById('aadhaar-status').innerText = "Processing... Please wait.";

  const fileReader = new FileReader();
  fileReader.onload = async function() {
    try {
      const typedarray = new Uint8Array(this.result);
      const pdf = await pdfjsLib.getDocument({data: typedarray, password: pass}).promise;
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({scale: 3.0});
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.height = viewport.height; canvas.width = viewport.width;
      await page.render({canvasContext: ctx, viewport: viewport}).promise;

      const cardHeight = viewport.height * 0.28; 
      const yStart = viewport.height * 0.65;
      const cardWidth = viewport.width * 0.42;
      
      const frontImg = getCroppedSection(canvas, viewport.width * 0.05, yStart, cardWidth, cardHeight);
      const backImg = getCroppedSection(canvas, viewport.width * 0.52, yStart, cardWidth, cardHeight);

      createPVCPDF(frontImg, backImg);
    } catch (e) {
      document.getElementById('aadhaar-status').innerText = "Error: Incorrect Password or Invalid PDF.";
    }
  };
  fileReader.readAsArrayBuffer(file);
}

function getCroppedSection(sourceCanvas, x, y, w, h) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  c.getContext('2d').drawImage(sourceCanvas, x, y, w, h, 0, 0, w, h);
  return c.toDataURL('image/jpeg', 1.0);
}

async function createPVCPDF(frontData, backData) {
  const pdfDoc = await PDFLib.PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]);
  const fImg = await pdfDoc.embedJpg(frontData);
  const bImg = await pdfDoc.embedJpg(backData);
  
  const cw = 243, ch = 153; 
  let yPos = 780 - ch;
  
  for(let i=0; i<5; i++) {
    page.drawImage(fImg, {x: 40, y: yPos, width: cw, height: ch});
    page.drawImage(bImg, {x: 300, y: yPos, width: cw, height: ch});
    page.drawRectangle({x: 40, y: yPos, width: cw, height: ch, borderColor: PDFLib.rgb(0,0,0), borderWidth: 1});
    page.drawRectangle({x: 300, y: yPos, width: cw, height: ch, borderColor: PDFLib.rgb(0,0,0), borderWidth: 1});
    yPos -= (ch + 10);
  }
  
  const pdfBytes = await pdfDoc.save();
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([pdfBytes], {type: 'application/pdf'}));
  a.download = 'Aadhaar_5_PVC_Print.pdf';
  a.click();
  document.getElementById('aadhaar-status').innerText = "Done! PDF downloaded.";
}

// ==================== 4. BULK ID CARD LOGIC ====================
function generateBulkIDs() {
  const tplFile = document.getElementById('id-template').files[0];
  const xlFile = document.getElementById('id-excel').files[0];
  if(!tplFile || !xlFile) return alert("Upload both Template and Excel!");
  
  const tplImg = new Image();
  tplImg.src = URL.createObjectURL(tplFile);
  tplImg.onload = () => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, {type: 'array'});
      const sheetName = workbook.SheetNames[0];
      const json = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
      
      if(json.length === 0) return alert("Excel sheet is empty!");
      
      const c = document.createElement('canvas');
      c.width = tplImg.width; c.height = tplImg.height;
      const ctx = c.getContext('2d');
      ctx.drawImage(tplImg, 0, 0);
      
      ctx.font = "bold 30px Arial"; ctx.fillStyle = "#000";
      ctx.fillText(json[0].Name || "No Name", 100, 200);
      ctx.font = "20px Arial";
      ctx.fillText(json[0].Desig || "No Desig", 100, 250);
      
      const a = document.createElement('a');
      a.href = c.toDataURL('image/jpeg');
      a.download = `Sample_ID_${json[0].Name || '1'}.jpg`;
      a.click();
      alert(`Sample card for ${json[0].Name || 'First User'} generated!`);
    };
    reader.readAsArrayBuffer(xlFile);
  };
}
