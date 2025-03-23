/* Name: Manjot kaur and Subhana Hashimi
   Student ID: 100951033, 100949958
   Date: 2025-02-23
*/


const backToTopButton: HTMLElement | null = document.getElementById("back-to-top");

function scrollFunction() {
    if (backToTopButton) {
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            backToTopButton.style.display = "block";
        } else {
            backToTopButton.style.display = "none";
        }
    }
}

if (backToTopButton) {
    window.onscroll = scrollFunction;

    backToTopButton.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}


