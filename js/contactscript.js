document.querySelector('form').addEventListener('submit', function(event) {
    var firstName = document.getElementById('firstName').value;
    var lastName = document.getElementById('lastName').value;
    var email = document.getElementById('email').value;
    var reason = document.getElementById('reason').value;

    if (!firstName || !lastName || !email || !reason) {
        alert('Please fill out all fields.');
        event.preventDefault(); 
    }
});
