/* =====================================================================
   KIRISH ANIMATSIYASI (intro.js)
   Ilova ochilganda "Hisob-kitob" yozuvi tepadan tushadi, yerga uriladi,
   bir marta sakraydi, keyin kattalashib ochiladi va ilova ko'rinadi.
   Sozlash uchun faqat shu fayl boshidagi qiymatlarni o'zgartiring.
   ===================================================================== */
(function () {
  var INTRO_TEXT = "Hisob-kitob";      // chiqadigan yozuv (masalan: "Go‘sht hisobi")
  var DURATION = 2600;                // butun animatsiya vaqti, millisekund
  var REPLAY_AFTER = 20000;           // shu vaqt ichida (ms) sahifa qayta yuklansa, animatsiya yana chiqmaydi
  var RESPECT_REDUCED_MOTION = false; // true: telefonda "Reduce Motion" yoqilgan bo'lsa animatsiya o'tkazib yuboriladi

  try {
    if (RESPECT_REDUCED_MOTION && window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var now = Date.now(), last = +sessionStorage.getItem("__intro_t") || 0;
    if (now - last < REPLAY_AFTER) return;
    sessionStorage.setItem("__intro_t", String(now));
  } catch (e) {}

  var root = document.documentElement;
  var D = DURATION + "ms";

  var st = document.createElement("style");
  st.textContent =
    /* kirish (login) oynasi animatsiya paytida yashirin turadi va oxirida silliq paydo bo'ladi */
    "#gate{transition:opacity .55s ease}html.introing #gate{opacity:0!important;pointer-events:none!important}" +
    "#introBox{position:fixed;top:0;left:0;right:0;bottom:0;z-index:2147483647;display:flex;align-items:center;justify-content:center;overflow:hidden;" +
      "background:linear-gradient(135deg,#0b7a5e,#10a37f 55%,#34d1a6);-webkit-animation:ik-bg " + D + " linear forwards;animation:ik-bg " + D + " linear forwards}" +
    "#introWord{font:800 clamp(34px,11.5vw,68px)/1.1 Onest,system-ui,-apple-system,sans-serif;color:#fff;letter-spacing:.5px;text-align:center;padding:0 16px;white-space:nowrap;" +
      "text-shadow:0 6px 28px rgba(0,0,0,.28),0 0 24px rgba(255,255,255,.35);-webkit-transform-origin:50% 100%;transform-origin:50% 100%;" +
      "-webkit-animation:ik-drop " + D + " linear forwards;animation:ik-drop " + D + " linear forwards}" +

    /* yozuv: tepadan tushadi -> uriladi (yoyiladi) -> bir marta sakraydi -> qo'nadi -> kattalashib ketadi */
    "@-webkit-keyframes ik-drop{" + dropFrames("-webkit-") + "}" +
    "@keyframes ik-drop{" + dropFrames("") + "}" +
    "@-webkit-keyframes ik-bg{0%,78%{opacity:1}100%{opacity:0}}" +
    "@keyframes ik-bg{0%,78%{opacity:1}100%{opacity:0}}";

  function dropFrames(p) {
    var t = p ? "-webkit-transform" : "transform";
    function fr(pct, y, sx, sy, ease, op) {
      return pct + "%{" + t + ":translateY(" + y + ") scale(" + sx + "," + sy + ");" +
        (op !== undefined ? "opacity:" + op + ";" : "") +
        (ease ? p + "animation-timing-function:" + ease + ";" : "") + "}";
    }
    return fr(0,   "-115vh", 1,    1.15, "cubic-bezier(.5,0,.9,.5)", 1) +
           fr(26,  "0",      1,    1,    "ease-out") +
           fr(30,  "0",      1.2,  .74,  "ease-out") +
           fr(35,  "0",      .97,  1.06, "cubic-bezier(.2,.7,.3,1)") +
           fr(50,  "-24vh",  .95,  1.08, "cubic-bezier(.6,0,.9,.6)") +
           fr(63,  "0",      1,    1,    "ease-out") +
           fr(67,  "0",      1.12, .86,  "ease-out") +
           fr(72,  "0",      1,    1,    "ease-in-out") +
           fr(78,  "0",      1,    1,    "cubic-bezier(.6,0,.9,.4)", 1) +
           fr(100, "0",      18,   18,   "", 0);
  }

  root.appendChild(st);
  root.classList.add("introing");

  var box = document.createElement("div");
  box.id = "introBox";
  box.setAttribute("aria-hidden", "true");
  var word = document.createElement("div");
  word.id = "introWord";
  word.textContent = INTRO_TEXT;
  box.appendChild(word);
  root.appendChild(box);

  var finished = false;
  function finish() {
    if (finished) return;
    finished = true;
    root.classList.remove("introing");
    try { box.parentNode && box.parentNode.removeChild(box); } catch (e) {}
    try { st.parentNode && st.parentNode.removeChild(st); } catch (e) {}
  }

  setTimeout(function () { root.classList.remove("introing"); }, Math.round(DURATION * 0.74)); // login oynasi ko'rina boshlaydi
  box.addEventListener("animationend", finish);
  box.addEventListener("webkitAnimationEnd", finish);
  box.addEventListener("click", finish);      // bosilsa, o'tkazib yuboriladi
  setTimeout(finish, DURATION + 1500);        // zaxira: hech qachon qotib qolmasin
})();
