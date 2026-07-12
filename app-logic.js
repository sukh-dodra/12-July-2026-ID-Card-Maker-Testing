// 1. ਐਪ ਦਾ ਇੰਟਰਫੇਸ ਲੋਡ ਕਰਨਾ
document.getElementById('app-root').innerHTML = `
  <div class="card p-4">
    <h5>Upload Aadhaar/Photo to Process</h5>
    <input type="file" id="client-file" class="form-control my-3">
    <button class="btn btn-success" onclick="startProcessing()">Process & Print</button>
  </div>
`;

// 2. ਫੋਟੋ ਜਾਂ ਆਧਾਰ ਕਾਰਡ ਪ੍ਰੋਸੈਸ ਕਰਨ ਦਾ ਫੰਕਸ਼ਨ
function startProcessing() {
  alert("Processing your card via secure server...");
  // ਇੱਥੋਂ ਗੂਗਲ ਸਕ੍ਰਿਪਟ ਦੇ ਬੈਕਐਂਡ ਫੰਕਸ਼ਨ ਨੂੰ ਕਾਲ ਜਾਵੇਗੀ
  google.script.run.withSuccessHandler(function(output) {
     alert("Done! Your PVC PDF is ready.");
  }).processCardOnServer("base64_data_here", "password");
}
