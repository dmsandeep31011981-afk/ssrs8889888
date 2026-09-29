// SSRS Trust — site scripts

// Set the trust's email address here to make the contact form open a pre-filled email.
var CONTACT_EMAIL = "";

document.addEventListener("DOMContentLoaded", function () {
  // Mobile menu
  var toggle = document.querySelector(".menu-toggle");
  var tabs = document.querySelector(".tabs");
  if (toggle && tabs) {
    toggle.addEventListener("click", function () {
      var open = tabs.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  // Footer year
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  // Gallery filters
  var figures = Array.prototype.slice.call(document.querySelectorAll(".gallery figure"));
  var filterBtns = document.querySelectorAll(".filters button");
  filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      filterBtns.forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      var f = btn.getAttribute("data-filter");
      figures.forEach(function (fig) {
        var show = f === "all" || fig.getAttribute("data-cat") === f;
        fig.classList.toggle("hidden", !show);
      });
    });
  });

  // Lightbox
  var lb = document.querySelector(".lightbox");
  if (lb && figures.length) {
    var lbImg = lb.querySelector("img");
    var lbCap = lb.querySelector(".lb-caption");
    var current = 0;
    var visible = function () { return figures.filter(function (f) { return !f.classList.contains("hidden"); }); };
    var show = function (fig) {
      var img = fig.querySelector("img");
      lbImg.src = img.getAttribute("src");
      lbImg.alt = img.alt;
      var cap = fig.querySelector("figcaption");
      lbCap.textContent = cap ? cap.textContent : "";
    };
    var open = function (fig) {
      current = visible().indexOf(fig);
      show(fig);
      lb.classList.add("open");
      document.body.style.overflow = "hidden";
    };
    var close = function () { lb.classList.remove("open"); document.body.style.overflow = ""; };
    var step = function (d) {
      var v = visible();
      current = (current + d + v.length) % v.length;
      show(v[current]);
    };
    figures.forEach(function (fig) {
      fig.setAttribute("tabindex", "0");
      fig.addEventListener("click", function () { open(fig); });
      fig.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(fig); } });
    });
    lb.querySelector(".lb-close").addEventListener("click", close);
    lb.querySelector(".lb-prev").addEventListener("click", function () { step(-1); });
    lb.querySelector(".lb-next").addEventListener("click", function () { step(1); });
    lb.addEventListener("click", function (e) { if (e.target === lb) close(); });
    document.addEventListener("keydown", function (e) {
      if (!lb.classList.contains("open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") step(-1);
      if (e.key === "ArrowRight") step(1);
    });
  }

  // Contact form
  var form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var note = document.getElementById("form-note");
      var data = new FormData(form);
      var subject = "[" + data.get("topic") + "] Enquiry from " + data.get("name");
      var body = data.get("message") + "\n\n— " + data.get("name") +
        "\nEmail: " + data.get("email") + (data.get("phone") ? "\nPhone: " + data.get("phone") : "");
      if (CONTACT_EMAIL) {
        window.location.href = "mailto:" + CONTACT_EMAIL +
          "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
        note.textContent = "Your email app should now open with the message ready to send.";
      } else {
        note.textContent = "Thank you, " + data.get("name") + ". Online messages are not yet connected — please write to us at the postal address shown on this page.";
      }
      note.classList.add("ok");
    });
  }
});
