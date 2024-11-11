const videoP = document.querySelector(".player");
const canvas = document.querySelector(".photo");
const ctx = canvas.getContext("2d");
const strip = document.querySelector(".strip");
const snap = document.querySelector(".snap");

const constraints = { video: true, audio: false };

function getVideo() {
  navigator.mediaDevices
    .getUserMedia(constraints)
    .then((mediaStream) => {
      console.log(mediaStream);
      videoP.srcObject = mediaStream;
      videoP.play();
    })
    .catch((err) => {
      console.error(err.message);
    });
}

function drawVideo() {
  const width = videoP.videoWidth;
  const height = videoP.videoHeight;
  console.log(width, height, videoP);
  canvas.width = width;
  canvas.height = height;

  return setInterval(() => {
    ctx.drawImage(videoP, 0, 0, width, height);
    let pixels = ctx.getImageData(0, 0, width, height);
    //  red screen
    // pixels = redEffect(pixels);
    //  rgbsplit colors
    pixels = rgbSplit(pixels);
    ctx.putImageData(pixels, 0, 0);
  }, 16);
}
function takePhoto() {
  snap.currentTime = 0;
  snap.play();

  const data = canvas.toDataURL("image/jpeg");
  const link = document.createElement("a");
  link.href = data;
  link.setAttribute("download", "beauty");
  link.innerHTML = `<img src="${data}" alt='its image of u'>`;
  strip.insertBefore(link, strip.firstChild);
}
function redEffect(pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i + 0] = pixels.data[i + 0] + 100;
    pixels.data[i + 1] = pixels.data[i + 0] - 50;
    pixels.data[i + 2] = pixels.data[i + 0] * 0.5;
  }
  return pixels;
}

function rgbSplit(pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i - 100] = pixels.data[i + 0];
    pixels.data[i + 500] = pixels.data[i + 0];
    pixels.data[i - 500] = pixels.data[i + 0];
  }
  return pixels;
}
// function greenScreen(pixels) {
//   const levels = {};

//   document.querySelectorAll('.rgb input').forEach((input) => {
//     levels[input.name] = input.value;
//   });

//   for (i = 0; i < pixels.data.length; i = i + 4) {
//     red = pixels.data[i + 0];
//     green = pixels.data[i + 1];
//     blue = pixels.data[i + 2];
//     alpha = pixels.data[i + 3];

//     if (red >= levels.rmin
//       && green >= levels.gmin
//       && blue >= levels.bmin
//       && red <= levels.rmax
//       && green <= levels.gmax
//       && blue <= levels.bmax) {
//       // take it out!
//       pixels.data[i + 3] = 0;
//     }
//   }

//   return pixels;
// }
getVideo();
videoP.addEventListener("canlay", drawVideo);
