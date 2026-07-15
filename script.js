// GLOBAL VARIABLES
const canvas = document.getElementById('planCanvas');
const ctx = canvas.getContext('2d');

// PWA INSTALL
let deferredPrompt; 
const installBtn = document.getElementById('installBtn');
window.addEventListener('beforeinstallprompt', e=>{
  e.preventDefault();
  deferredPrompt=e;
  installBtn.style.display='block'
});
installBtn.addEventListener('click', async()=>{
  if(deferredPrompt){
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt=null;
    installBtn.style.display='none'
  }
});

// GENERATE PLAN
document.getElementById('generateBtn').addEventListener('click', generatePlan);

function generatePlan(){
  const marla = parseFloat(document.getElementById('marla').value);
  const len = parseInt(document.getElementById('length').value);
  const wid = parseInt(document.getElementById('width').value);
  const stories = document.getElementById('stories').value;
  const attachBath = document.getElementById('attachBath').checked;
  
  if(!marla || !len || !wid){
    alert('برائے مہربانی تمام فیلڈ پُر کریں');
    return
  }

  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle="#FFFDF5"; 
  ctx.fillRect(0,0,600,800);
  
  // Scale to fit canvas
  const scale = 500/Math.max(len,wid);
  const w = wid*scale; 
  const h = len*scale;
  const x = (600-w)/2; 
  const y = 80;
  
  // Outer Wall
  ctx.strokeStyle="#000"; 
  ctx.lineWidth=4; 
  ctx.strokeRect(x,y,w,h);
  
  // AI Room Division Logic
  let rooms = marla <= 5 ? 2 : marla <= 10 ? 3 : 4;
  let roomH = h/rooms;
  for(let i=1;i<rooms;i++){
    ctx.lineWidth=2; 
    ctx.beginPath(); 
    ctx.moveTo(x,y+i*roomH); 
    ctx.lineTo(x+w,y+i*roomH); 
    ctx.stroke();
  }
  
  // Door
  ctx.lineWidth=3; 
  ctx.beginPath(); 
  ctx.moveTo(x+w/2-15,y); 
  ctx.lineTo(x+w/2+15,y); 
  ctx.stroke();
  
  // Bath
  if(attachBath){
    ctx.strokeRect(x+w-60, y+h-60, 50, 50);
    ctx.font="12px Noto Nastaliq Urdu";
    ctx.fillText("باتھ", x+w-55, y+h-35);
  }
  
  // Labels
  ctx.fillStyle="#000"; 
  ctx.font="16px Noto Nastaliq Urdu";
  ctx.fillText(`${len} x ${wid} فٹ`, x+w/2-40, y-10);
  ctx.fillText(`${marla} مرلہ - ${stories} منزل`, x+w/2-60, y+h+25);
  
  // Watermark M Ijaz
  ctx.fillStyle="rgba(0,0,0,0.1)"; 
  ctx.font="24px Arial";
  ctx.fillText("M Ijaz", 450, 780);
}

// 1. DOWNLOAD PNG
document.getElementById('downloadBtn').addEventListener('click',()=>{
  const marla = document.getElementById('marla').value || "NA";
  const link = document.createElement('a');
  link.download = `NAQSHA-${marla}Marla.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
});

// 2. SHARE BUTTON
document.getElementById('shareBtn').addEventListener('click', async()=>{
  canvas.toBlob(async(blob)=>{
    if(!blob){alert('پہلے نقشہ بنائیں'); return;}
    const file = new File([blob], "NAQSHA.png", {type: "image/png"});
    if(navigator.canShare && navigator.canShare({files:[file]})){
      await navigator.share({
        title: 'NAQSHA Ghar AI',
        text: 'میرا AI سے بنا ہوا گھر کا نقشہ',
        files: [file]
      });
    } else {
      alert('آپ کا فون ڈائریکٹ شیئر سپورٹ نہیں کرتا۔ PNG ڈاؤنلوڈ کر کے شیئر کریں');
    }
  });
});

// 3. SAVE TO GALLERY
document.getElementById('saveBtn').addEventListener('click',()=>{
  const marla = document.getElementById('marla').value || "NA";
  const link = document.createElement('a');
  link.download = `NAQSHA-${marla}Marla.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
  alert('نقشہ گیلری/Downloads میں Save ہو گیا ✅');
});

// SW Register
if('serviceWorker' in navigator){
  window.addEventListener('load',()=>{
    navigator.serviceWorker.register('./sw.js')
  })
      }
