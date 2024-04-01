// Handles the terminal interactions and custom navigation confirmation on index.html
window.onload = () => {
    const greetingElement = document.getElementById('greeting');
    const nameInput = document.getElementById('nameInput');
    const optionsDiv = document.getElementById('options');
    const greetings = ["Welcome, user.", "What should I call you?"];
    let i = 0;

    // Function to simulate terminal typing effect
    const typeWriter = (message, isNewMessage = false, callback) => {
        if (isNewMessage) {
            greetingElement.textContent = ""; 
        }
        let j = 0;
        const typeLetter = () => {
            if (j < message.length) {
                greetingElement.textContent += message.charAt(j);
                j++;
                setTimeout(typeLetter, 50); 
            } else if (callback) {
                setTimeout(callback, 1000); 
            }
        };
        typeLetter();
    };

    const promptName = () => {
        typeWriter(greetings[1], true, () => {
            nameInput.style.display = "block";
            nameInput.focus();
        });
    };

    nameInput.onkeypress = (e) => {
        if (e.key === "Enter" && nameInput.value.trim() !== "") {
            const userName = nameInput.value.trim();
            nameInput.style.display = "none"; 
            const welcomeMessage = `\nNice to meet you, ${userName}.\nWhat are you here for?`;
            typeWriter(welcomeMessage, true, () => {
                optionsDiv.style.display = "block"; 
            });
        }
    };

    // Navigation and confirmation logic
    document.querySelectorAll('#navLinks a, #options button').forEach(link => {
        link.addEventListener('click', (e) => {
            const optionText = link.textContent || link.innerText;
            if (optionText === 'Portfolio') {
                e.preventDefault(); 
                showConfirmation(); 
            } else if (link.tagName === 'BUTTON') {
                e.preventDefault();
                chooseOption(optionText);
            }
        });
    });

   
    typeWriter(greetings[0], false, promptName);
};

function chooseOption(option) {
    const lowerCaseOption = option.toLowerCase(); 

    if (lowerCaseOption === 'portfolio') {
        showConfirmation();
    } else {
        const fileName = lowerCaseOption + '.html';
        window.location.href = fileName;
    }
}



function showConfirmation() {
    
    const confirmationBox = document.getElementById('confirmationBox');
    confirmationBox.style.display = 'block';
}

function goToGitHub() {
    window.location.href = 'https://github.com/jamaki604';
}

function cancelNavigation() {
    const confirmationBox = document.getElementById('confirmationBox');
    confirmationBox.style.display = 'none'; 
}

function toggleNav() {
    var navLinks = document.getElementById("navLinks");
    navLinks.classList.toggle('show');
}

