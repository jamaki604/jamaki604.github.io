document.addEventListener('DOMContentLoaded', function() {
    setupCustomPortfolioConfirmation('a[href$="portfolio.html"]');
});

function setupCustomPortfolioConfirmation(selector) {
    document.querySelectorAll(selector).forEach(link => {
        link.addEventListener('click', function(event) {
            if (this.innerText.toLowerCase() === 'portfolio') {
                event.preventDefault(); // Prevent default link behavior
                showModal();
            }
        });
    });
}

function showModal() {
    const modal = document.getElementById('confirmationModal');
    modal.style.display = 'block';

    // When the user clicks on "Take me there", go to GitHub
    document.getElementById('confirmBtn').onclick = function() {
        window.location.href = 'https://github.com/jamaki604';
    };

    // When the user clicks on "Go back", close the modal
    document.getElementById('cancelBtn').onclick = function() {
        modal.style.display = 'none';
    };

    // Also close the modal if the user clicks outside of it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };
}
