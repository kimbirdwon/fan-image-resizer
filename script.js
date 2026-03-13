const upload = document.getElementById("upload")
const resizeBtn = document.getElementById("resizeBtn")
const preview = document.getElementById("preview")
const download = document.getElementById("download")
const widthInput = document.getElementById("width_cm")

let originalImage = null
let originalWidth = 0
let originalHeight = 0
let aspectRatio = 1

// 팬 실제 가로(cm)
const panelCm = 18

// 이미지 업로드 처리
upload.addEventListener("change", function() {
    const file = upload.files[0]
    if (!file) return

    const img = new Image()
    img.src = URL.createObjectURL(file)
    img.onload = function() {
        originalImage = img
        originalWidth = img.width
        originalHeight = img.height
        aspectRatio = originalWidth / originalHeight

        // 초기값
        widthInput.value = 5  // 기본 5cm
        drawCanvas(5)          // 기본 5cm로 미리보기
    }
})

// 리사이즈 버튼 클릭
resizeBtn.addEventListener("click", function() {
    if (!originalImage) {
        alert("이미지를 먼저 선택해주세요")
        return
    }

    const userCm = parseFloat(widthInput.value)
    if (isNaN(userCm) || userCm <= 0 || userCm > panelCm) {
        alert(`1~${panelCm}cm 사이로 입력해주세요`)
        return
    }

    drawCanvas(userCm)
})

// Canvas 그리는 함수
function drawCanvas(userCm) {
    const ratio = userCm / panelCm
    const newWidthPx = Math.round(originalWidth * ratio)
    const newHeightPx = Math.round(newWidthPx / aspectRatio)

    // 정사각형 Canvas 크기
    const size = Math.max(newWidthPx, newHeightPx)
    const canvas = document.createElement("canvas")
    canvas.width = size
    canvas.height = size

    const ctx = canvas.getContext("2d")

    // 배경 검정색
    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, size, size)

    // 이미지 중앙 배치
    const offsetX = Math.round((size - newWidthPx) / 2)
    const offsetY = Math.round((size - newHeightPx) / 2)
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = "high"
    ctx.drawImage(originalImage, offsetX, offsetY, newWidthPx, newHeightPx)

    // 미리보기 & 다운로드
    const resizedImage = canvas.toDataURL("image/png")
    preview.src = resizedImage
    download.href = resizedImage
    download.download = "resized.png"
}
