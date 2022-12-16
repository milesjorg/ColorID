const imgCanvas = document.getElementById("imageCanvas");
let imgContext = imgCanvas.getContext("2d");

IMG_MAX_SIZE = 800;
imgCanvas.width = IMG_MAX_SIZE;
imgCanvas.height = IMG_MAX_SIZE;

const magnifierCanvas = document.getElementById("magnifierCanvas");
const magnifierContext = magnifierCanvas.getContext("2d");
const cursor = document.getElementById("cursor");

if (imgCanvas) {
  imgCanvas.addEventListener("dragenter", (event) => {
    event.preventDefault();
    imgCanvas.classList.add("active");
    imgCanvas.classList.remove("filled");
  });

  imgCanvas.addEventListener("dragleave", (event) => {
    event.preventDefault();
    imgCanvas.classList.remove("active");
  });

  imgCanvas.addEventListener("dragover", (event) => {
    event.preventDefault();
  });

  imgCanvas.addEventListener("drop", handleFile);
  imgCanvas.addEventListener("click", getRGB);
  imgCanvas.addEventListener("mousemove", magnify);
}

function handleFile(event) {
  event.preventDefault();
  imgCanvas.classList.remove("active");
  imgCanvas.classList.add("filled");

  imgCanvas.width = IMG_MAX_SIZE;
  imgCanvas.height = IMG_MAX_SIZE;

  imgContext = imgCanvas.getContext("2d");
  const img = new Image();
  img.src = URL.createObjectURL(event.dataTransfer.files[0]);

  img.onload = function () {
    clearContext(imgContext, imgCanvas.width, imgCanvas.height);
    W = img.width;
    H = img.height;

    if (W > H) {
      new_W = imgCanvas.width;
      new_H = (imgCanvas.height * H) / W;
    } else {
      new_H = imgCanvas.height;
      new_W = (imgCanvas.width * W) / H;
    }

    imgCanvas.width = new_W;
    imgCanvas.height = new_H;

    imgContext.drawImage(img, 0, 0, new_W, new_H);
    imgCanvas.style.backgroundColor = "#ffffff";
  };
}

function magnify(event) {
  const pos = getMousePos(event);
  let size = imgCanvas.width / 4;
  let magnification = 12;
  let radius = size / magnification;

  magnifierCanvas.width = 2 * size;
  magnifierCanvas.height = 2 * size;

  magnifierContext.drawImage(
    imgCanvas,
    pos.x - radius,
    pos.y - radius,
    2 * radius,
    2 * radius,
    0,
    0,
    2 * size,
    2 * size
  );

  let pattern = imgContext.createPattern(magnifierCanvas, "repeat");
  imgContext.fillStyle = pattern;

  magnifierContext.beginPath();
  magnifierContext.arc(magnifierContext.width / 2, magnifierContext.height / 2, 4, 0, 2 * Math.PI)
  magnifierContext.stroke();
  magnifierContext.fill();
}

// make method for magnifier to follow the mouse when over the image

function getRGB(event) {
  const pos = getMousePos(event);
  const data = imgContext.getImageData(pos.x, pos.y, 1, 1).data;
  console.log(data[0]);
  return {
    r: data[0],
    g: data[1],
    b: data[2],
  };
}

function getMousePos(event) {
  const rect = imgCanvas.getBoundingClientRect();
  return {
    x: event.clientX - Math.floor(rect.left),
    y: event.clientY - Math.floor(rect.top),
  };
}

function clearContext(context, width, height) {
  context.save();
  context.setTransform(1, 0, 0, 1, 0, 0);
  context.clearRect(0, 0, width, height);
  context.restore();
}