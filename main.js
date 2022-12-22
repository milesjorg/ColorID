const body = document.getElementById("main");

const imgCanvas = document.getElementById("imageCanvas");
let imgContext = imgCanvas.getContext("2d");

IMG_MAX_SIZE = window.innerHeight / 1.4;

imgCanvas.width = IMG_MAX_SIZE;
imgCanvas.height = IMG_MAX_SIZE;

const magnifierCanvas = document.getElementById("magnifierCanvas");
const magnifierContext = magnifierCanvas.getContext("2d");

const modalContainer = document.getElementById("modalContainer");
const slider = document.getElementById("slider");
const sliderValue = document.getElementById("sliderValue");

greet();

imgCanvas.addEventListener("dragenter", (event) => {
  event.preventDefault();
  imgCanvas.classList.remove("filled");
  imgCanvas.classList.add("active");
});

imgCanvas.addEventListener("dragleave", (event) => {
  event.preventDefault();
  imgCanvas.classList.remove("active");
});

imgCanvas.addEventListener("dragover", (event) => {
  event.preventDefault();
});

imgCanvas.addEventListener("drop", (event) => {
  event.preventDefault();
  imgCanvas.classList.remove("active");
  imgCanvas.classList.add("filled");
  handleFile(event);
  removeGreeting();
});

imgCanvas.addEventListener("click", (event) => {
  val = getRGBHex(event);
  createModal(val.rgb, val.hex);
});

imgCanvas.addEventListener("mousemove", (event) => {
  magnify(event);
  imgCanvas.style.cursor = "crosshair";
});

function handleFile(event) {
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
  };
}

function magnify(event) {
  const pos = getMousePos(event);
  let size = Math.floor(imgCanvas.height / 2);
  let magnification = slider.value;
  let radius = Math.floor(size / magnification);

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
  magnifierContext.arc(
    magnifierContext.width / 2,
    magnifierContext.height / 2,
    4,
    0,
    2 * Math.PI
  );
  magnifierContext.stroke();
  magnifierContext.fill();
}

// make method for magnifier to follow the mouse when over the image

function createModal(rgbVal, hexVal) {
  let newModal = document.createElement("div");

  newModal.innerHTML = "<p>RGB: (" + rgbVal + ")     HEX: " + hexVal + "</p>";
  newModal.id = "colorModal";
  newModal.style.backgroundColor = hexVal;
  modalContainer.prepend(newModal);
}

function getRGBHex(event) {
  const pos = getMousePos(event);
  const data = imgContext.getImageData(pos.x, pos.y, 1, 1).data;
  r = data[0];
  g = data[1];
  b = data[2];
  rgb = [r, g, b];

  return {
    rgb: rgb,
    hex: RGBToHex(r, g, b),
  };
}

function RGBToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function componentToHex(value) {
  const hex = value.toString(16);
  return hex.length == 1 ? "0" + hex.toUpperCase() : hex.toUpperCase();
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

function updateSliderValue() {
  sliderValue.innerHTML = "x" + slider.value;
}

function greet() {
  let greeting = document.createElement("p");

  greeting.innerHTML = "<p>Drag and drop your image here!</p>";
  greeting.id = "helperText";
  body.prepend(greeting);
}

function removeGreeting() {
  greeting = document.getElementById("helperText");
  greeting.remove();
}
