const upload = document.getElementById("upload");
const preview = document.getElementById("preview");
const download = document.getElementById("download");
const widthInput = document.getElementById("width_cm");

// 팬 전체 18cm 기준 → 캔버스 고정 (웹용 픽셀, 예: 500px)
const panelCm = 18;
const canvasSize = 500;
const canvas = document.createElement("canvas");
canvas.width = canvasSize;
canvas.height = canvasSize;
const ctx = canvas.getContext("2d");

// 초기 검정 배경
ctx.fillStyle = "black";
ctx.fillRect(0, 0, canvasSize, canvasSize);

let originalImage = null;

// 이미지 업로드
upload.addEventListener("change", function() {
    const file = upload.files[0];
    if (!file) return;

    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = function() {
        originalImage = img;
        drawCanvas(parseFloat(widthInput.value) || 5);
    };
});

// 가로(cm) 입력 변경 시
widthInput.addEventListener("input", function() {
    if (originalImage) {
        drawCanvas(parseFloat(widthInput.value));
    }
});

// Canvas 그리기 함수
function drawCanvas(userCm) {
    if (!userCm || userCm <= 0 || userCm > panelCm) return;

    // 이미지 가로 비율 계산
    const ratio = userCm / panelCm; 
    const imgWidth = Math.round(canvasSize * ratio);
    const imgHeight = Math.round(imgWidth * (originalImage.height / originalImage.width));

    // 캔버스 초기화 + 검정 배경
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvasSize, canvasSize);

    // 이미지 중앙 배치
    const offsetX = Math.round((canvasSize - imgWidth) / 2);
    const offsetY = Math.round((canvasSize - imgHeight) / 2);
    ctx.drawImage(originalImage, offsetX, offsetY, imgWidth, imgHeight);

    // 미리보기 (PNG)
    preview.src = canvas.toDataURL("image/png");
}

// 다운로드 버튼 클릭 → JPG 강제 다운로드
download.addEventListener("click", function(e){
    e.preventDefault(); // 기본 이동 방지
    const jpgUrl = canvas.toDataURL("image/jpeg", 0.95); // JPG 95% 품질
    const a = document.createElement("a");
    a.href = jpgUrl;
    a.download = "resized.jpg";
    a.click();
});
