document.addEventListener('DOMContentLoaded', function() {
    var mainPortfolioLink = document.getElementById('portfolioLink');
    var footerPortfolioLink = document.getElementById('footerPortfolioLink');

    mainPortfolioLink.addEventListener('click', function() {
        showModal();
    });

    footerPortfolioLink.addEventListener('click', function() {
        showModal();
    });
});


function showModal() {
    const modal = document.getElementById('confirmationModal');
    modal.style.display = 'block';

    // Setup button click handlers within the modal
    document.getElementById('confirmBtn').onclick = function() {
        window.location.href = 'https://github.com/jamaki604'; // Navigate to GitHub
    };

    document.getElementById('cancelBtn').onclick = function() {
        modal.style.display = 'none'; // Close the modal
    };

    // Close the modal if the user clicks outside of it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };
}
