const upload = document.getElementById("upload");
const preview = document.getElementById("preview");
const download = document.getElementById("download");
const widthInput = document.getElementById("width_cm");

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
    if (originalImage) drawCanvas(parseFloat(widthInput.value));
});

// Canvas 그리기 함수 (미리보기)
function drawCanvas(userCm) {
    if (!userCm || userCm <= 0 || userCm > panelCm) return;

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

    // 미리보기
    preview.src = canvas.toDataURL("image/png");

    // 다운로드 (PNG)
    download.href = canvas.toDataURL("image/png");
    download.download = "resized.png";
});
