document.addEventListener('DOMContentLoaded', function() {
    var menuIcon = document.getElementById('menuIcon');
    if(menuIcon) {
        menuIcon.addEventListener('click', function() {
            var navLinks = document.getElementById('navLinks');
            if(navLinks) {
                navLinks.classList.toggle('show');
            }
        });
    }
});
