/* Name: Manjot kaur and Subhana Hashimi
   Student ID: 100951033, 100949958
   Date: 2025-02-23
*/


// Back to Top Button functionality
let backToTopButton = document.getElementById("back-to-top");

window.onscroll = function() {
    scrollFunction();
};

function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        backToTopButton.style.display = "block";
    } else {
        backToTopButton.style.display = "none";
    }
}

backToTopButton.addEventListener("click", function() {
    window.scrollTo({top: 0, behavior: 'smooth'});
});