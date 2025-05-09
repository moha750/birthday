// العناصر الأساسية
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const image = new Image();

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

// تحديد الجنس من عنوان الصفحة
const currentGender = window.location.pathname.includes('female.html') ? 'female' : 'male';
const settings = GENDER_SETTINGS[currentGender];

// إعدادات النص
const TOP_TEXT_COLOR = settings.textColor;
const DATE_SETTINGS = {
    fontSize: 72,
    color: settings.dateColor,
    position: 0.89
};

// بيانات التطبيق
let topText = '';
let imageWidth, imageHeight;
let currentFontSize = 88;

// تحميل الصورة المناسبة
image.src = settings.image;
image.crossOrigin = "Anonymous"; // للتأكد من عدم وجود مشاكل CORS

// عناصر التحكم
const hueSlider = document.getElementById('hue');
const saturationSlider = document.getElementById('saturation');
const textInput = document.getElementById('text-input');
const textSizeSlider = document.getElementById('text-size');
const clearTextsBtn = document.getElementById('clear-texts');
const downloadBtn = document.getElementById('download');
const resetBtn = document.getElementById('reset-all');

// عناصر عرض القيم
const hueValue = document.getElementById('hue-value');
const saturationValue = document.getElementById('saturation-value');
const textSizeValue = document.getElementById('text-size-value');

// القيم الافتراضية
const DEFAULT_VALUES = {
    hue: 0,
    saturation: 100,
    textSize: 88,
    text: ''
};

// دالة إعادة الرسم
function redrawCanvas() {
    if (!image.complete) return; // لا ترسم إذا لم يتم تحميل الصورة
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // تطبيق الفلاتر على الصورة
    ctx.filter = `
        hue-rotate(${hueSlider.value}deg)
        saturate(${saturationSlider.value}%)
    `;
    ctx.drawImage(image, 0, 0);
    
    // تحديث قيم العناصر المنزلقة
    updateSliderValues();
    
    // تحديد المواضع الثابتة للنصوص
    const centerX = imageWidth / 2;
    const topTextY = imageHeight * 0.42;
    const dateY = imageHeight * DATE_SETTINGS.position;
    
    // رسم النص العلوي إذا موجود
    if (topText) {
        ctx.font = `${currentFontSize}px name`;
        ctx.fillStyle = TOP_TEXT_COLOR;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(topText, centerX, topTextY);
    }
    
    // رسم التاريخ الثابت
    const today = new Date();
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    const dateString = today.toLocaleDateString('EG', options);
    
    ctx.font = `${DATE_SETTINGS.fontSize}px date-font`;
    ctx.fillStyle = DATE_SETTINGS.color;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(dateString, centerX, dateY);
    
    ctx.filter = 'none';
}

// تحديث قيم العناصر المنزلقة
function updateSliderValues() {
    hueValue.textContent = `${hueSlider.value}°`;
    saturationValue.textContent = `${saturationSlider.value}%`;
    textSizeValue.textContent = `${textSizeSlider.value}px`;
}

// تحديث النص فور الكتابة
function updateText() {
    topText = textInput.value;
    redrawCanvas();
}

// مسح النصوص
function clearTexts() {
    textInput.value = '';
    topText = '';
    redrawCanvas();
}

// تغيير حجم النص
function updateTextSize() {
    currentFontSize = parseInt(textSizeSlider.value);
    redrawCanvas();
}

// تحميل الصورة
function downloadImage() {
    const fileName = topText ? `ميلاد ${topText}.png` : `صورة-مع-نص-${new Date().getTime()}.png`;
    const link = document.createElement('a');
    link.download = fileName;
    link.href = canvas.toDataURL('image/png');
    link.click();
}

// إعادة تعيين جميع الإعدادات
function resetAllSettings() {
    hueSlider.value = DEFAULT_VALUES.hue;
    saturationSlider.value = DEFAULT_VALUES.saturation;
    textSizeSlider.value = DEFAULT_VALUES.textSize;
    textInput.value = DEFAULT_VALUES.text;
    topText = DEFAULT_VALUES.text;
    currentFontSize = DEFAULT_VALUES.textSize;
    redrawCanvas();
}

// تحميل الصورة والخطوط
function initializeApp() {
    image.onload = function() {
        canvas.width = image.width;
        canvas.height = image.height;
        imageWidth = image.width;
        imageHeight = image.height;
        
        document.fonts.ready.then(() => {
            redrawCanvas();
        });
    };
    
    // استدعاء احتياطي في حال اكتمال تحميل الصورة مسبقاً
    if (image.complete) {
        canvas.width = image.width;
        canvas.height = image.height;
        imageWidth = image.width;
        imageHeight = image.height;
        document.fonts.ready.then(() => {
            redrawCanvas();
        });
    }
}

// إضافة Event Listeners
[hueSlider, saturationSlider].forEach(control => {
    control.addEventListener('input', redrawCanvas);
});

// زر العودة للخلف
document.getElementById('back-btn')?.addEventListener('click', () => {
    location.href = 'index.html';
});

textInput.addEventListener('input', updateText);
textSizeSlider.addEventListener('input', updateTextSize);
clearTextsBtn.addEventListener('click', clearTexts);
downloadBtn.addEventListener('click', downloadImage);
resetBtn.addEventListener('click', resetAllSettings);

// تهيئة التطبيق عند تحميل الصفحة
window.addEventListener('DOMContentLoaded', initializeApp);