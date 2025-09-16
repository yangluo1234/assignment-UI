/* this is where you'd change out what the keyboard is controlling */
/* as its imported AFTER script.js where polySynth is defined I can assign it here */
let keyboardSynth = polySynth;
//let keyboardSynth = sampler;

/* find keys by their class and add to array */
const cells = Array.from(document.querySelectorAll(".cell"));

/* set default octace : we will update based on keys later on */
let octave = 3;

let pointerIsDown = false;

// Helper: flash the star when it is triggered
function flashOn(el, ms = 120) {
  el.classList.add("is-on");
  setTimeout(() => el.classList.remove("is-on"), ms);
}

// Main: attach event listeners for each star cell
cells.forEach((el) => {
  const note = el.dataset.note; // Example: "C4"

  // Play note on pointer down
  el.addEventListener("pointerdown", (e) => {
    pointerIsDown = true;
    el.setPointerCapture?.(e.pointerId);
    if (note) {
      keyboardSynth.triggerAttackRelease(note, "8n");
      flashOn(el);

      document.dispatchEvent(
        new CustomEvent("star:played", { detail: { el, note } })
      );
    }
  });

  // If pointer is held down, entering another star also plays it
  el.addEventListener("pointerenter", () => {
    if (!pointerIsDown) return;
    if (note) {
      keyboardSynth.triggerAttackRelease(note, "8n");
      flashOn(el);
      document.dispatchEvent(
        new CustomEvent("star:played", { detail: { el, note } })
      );
    }
  });

  // Reset drag-to-play when pointer is released
  el.addEventListener("pointerup", () => {
    pointerIsDown = false;
  });
  el.addEventListener("pointercancel", () => {
    pointerIsDown = false;
  });
});

// Global reset for pointer state
window.addEventListener("pointerup", () => {
  pointerIsDown = false;
});

// // event listener for keyboard(qwerty)//

// window.addEventListener("keydown", (e) => {
//   console.log(e);
//   if (keyCodeToNote[e.code]) {
//     if (keyHeld === false) {
//       polySynth.triggerAttack(keyCodeToNote[e.code]);
//       keyHeld = true;
//     }
//   }
// });

// window.addEventListener("keyup", (e) => {
//   console.log(e);
//   if (keyCodeToNote[e.code]) {
//     polySynth.triggerRelease(keyCodeToNote[e.code]);
//     keyHeld = false;
//   }
// });
