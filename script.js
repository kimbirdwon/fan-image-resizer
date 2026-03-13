const upload = document.getElementById("upload");
const widthInput = document.getElementById("width_cm");
const resizeBtn = document.getElementById("resizeBtn");
const preview = document.getElementById("preview");
const download = document.getElementById("download");

const panelCm = 18;
const canvasSize = 500;
const canvas = document.createElement("canvas");
canvas.width = canvasSize;
canvas.height = canvasSize;
const ctx = canvas.getContext("2d");

ctx.fillStyle = "black";
ctx.fillRect(0, 0, canvasSize, canvasSize);

let originalImage = null;

// 업로드 시
upload.addEventListener("change", () => {
    const file = upload.files[0];
    if (!file) return;

    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
        originalImage = img;
        // 업로드 후 바로 미리보기 표시
        const cropped = cropTransparentEdges(originalImage);
        preview.src = cropped.toDataURL("image/png");
    };
});

// 리사이즈 버튼 클릭
resizeBtn.addEventListener("click", () => {
    if (!originalImage) { alert("이미지를 선택하세요"); return; }
    drawCanvas(parseFloat(widthInput.value));
});

// 투명 크롭
function cropTransparentEdges(image) {
    const tmpCanvas = document.createElement("canvas");
    tmpCanvas.width = image.width;
    tmpCanvas.height = image.height;
    const tmpCtx = tmpCanvas.getContext("2d");
    tmpCtx.drawImage(image, 0, 0);

    const data = tmpCtx.getImageData(0, 0, tmpCanvas.width, tmpCanvas.height).data;
    let minX = tmpCanvas.width, minY = tmpCanvas.height;
    let maxX = 0, maxY = 0;

    for (let y = 0; y < tmpCanvas.height; y++) {
        for (let x = 0; x < tmpCanvas.width; x++) {
            const alpha = data[(y * tmpCanvas.width + x) * 4 + 3];
            if (alpha > 0) {
                if (x < minX) minX = x;
                if (x > maxX) maxX = x;
                if (y < minY) minY = y;
                if (y > maxY) maxY = y;
            }
        }
    }

    if (minX > maxX || minY > maxY) return tmpCanvas;

    const w = maxX - minX + 1;
    const h = maxY - minY + 1;
    const croppedCanvas = document.createElement("canvas");
    croppedCanvas.width = w;
    croppedCanvas.height = h;
    const croppedCtx = croppedCanvas.getContext("2d");
    croppedCtx.drawImage(tmpCanvas, minX, minY, w, h, 0, 0, w, h);
    return croppedCanvas;
}

// 메인 그리기
function drawCanvas(userCm) {
    if (!originalImage) return;
    if (!userCm || userCm <= 0 || userCm > panelCm) userCm = 5;

    const cropped = cropTransparentEdges(originalImage);
    const ratio = userCm / panelCm;
    const imgWidth = Math.round(cropped.width * ratio);
    const imgHeight = Math.round(cropped.height * ratio);

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvasSize, canvasSize);

    const offsetX = Math.round((canvasSize - imgWidth) / 2);
    const offsetY = Math.round((canvasSize - imgHeight) / 2);
    ctx.drawImage(cropped, 0, 0, cropped.width, cropped.height, offsetX, offsetY, imgWidth, imgHeight);

    const dataUrl = canvas.toDataURL("image/png");
    preview.src = dataUrl;
    download.href = dataUrl;
    download.download = "resized.png";
}
