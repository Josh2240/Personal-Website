document.getElementById("nav-toggle").addEventListener("click", function() {
    document.getElementById("nav-menu").classList.toggle("active");
});
document.getElementById("nav-toggle").addEventListener("click", function() {
    document.getElementById("nav-menu").classList.toggle("active");
});

// Example: Close nav menu when a link is clicked (for mobile/overlay nav)
const navLinks = document.querySelectorAll("#nav-menu a");
navLinks.forEach(link => {
    link.addEventListener("click", function() {
        document.getElementById("nav-menu").classList.remove("active");
    });
});

// Example: Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));
        if (target) {
            target.scrollIntoView({ behavior: "smooth" });
        }
    });
});