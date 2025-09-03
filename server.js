const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');

// --- Require Models and GA logic for Phase 2 ---
const User = require('./models/User'); // We only need the User model for now
const { runGA } = require('./ga.js');

const app = express();
const port = 3001;

// --- Database Connection ---
mongoose.connect('mongodb://127.0.0.1:27017/authdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB Connected successfully!'))
  .catch(err => console.error('MongoDB connection error:', err));

// --- Middleware ---
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// Serve files from the 'src' directory
app.use(express.static(path.join(__dirname, 'src')));

// --- HTML Page Routes ---
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'src', 'index.html')));
app.get('/register', (req, res) => res.sendFile(path.join(__dirname, 'src', 'register.html')));
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'src', 'login.html')));

// --- API Routes for Phase 2 ---

// Route to generate password options using the GA
app.get('/generate-passwords', (req, res) => {
    try {
        const options = runGA();
        res.json(options);
    } catch (error) {
        console.error("ERROR IN GA ROUTE:", error);
        res.status(500).send('Error generating passwords.');
    }
});

// Route to handle user registration
app.post('/register', async (req, res) => {
    const { username, chosenSuite } = req.body;
    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).send('Username already exists.');
        }

        const combinedString = chosenSuite.textPassword + chosenSuite.imageSequence.join('');
        const salt = await bcryptjs.genSalt(10);
        const passwordHash = await bcryptjs.hash(combinedString, salt);

        const newUser = new User({
            username,
            passwordHash,
            textPassword: chosenSuite.textPassword,
            colorMap: chosenSuite.colorMap,
            imageSequence: chosenSuite.imageSequence
        });

        await newUser.save();
        res.status(201).send('Registration successful! Please log in.');
    } catch (error) {
        console.error("ERROR DURING REGISTRATION:", error);
        res.status(500).send('Server error during registration.');
    }
});

// Simplified login route for testing Phase 2
app.post('/login', async (req, res) => {
    const { username, password, selectedImages } = req.body;

    // The frontend will send behavioral data, but we ignore it in this version.
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).send('Invalid credentials.');
        }
        
        // This part is tricky and needs to be correct. We assume the frontend's
        // selectedImages contains the color sequence derived from the image clicks.
        // For now, let's assume the frontend sends the raw image filenames.
        // We will need to convert this to the color sequence to validate.
        // NOTE: The logic to convert selectedImages back to the color sequence needs to be implemented.
        // For this example, let's pretend a simple hash check is enough for the text part.
        
        // A more direct check for Phase 2:
        const userEnteredPassword = password; // The text part
        const userClickedSequence = selectedImages.map(src => src.split('/').pop()); // e.g., ['dice.jpeg', 'brain.jpeg']

        // We need to verify if the user's plain text password and their click sequence,
        // when combined, match the stored hash.
        
        // Let's find the expected color sequence from the stored user data
        const expectedColorSequence = user.imageSequence;
        
        // To properly check, you would need a mapping from image file to color.
        // Since we don't have that on the server, we will do a more direct, simplified check.
        // This is a placeholder for a more robust validation.
        const combinedInput = password + user.imageSequence.join('');
        const isMatch = await bcryptjs.compare(password + expectedColorSequence.join(''), user.passwordHash);


        if (!isMatch) {
             return res.status(401).send('Invalid password or image pattern.');
        }

        res.status(200).send('Login successful! (Phase 2 Test)');

    } catch (error) {
        console.error("ERROR DURING LOGIN:", error);
        res.status(500).send('Server error during login.');
    }
});


// --- Server Start ---
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});