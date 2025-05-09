// العناصر الأساسية
const canvas = new fabric.Canvas('canvas', {
    backgroundColor: '#f0f0f0',
    preserveObjectStacking: true
  });
  
  // إعدادات لكل جنس
  const GENDER_SETTINGS = {
    male: {
      textColor: '#4e74aa',
      dateColor: '#4e74aa',
      image: 'images/male-bg.png'
    },
    female: {
      textColor: '#b82d6a',
      dateColor: '#b82d6a',
      image: 'images/female-bg.png'
    }
  };
  
  const currentGender = window.location.pathname.includes('female.html') ? 'female' : 'male';
  const settings = GENDER_SETTINGS[currentGender];
  
  // بيانات التطبيق
  let topTextObj = null;
  let dateTextObj = null;
  let bgImage = null;
  
  // تحميل الصورة
  fabric.Image.fromURL(settings.image, function(img) {
    bgImage = img;
    canvas.setWidth(img.width);
    canvas.setHeight(img.height);
    canvas.add(img);
    img.sendToBack();
    
    // إضافة النص التاريخي
    addDateText();
    
    // إعادة رسم العناصر
    canvas.renderAll();
  });
  
  // إضافة النص التاريخي
  function addDateText() {
    const today = new Date();
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    const dateString = today.toLocaleDateString('EG', options);
    
    dateTextObj = new fabric.Text(dateString, {
      left: canvas.width / 2,
      top: canvas.height * 0.89,
      originX: 'center',
      originY: 'center',
      fontSize: 72,
      fontFamily: 'date-font',
      fill: settings.dateColor,
      selectable: false
    });
    
    canvas.add(dateTextObj);
  }
  
  // تحديث النص العلوي
  function updateText() {
    const textInput = document.getElementById('text-input');
    const text = textInput.value;
    
    if (topTextObj) {
      canvas.remove(topTextObj);
    }
    
    if (text) {
      topTextObj = new fabric.Text(text, {
        left: canvas.width / 2,
        top: canvas.height * 0.42,
        originX: 'center',
        originY: 'center',
        fontSize: parseInt(document.getElementById('text-size').value),
        fontFamily: 'name',
        fill: settings.textColor,
        selectable: false
      });
      
      canvas.add(topTextObj);
    }
    
    applyFilters();
  }
  
  // تطبيق الفلاتر
  function applyFilters() {
    const hue = parseInt(document.getElementById('hue').value);
    const saturation = parseInt(document.getElementById('saturation').value);
    
    bgImage.filters = [
      new fabric.Image.filters.HueRotation({ rotation: hue / 360 }),
      new fabric.Image.filters.Saturation({ saturation: saturation / 100 })
    ];
    
    bgImage.applyFilters();
    canvas.renderAll();
  }
  
  // تحميل الصورة
  function downloadImage() {
    const link = document.createElement('a');
    const textInput = document.getElementById('text-input');
    const fileName = textInput.value ? `ميلاد ${textInput.value}.png` : `صورة-مع-نص-${new Date().getTime()}.png`;
    
    link.download = fileName;
    link.href = canvas.toDataURL({
      format: 'png',
      quality: 1
    });
    link.click();
  }
  
  // إضافة Event Listeners
  document.getElementById('hue').addEventListener('input', applyFilters);
  document.getElementById('saturation').addEventListener('input', applyFilters);
  document.getElementById('text-input').addEventListener('input', updateText);
  document.getElementById('text-size').addEventListener('input', updateText);
  document.getElementById('clear-texts').addEventListener('click', function() {
    document.getElementById('text-input').value = '';
    updateText();
  });
  document.getElementById('download').addEventListener('click', downloadImage);
  document.getElementById('reset-all').addEventListener('click', function() {
    document.getElementById('hue').value = 0;
    document.getElementById('saturation').value = 100;
    document.getElementById('text-input').value = '';
    document.getElementById('text-size').value = 88;
    applyFilters();
    updateText();
  });
  document.getElementById('back-btn')?.addEventListener('click', () => {
    location.href = 'index.html';
  });
  
  // تحديث قيم العناصر المنزلقة
  function updateSliderValues() {
    document.getElementById('hue-value').textContent = `${document.getElementById('hue').value}°`;
    document.getElementById('saturation-value').textContent = `${document.getElementById('saturation').value}%`;
    document.getElementById('text-size-value').textContent = `${document.getElementById('text-size').value}px`;
  }
  
  // تحديث القيم عند التغيير
  [hueSlider, saturationSlider, textSizeSlider].forEach(slider => {
    slider.addEventListener('input', updateSliderValues);
  });