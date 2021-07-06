window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    header.classList.toggle('sticky', window.scrollY > 0);
});

// const toggleMenu = () => {
//     const menuToggle = document.querySelector(".toggle");
//     menuToggle.classList.toggle('active');
// }

const toggleMenu = () => {
    const menuToggle = document.getElementById("btnHamburger");
    const menu = document.querySelector(".menu");
    menu.classList.toggle('open');
    menuToggle.classList.toggle('open');
}

const date = new Date();
    document.getElementById("copyright").innerHTML=`&#169 Gregory Schoenberg ${date.getFullYear()}`;