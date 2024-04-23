const slides = document.querySelectorAll('.carousel-slide');

let slideIndex = 0;

// Show initial slide
showSlide(slideIndex);

// Auto scroll
setInterval(() => {
    slideIndex++;
    console.log(slideIndex);
    if (slideIndex >= slides.length) {
        slideIndex = 0;
    }
    showSlide(slideIndex);
}, 1000);

function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.style.transform = `translateX(${( - index) * 100}%)`;
    });
}
