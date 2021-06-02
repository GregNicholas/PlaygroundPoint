const body = document.querySelector("body");
const btnHamburger = document.querySelector("#btnHamburger");
const header = document.querySelector(".header");
const overlay = document.querySelector(".overlay")
const fadeElems = document.querySelectorAll(".has-fade");

btnHamburger.addEventListener("click", () => {
  if (header.classList.contains("open")) {
    header.classList.remove("open");
    body.classList.remove("noscroll");
    fadeElems.forEach(element => {
      element.classList.remove('fade-in');
      element.classList.add('fade-out');
      element.classList.add('has-fade');
    })
  } else {
    header.classList.add("open");
    body.classList.add("noscroll");
    fadeElems.forEach(element => {
      element.classList.remove('fade-out');
      element.classList.add('fade-in');
      element.classList.remove('has-fade');
    })
  }
});
