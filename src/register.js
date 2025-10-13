// src/register.js - Final Version

document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generateBtn');
    const usernameInput = document.getElementById('username');
    const optionsDiv = document.getElementById('password-options');

    generateBtn.addEventListener('click', async () => {
        const username = usernameInput.value;
        if (!username) {
            alert('Please enter a username first.');
            return;
        }

        try {
            // This fetch call should work now
            const response = await fetch('/generate-passwords');
            if (!response.ok) {
                throw new Error(`Server responded with status: ${response.status}`);
            }
            const options = await response.json();
            displayOptions(options);
        } catch (error) {
            console.error('Failed to generate passwords:', error);
            alert('Could not generate password options. Check the server terminal and browser network tab for errors.');
        }
    });
});

// In src/register.js

// In src/register.js

function displayOptions(options) {
    const usernameInput = document.getElementById('username');
    const optionsDiv = document.getElementById('password-options');
    
    optionsDiv.innerHTML = '<h3>Choose Your Password Suite:</h3>';
    options.forEach((option, index) => {
        // Create a string of <img> tags from the image sequence array
        const imagesHTML = option.imageSequence.map(filename => 
            `<img src="/Image grid/${filename}" alt="pattern image" class="password-option-image">`
        ).join('');

        const optionElem = document.createElement('div');
        optionElem.className = 'password-option-box'; // Use a class for styling
        optionElem.innerHTML = `
            <p><strong>Text:</strong> ${option.textPassword}</p>
            <div class="password-option-image-container">${imagesHTML}</div>
            <button class="btn select-btn" data-index="${index}">Select & Register</button>
        `;
        optionsDiv.appendChild(optionElem);
    });

    document.querySelectorAll('.select-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const selectedOption = options[e.target.dataset.index];
            registerUser(usernameInput.value, selectedOption);
        });
    });
}

async function registerUser(username, chosenSuite) {
    const response = await fetch('/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, chosenSuite })
    });

    const resultText = await response.text();
    alert(resultText);

    if (response.ok) {
        window.location.href = '/login';
    }
}