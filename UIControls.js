////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////// Global definitions
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//let testRange = document.getElementById("frequencySlider");

//const delayFeedbackSlider = document.getElementById("delayFeedbackInput");

//const volumeFeebackDisplay = document.getElementById("volumeFeedback");

const decaySlider = document.getElementById("reverbDecay");
const reverbIcon = document.getElementById("reverbIcon");

document
  .getElementById("btnPlay")
  ?.addEventListener("click", playConstellationPath);
document
  .getElementById("btnClear")
  ?.addEventListener("click", clearConstellationPath);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////// Intro Modal popup
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/* find modal */
let introModal = document.getElementById("introDialog");
/* to get the backdrop working we need to open the modal with js */
document.getElementById("introDialog").showModal();
/* find modal close button and add an eventlistener */
document.getElementById("dialogCloseButton").addEventListener("click", () => {
  introModal.close();
});
/* finally we want to initialize the synthesizer when the modal is closed */
/* because this can be through the above button, or by pressing esc, we tie it to the actual close event */
/* the referenced toneInit function is defined in toneSetup.js */
introModal.addEventListener("close", toneInit);

//////Update Reverb Icon based on wet value////////
function updateSliderVisual(slider) {
  const val = parseFloat(slider.value);
  changeReverbDecay(val);

  const percent = (val - slider.min) / (slider.max - slider.min);

  reverbIcon.style.fontSize = 20 + percent * 20 + "px";

  const blueValue = Math.floor(150 + percent * 105); // 150~255
  reverbIcon.style.color = `rgb(0, ${blueValue}, 255)`;
}

decaySlider.addEventListener("input", (e) => updateSliderVisual(e.target));

updateSliderVisual(decaySlider);

/////////////Project Logic ///////////
// ===== Constellation: collect notes & points, preview on click, play on demand =====
let constellationNotes = [];
let constellationPoints = [];

const STEP_SEC = 0.4;

function previewNote(note) {
  if (!note) return;

  polySynth.triggerAttackRelease(note, "8n");
}

function centerInCanvas(el, canvas) {
  const r = el.getBoundingClientRect();
  const cr = canvas.getBoundingClientRect();
  return {
    x: r.left + r.width / 2 - cr.left,
    y: r.top + r.height / 2 - cr.top,
  };
}

function addStarToPath(el) {
  const note = el.dataset.note;
  previewNote(note);
  constellationNotes.push(note);

  const pt = centerInCanvas(el, canvas);
  constellationPoints.push(pt);
  drawConstellation();
}

//Play the constellation path using Math.random for slight variations
function playConstellationPath() {
  if (constellationNotes.length === 0) return;
  const start = Tone.now() + 0.1;
  constellationNotes.forEach((n, i) => {
    const velocity = 0.5 + Math.random() * 0.5;
    const time = start + i * STEP_SEC + Math.random() * 0.05;

    polySynth.triggerAttackRelease(n, "8n", time, velocity);
  });

  const hue = Math.floor(Math.random() * 360);
  document.body.style.background = `radial-gradient(circle at 50% 20%, hsl(${hue} 35% 12%) 0%, hsl(${hue} 40% 7%) 60%)`;
}

