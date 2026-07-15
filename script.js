// ========= 1. GLOBAL VARIABLES =========
const canvas = document.getElementById('planCanvas');
const ctx = canvas.getContext('2d');

// ========= 2. PWA INSTALL BUTTON =========
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

// ========= 3. GENERATE BUTTON LISTENER =========
document.getElementById('generateBtn').addEventListener('click', generatePlan);

// ========= 4. MAIN AI FUNCTION =========
function generatePlan(){
  const marla = parseFloat(document.getElementById('marla').value);
  const len = parseInt(document.getElementById('length').value);
  const wid = parseInt(document.getElementById('width').value);
  const stories = parseInt(document.getElementById('stories').value);
  const attachBath = document.getElementById('attachBath').checked;
  
  if(!marla || !len || !wid){
    alert('برائے مہربانی تمام فیلڈ پُر کریں');
    return
  }

  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle="#FFFDF5"; 
  ctx.fillRect(0,0,600,800);
  
  // Scale to fit canvas
  const scale = 450/Math.max(len,wid);
  const w = wid*scale; 
  const h = len*scale;
  const x = (600-w)/2; 
  const y = 100;
  
  // FLOOR HEIGHT
  const floorHeight = h / stories;
  
  for(let floor = 0; floor < stories; floor++){
    let fy = y + floor * floorHeight;
    
    // 1. OUTER WALL FOR EACH FLOOR
    ctx.strokeStyle="#000"; 
    ctx.lineWidth=4; 
    ctx.strokeRect(x,fy,w,floorHeight);
    
    // FLOOR LABEL
    ctx.fillStyle="#1B5E20";
    ctx.font="bold 14px Noto Nastaliq Urdu";
    ctx.textAlign="center";
    let floorName = floor === 0 ? "گراؤنڈ فلور" : floor === 1 ? "پہلی منزل" : "دوسری منزل";
    ctx.fillText(floorName, x+w/2, fy-10);
    
    // 2. AI ROOM LOGIC
    ctx.strokeStyle="#333"; 
    ctx.lineWidth=1.5;
    ctx.fillStyle="#000";
    ctx.font="11px Noto Nastaliq Urdu";
    ctx.textAlign="center";
    
    // STAIRS
    if(stories > 1 && floor < stories - 1){
      ctx.fillStyle="#E0E0E0";
      ctx.fillRect(x+10, fy+10, 50, 50);
      ctx.strokeRect(x+10, fy+10, 50, 50);
      ctx.fillStyle="#000";
      ctx.font="9px Noto Nastaliq Urdu";
      ctx.fillText("سیڑھیاں", x+35, fy+35);
      ctx.font="11px Noto Nastaliq Urdu";
    }
    
    let roomW = w/2;
    let roomH = floorHeight/2;
    // Divide in 4
    ctx.beginPath(); ctx.moveTo(x+roomW,fy); ctx.lineTo(x+roomW,fy+floorHeight); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x,fy+roomH); ctx.lineTo(x+w,fy+roomH); ctx.stroke();
    
    // GROUND FLOOR LOGIC
    if(floor === 0){
      ctx.fillText("ڈرائنگ روم", x+roomW/2, fy+roomH/2);
      ctx.fillText("کچن", x+roomW + roomW/2, fy+roomH/2);
      ctx.fillText("مہمان بیڈ", x+roomW/2, fy+roomH + roomH/2);
      ctx.fillText("TV لاؤنج", x+roomW + roomW/2, fy+roomH + roomH/2);
      
      // Main Door
      ctx.lineWidth=3; 
      ctx.beginPath(); ctx.moveTo(x+w/2-20,fy); ctx.lineTo(x+w/2+20,fy); ctx.stroke();
      ctx.font="10px Arial"; ctx.fillText("Door", x+w/2, fy-5);
      ctx.font="11px Noto Nastaliq Urdu";
      
      // Guest Washroom
      if(attachBath){
        ctx.strokeRect(x+w-60, fy+floorHeight-60, 50, 50);
        ctx.fillText("واش روم", x+w-35, fy+floorHeight-35);
      }
    }
    
    // UPPER FLOOR LOGIC
    if(floor >= 1){
      ctx.fillText("بیڈ روم 1", x+roomW/2, fy+roomH/2);
      ctx.fillText("بیڈ روم 2", x+roomW + roomW/2, fy+roomH/2);
      ctx.fillText("بیڈ روم 3", x+roomW/2, fy+roomH + roomH/2);
      ctx.fillText("فیملی لاؤنج", x+roomW + roomW/2, fy+roomH + roomH/2);
      
      // Attached Bath
      if(attachBath){
        ctx.strokeRect(x+roomW-40, fy+roomH-30, 30, 25);
        ctx.font="9px Noto Nastaliq Urdu";
        ctx.fillText("باتھ", x+roomW-25, fy+roomH-15);
        
        ctx.strokeRect(x+w-40, fy+roomH-30, 30, 25);
        ctx.fillText("باتھ", x+w-25, fy+roomH-15);
        ctx.font="11px Noto Nastaliq Urdu";
      }
    }
  }
  
  // 3. MAIN LABELS
  ctx.fillStyle="#000"; 
  ctx.font="16px Noto Nastaliq Urdu";
  ctx.textAlign="center";
  ctx.fillText(`${len} x ${wid} فٹ - ${marla} مرلہ`, x+w/2, y-25);
  ctx.fillText(`${stories} منزلہ مکان`, x+w/2, y + h + 30);
  
  // 4. WATERMARK
  ctx.fillStyle="rgba(0,0,0,0.1)"; 
  ctx.font="20px Arial";
  ctx.fillText("M Ijaz", 500, 780);
}

// ========= 5. DOWNLOAD PNG =========
document.getElementById('downloadBtn').addEventListener('click',()=>{
  const marla = document.getElementById('marla').value || "NA";
  const link = document.createElement('a');
  link.download = `NAQSHA-${marla}Marla.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
});

// ========= 6. SHARE BUTTON =========
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

// ========= 7. SAVE TO GALLERY =========
document.getElementById('saveBtn').addEventListener('click',()=>{
  const marla = document.getElementById('marla').value || "NA";
  const link = document.createElement('a');
  link.download = `NAQSHA-${marla}Marla.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
  alert('نقشہ گیلری/Downloads میں Save ہو گیا ✅');
});

// ========= 8. SERVICE WORKER REGISTER =========
if('serviceWorker' in navigator){
  window.addEventListener('load',()=>{
    navigator.serviceWorker.register('./sw.js')
  })
}
