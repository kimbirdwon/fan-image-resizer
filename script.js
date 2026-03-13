const upload = document.getElementById("upload")
const resizeBtn = document.getElementById("resizeBtn")
const preview = document.getElementById("preview")
const download = document.getElementById("download")
const widthInput = document.getElementById("width_cm")

let originalImage = null
let originalWidth = 0
let originalHeight = 0
let aspectRatio = 1
const panelCm = 18

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
        widthInput.value = 5
        drawCanvas(5)
    }
})

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

function drawCanvas(userCm) {
    const ratio = userCm / panelCm
    const imgWidth = Math.round(originalWidth * ratio)
    const imgHeight = Math.round(imgWidth / aspectRatio)

    // 정사각형 Canvas: 이미지 최대 크기 기준 + 여백
    const padding = 20
    const canvasSize = Math.max(imgWidth, imgHeight) + padding * 2

    const canvas = document.createElement("canvas")
    canvas.width = canvasSize
    canvas.height = canvasSize

    const ctx = canvas.getContext("2d")

    // 1️⃣ 배경 검정색
    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, canvasSize, canvasSize)

    // 2️⃣ 이미지 중앙에 배치
    const offsetX = Math.round((canvasSize - imgWidth) / 2)
    const offsetY = Math.round((canvasSize - imgHeight) / 2)
    ctx.drawImage(originalImage, offsetX, offsetY, imgWidth, imgHeight)

    // 3️⃣ 미리보기 & 다운로드
    preview.src = canvas.toDataURL("image/png")
    download.href = canvas.toDataURL("image/png")
    download.download = "resized.png"
}
