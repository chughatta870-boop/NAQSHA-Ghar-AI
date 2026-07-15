// CANVAS GLOBAL
const canvas = document.getElementById('planCanvas');
const ctx = canvas.getContext('2d');

// 1. DOWNLOAD PNG
document.getElementById('downloadBtn').addEventListener('click',()=>{
  const marla = document.getElementById('marla').value || "NA";
  const link = document.createElement('a');
  link.download = `NAQSHA-${marla}Marla.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
});

// 2. SHARE BUTTON - Web Share API with File
document.getElementById('shareBtn').addEventListener('click', async()=>{
  canvas.toBlob(async(blob)=>{
    if(!blob){alert('پہلے نقشہ بنائیں'); return;}
    
    const file = new File([blob], "NAQSHA.png", {type: "image/png"});
    
    // Check if device supports file sharing
    if(navigator.canShare && navigator.canShare({files:[file]})){
      try{
        await navigator.share({
          title: 'NAQSHA Ghar AI',
          text: 'میرا AI سے بنا ہوا گھر کا نقشہ',
          files: [file]
        });
      }catch(err){
        console.log('Share cancelled', err);
      }
    } else {
      // Fallback: Share as image link
      const url = canvas.toDataURL('image/png');
      if(navigator.share){
        await navigator.share({
          title: 'NAQSHA Ghar AI',
          text: 'میرا AI سے بنا ہوا گھر کا نقشہ دیکھیں',
          url: url
        });
      } else {
        alert('آپ کا فون ڈائریکٹ شیئر سپورٹ نہیں کرتا۔ PNG ڈاؤنلوڈ کر کے شیئر کریں');
      }
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