function clearConstellationPath() {
  constellationNotes = [];
  constellationPoints = [];
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////// Oscillator Functions
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
let acceptedOscTypes = ["fatsine", "fatsquare", "fatsawtooth", "fattriangle"];

function changeOscillatorType(newOscType) {
  /* check to see if parameter matches one of the accepted types in the above array */
  if (acceptedOscTypes.includes(newOscType)) {
    polySynth.set({
      oscillator: { type: newOscType },
    });
  }
}

function changeDetuneSpread(newSpreadAmt) {
  /* make sure parameter is an int : note this rounds DOWN */
  let roundedSpread = Math.floor(newSpreadAmt);
  polySynth.set({
    oscillator: {
      spread: roundedSpread,
    },
  });
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////// Amp Functions
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function changeAmpAttack(newAttack) {
  polySynth.set({
    envelope: {
      attack: newAttack,
    },
  });
}
function changeAmpDecay(newDecay) {
  polySynth.set({
    envelope: {
      decay: newDecay,
    },
  });
}
function changeAmpSustain(newSustain) {
  polySynth.set({
    envelope: {
      sustain: newSustain,
    },
  });
}
function changeAmpRelease(newRelease) {
  polySynth.set({
    envelope: {
      release: newRelease,
    },
  });
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////// Distortion Functions
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function changeDistortionAmount(newDistAmt) {
  /* check to see if parameter within expected range */
  if (newDistAmt >= 0 && newDistAmt < 1) {
    distortion.set({ distortion: newDistAmt });
  }
}

function toggleDistortion(distortionOn) {
  if (distortionOn) {
    distortion.wet.value = 1;
  } else {
    distortion.wet.value = 0;
  }
}

/* set initial amount and bypass it */
changeDistortionAmount(0.9);
toggleDistortion(false);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////// Reverb Functions
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function changeReverbDecay(newVerbDecayAmt) {
  reverb.set({ decay: newVerbDecayAmt });
}

function toggleReverb(verbOn) {
  if (verbOn) {
    reverb.wet.value = 1;
  } else {
    reverb.wet.value = 0;
  }
}

/* set initial amount and bypass it */
changeReverbDecay(2);
toggleReverb(false);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////// Filter Functions
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
let acceptedFilterTypes = ["lowpass", "highpass", "bandpass", "notch"];

function changeFilterType(newFilterType) {
  /* check to see if parameter matches one of the accepted types in the above array */
  if (acceptedFilterTypes.includes(newFilterType)) {
    filter.set({
      type: newFilterType,
    });
  }
}

function changeFilterFreq(newFilterFreq) {
  /* check to see if parameter within expected range */
  if (newFilterFreq >= 0 && newFilterFreq < 20000) {
    filter.frequency.value = newFilterFreq;
  }
}

function changeFilterQ(newFilterQ) {
  /* check to see if parameter within expected range */
  if (newFilterQ >= 0 && newFilterQ < 20) {
    filter.Q.value = newFilterQ;
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////// Delay Functions
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// function changeDelayFeedback(newFeedbackAmt) {
//   delay.feedback.value = newFeedbackAmt;
// }

// delayFeedbackSlider.addEventListener("change", (e) => {
//   let inputValue = e.target.value;
//   changeDelayFeedback(inputValue);
// });

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////// Meter Feedback
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

document.body.style.backgroundColor = "#222532ff";
let bgActive = false;

const starCells = document.querySelectorAll(".cell");
starCells.forEach((el) => {
  el.addEventListener(
    "pointerdown",
    () => {
      bgActive = true;
    },
    { once: true }
  );
});

// function findCurrentVolume() {
//   let currentVolume = meter.getValue();

//   if (!bgActive) return;

//   let clampedValue = clamp(currentVolume, -80, 0);
//   let remappedValue = remapRange(clampedValue, -80, 0, 0, 1);
//   volumeFeebackDisplay.textContent = remappedValue;
//   //console.log(clampedValue);
//   // document.body.style.backgroundColor = `color-mix(in hsl,red, blue ${remappedValue}%)`;
//   //const hue = Math.round(remappedValue * 360);
//   //  const hue2 = (hue + 60) % 360;
//   // document.body.style.backgroundImage = `linear-gradient(135deg, hsl(${hue} 80% 50%), hsl(${hue2} 80% 50%))`;
// }
// setInterval(findCurrentVolume, 200);

//volumeFeebackDisplay

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////// Connections
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// testRange.addEventListener("input", (e) => {
//   let rangeValue = e.target.value;
//   changeFilterFreq(rangeValue);
// });

///////////////////////////////////////////////
///////////Draw lines
//////////////////////////////////////////

const canvas = document.getElementById("starCanvas");
const ctx = canvas.getContext("2d");

//let constellationPoints = [];

function resizeCanvas() {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

document.querySelectorAll(".cell.star").forEach((cell) => {
  cell.addEventListener("pointerdown", () => {
    addStarToPath(cell);
  });
});

function drawConstellation() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "rgba(251, 215, 107, 0.8)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let i = 0; i < constellationPoints.length; i++) {
    const p = constellationPoints[i];
    if (i === 0) {
      ctx.moveTo(p.x, p.y);
    } else {
      ctx.lineTo(p.x, p.y);
    }
  }
  ctx.stroke();
}
