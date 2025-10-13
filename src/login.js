document.addEventListener('DOMContentLoaded', () => {
    // Step 1 Elements
    const passwordStep = document.getElementById('password-step');
    const verifyPasswordBtn = document.getElementById('verifyPasswordBtn');
    const usernameInput = document.getElementById('loginUsername');
    const passwordInput = document.getElementById('loginPassword');

    // Step 2 Elements
    const imageStep = document.getElementById('image-step');
    const imageWrappers = document.querySelectorAll('.image-cell-wrapper');
    const finalLoginBtn = document.getElementById('finalLoginBtn');

    let clickSequence = []; // This array will store the order of image clicks

    // --- STEP 1: VERIFY TEXT PASSWORD ---
    verifyPasswordBtn.addEventListener('click', async () => {
        const username = usernameInput.value;
        const password = passwordInput.value;

        if (!username || !password) {
            alert('Please enter a username and password.');
            return;
        }

        const response = await fetch('/verify-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        if (response.ok) {
            passwordStep.style.display = 'none';
            imageStep.style.display = 'block';
        } else {
            alert('Invalid username or password.');
        }
    });

    // --- IMAGE SELECTION WITH COUNTERS ---
    imageWrappers.forEach(wrapper => {
        wrapper.addEventListener('click', () => {
            const imageSrc = wrapper.querySelector('.image-cell').src;
            clickSequence.push(imageSrc); // Add the clicked image to our sequence array
            updateCounters(); // Update the numbers on the screen
        });
    });

    function updateCounters() {
        // First, clear all existing counters and selections
        document.querySelectorAll('.click-counter').forEach(counter => {
            counter.textContent = '';
            counter.style.display = 'none';
        });
        document.querySelectorAll('.image-cell').forEach(img => img.classList.remove('selected'));

        // Now, add the counters back based on the sequence array
        const clickCounts = {};
        clickSequence.forEach((src, index) => {
            if (!clickCounts[src]) {
                clickCounts[src] = [];
            }
            clickCounts[src].push(index + 1); // Store the click number (1, 2, 3...)
        });

        // Display the counters on the images
        for (const src in clickCounts) {
            imageWrappers.forEach(wrapper => {
                if (wrapper.querySelector('.image-cell').src === src) {
                    const counter = wrapper.querySelector('.click-counter');
                    counter.textContent = clickCounts[src].join(',');
                    counter.style.display = 'flex'; // Use flex for better centering
                    wrapper.querySelector('.image-cell').classList.add('selected');
                }
            });
        }
    }

    // --- STEP 2: VERIFY FINAL IMAGE PATTERN ---
    finalLoginBtn.addEventListener('click', () => {
        const username = usernameInput.value;
        const password = passwordInput.value;
        
        fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username,
                password,
                // We decode each URL to remove special characters like %20 for spaces
                selectedImages: clickSequence.map(src => decodeURIComponent(src))
            })
        })
        .then(res => res.text())
        .then(data => alert(data));
    });
});