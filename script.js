// HTML 요소
const upload = document.getElementById("upload");
const preview = document.getElementById("preview");
const download = document.getElementById("download");
const widthInput = document.getElementById("width_cm");
const resizeBtn = document.getElementById("resizeBtn");

// 설정
const panelCm = 18;      // 팬 전체 가로(cm)
const canvasSize = 500;   // 캔버스 고정 크기(px)

// 캔버스 생성
const canvas = document.createElement("canvas");
canvas.width = canvasSize;
canvas.height = canvasSize;
const ctx = canvas.getContext("2d");

// 초기 검정 배경
ctx.fillStyle = "black";
ctx.fillRect(0, 0, canvasSize, canvasSize);

let originalImage = null;

// 이미지 업로드 이벤트
upload.addEventListener("change", () => {
    const file = upload.files[0];
    if (!file) return;

    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
        originalImage = img;
        drawCanvas(parseFloat(widthInput.value) || 5);
    };
});

// cm 입력 변경 이벤트
widthInput.addEventListener("input", () => {
    if (originalImage) drawCanvas(parseFloat(widthInput.value));
});

// 리사이즈 버튼 클릭 이벤트
resizeBtn.addEventListener("click", () => {
    if (!originalImage) {
        alert("이미지를 선택하세요");
        return;
    }
    drawCanvas(parseFloat(widthInput.value));
});

// 투명 여백 크롭 함수
function cropTransparentEdges(image) {
    const tmpCanvas = document.createElement("canvas");
    tmpCanvas.width = image.width;
    tmpCanvas.height = image.height;
    const tmpCtx = tmpCanvas.getContext("2d");
    tmpCtx.drawImage(image, 0, 0);

    const imgData = tmpCtx.getImageData(0, 0, tmpCanvas.width, tmpCanvas.height);
    const data = imgData.data;

    let minX = tmpCanvas.width, minY = tmpCanvas.height;
    let maxX = 0, maxY = 0;

    for (let y = 0; y < tmpCanvas.height; y++) {
        for (let x = 0; x < tmpCanvas.width; x++) {
            const idx = (y * tmpCanvas.width + x) * 4;
            const alpha = data[idx + 3];
            if (alpha > 0) {
                if (x < minX) minX = x;
                if (x > maxX) maxX = x;
                if (y < minY) minY = y;
                if (y > maxY) maxY = y;
            }
        }
    }

    // 모든 픽셀이 투명인 경우
    if (minX > maxX || minY > maxY) {
        return tmpCanvas; // 원본 반환
    }

    const croppedWidth = maxX - minX + 1;
    const croppedHeight = maxY - minY + 1;

    const croppedCanvas = document.createElement("canvas");
    croppedCanvas.width = croppedWidth;
    croppedCanvas.height = croppedHeight;
    const croppedCtx = croppedCanvas.getContext("2d");
    croppedCtx.drawImage(tmpCanvas, minX, minY, croppedWidth, croppedHeight, 0, 0, croppedWidth, croppedHeight);

    return croppedCanvas;
}

// 메인 캔버스 그리기
function drawCanvas(userCm) {
    if (!originalImage) return;

    // 기본값 적용
    if (!userCm || userCm <= 0 || userCm > panelCm) {
        userCm = 5;
        widthInput.value = 5;
    }

    // 투명 여백 제거
    const croppedCanvas = cropTransparentEdges(originalImage);

    // cm → 픽셀 비율
    const ratio = userCm / panelCm;
    const imgWidth = Math.round(croppedCanvas.width * ratio);
    const imgHeight = Math.round(croppedCanvas.height * ratio);

    // 캔버스 초기화 + 검정 배경
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvasSize, canvasSize);

    // 중앙 배치
    const offsetX = Math.round((canvasSize - imgWidth) / 2);
    const offsetY = Math.round((canvasSize - imgHeight) / 2);
    ctx.drawImage(croppedCanvas, 0, 0, croppedCanvas.width, croppedCanvas.height, offsetX, offsetY, imgWidth, imgHeight);

    // 미리보기 + 다운로드
    const dataUrl = canvas.toDataURL("image/png");
    preview.src = dataUrl;
    download.href = dataUrl;
    download.download = "resized.png";
}
