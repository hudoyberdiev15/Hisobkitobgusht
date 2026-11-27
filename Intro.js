/* =====================================================================
   KIRISH ANIMATSIYASI (intro.js)
   Ilova ochilganda "Hisob-kitob" yozuvi tepadan tushadi, bir marta
   sakraydi, keyin kattalashib ochiladi va ilova ko'rinadi.
   Sozlash uchun faqat shu fayl boshidagi qiymatlarni o'zgartiring.
   ===================================================================== */
(function () {
  var INTRO_TEXT = "Hisob-kitob";   // chiqadigan yozuv (masalan: "Go‘sht hisobi")
  var DURATION = 2400;             // butun animatsiya vaqti, millisekund
  var ONCE_PER_SESSION = true;     // true: ilova ochilganda bir marta; false: har safar sahifa yangilanganda

  try {
    if (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) return; // harakatni kamaytirish yoqilgan bo'lsa ko'rsatilmaydi
    if (ONCE_PER_SESSION && sessionStorage.getItem("__intro_done") === "1") return;
    sessionStorage.setItem("__intro_done", "1");
  } catch (e) {}

  var root = document.documentElement;
  /* Kirish oynasi (login) animatsiya paytida yashirin turadi, animatsiya oxirida silliq paydo bo'ladi */
  var st = document.createElement("style");
  st.textContent = "#gate{transition:opacity .55s ease}html.introing #gate{opacity:0!important;pointer-events:none!important}";
  root.appendChild(st);
  root.classList.add("introing");
  var box = document.createElement("div");
  box.id = "introBox";
  box.setAttribute("aria-hidden", "true");
  box.style.cssText =
    "position:fixed;inset:0;z-index:2147483647;display:flex;align-items:center;justify-content:center;overflow:hidden;" +
    "background:linear-gradient(135deg,#0b7a5e,#10a37f 55%,#34d1a6);touch-action:none";

  var word = document.createElement("div");
  word.textContent = INTRO_TEXT;
  word.style.cssText =
    "font:800 clamp(34px,11.5vw,68px)/1.1 Onest,system-ui,-apple-system,sans-serif;color:#fff;letter-spacing:.5px;" +
    "text-align:center;padding:0 16px;white-space:nowrap;text-shadow:0 6px 28px rgba(0,0,0,.28),0 0 24px rgba(255,255,255,.35);" +
    "will-change:transform,opacity;transform-origin:50% 100%";

  box.appendChild(word);
  root.appendChild(box);

  var finished = false;
  function finish() {
    if (finished) return;
    finished = true;
    root.classList.remove("introing");
    try { box.remove(); } catch (e) { if (box.parentNode) box.parentNode.removeChild(box); }
  }

  // Animatsiya qo'llab-quvvatlanmasa, darhol o'tkazib yuboramiz
  if (!word.animate) { finish(); return; }

  /* Yozuv harakati: tepadan tushadi -> yerga uriladi (yoyilib) -> bir marta sakraydi -> qo'nadi -> kattalashib ketadi */
  var K = [
    { offset: 0,    transform: "translateY(-115vh) scale(1,1.15)",  opacity: 1, easing: "cubic-bezier(.5,0,.9,.5)" },
    { offset: 0.26, transform: "translateY(0) scale(1,1)",          opacity: 1, easing: "ease-out" },
    { offset: 0.30, transform: "translateY(0) scale(1.2,.74)",      opacity: 1, easing: "ease-out" },
    { offset: 0.35, transform: "translateY(0) scale(.97,1.06)",     opacity: 1, easing: "cubic-bezier(.2,.7,.3,1)" },
    { offset: 0.50, transform: "translateY(-24vh) scale(.95,1.08)", opacity: 1, easing: "cubic-bezier(.6,0,.9,.6)" },
    { offset: 0.63, transform: "translateY(0) scale(1,1)",          opacity: 1, easing: "ease-out" },
    { offset: 0.67, transform: "translateY(0) scale(1.12,.86)",     opacity: 1, easing: "ease-out" },
    { offset: 0.72, transform: "translateY(0) scale(1,1)",          opacity: 1, easing: "ease-in-out" },
    { offset: 0.78, transform: "translateY(0) scale(1,1)",          opacity: 1, easing: "cubic-bezier(.6,0,.9,.4)" },
    { offset: 1,    transform: "translateY(0) scale(18)",           opacity: 0 }
  ];
  var anim = word.animate(K, { duration: DURATION, fill: "forwards" });

  /* Orqa fon: yozuv kattalashayotganda yo'qoladi va ilova ochiladi */
  var bg = box.animate(
    [
      { offset: 0,    opacity: 1 },
      { offset: 0.78, opacity: 1 },
      { offset: 1,    opacity: 0 }
    ],
    { duration: DURATION, fill: "forwards" }
  );

  setTimeout(function () { root.classList.remove("introing"); }, Math.round(DURATION * 0.74)); // login oynasi ko'rina boshlaydi
  anim.onfinish = finish;
  bg.onfinish = finish;
  box.addEventListener("click", finish);     // bosilsa, o'tkazib yuboriladi
  setTimeout(finish, DURATION + 1500);       // zaxira: hech qachon qotib qolmasin
})();
