const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const argon2 = require('argon2'); // Using argon2

// --- Require Models ---
const User = require('./models/User');
const { runGA } = require('./ga.js');

const app = express();
const port = 3001;

// --- Database Connection ---
mongoose.connect('mongodb+srv://dhruvgupta2804_db_user:1NcMUFJA8g9OedjQ@cluster0.o7uenjo.mongodb.net/authdb?retryWrites=true&w=majority&appName=Cluster0').then(() => console.log('MongoDB Connected successfully!')).catch(err => console.error('MongoDB connection error:', err));

// --- Middleware ---
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'src')));

// --- HTML Page Routes ---
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'src', 'index.html')));
app.get('/register', (req, res) => res.sendFile(path.join(__dirname, 'src', 'register.html')));
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'src', 'login.html')));

// --- API Routes ---

app.get('/generate-passwords', (req, res) => {
    try {
        const options = runGA();
        res.json(options);
    } catch (error) {
        console.error("ERROR IN GA ROUTE:", error);
        res.status(500).send('Error generating passwords.');
    }
});

// --- REGISTRATION ROUTE (Using Argon2) ---
app.post('/register', async (req, res) => {
    const { username, chosenSuite } = req.body;
    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) return res.status(400).send('Username already exists.');

        const combinedString = chosenSuite.textPassword + chosenSuite.imageSequence.join('');
        const passwordHash = await argon2.hash(combinedString);

        const textPasswordHash = await argon2.hash(chosenSuite.textPassword);

        const newUser = new User({
            username,
            passwordHash,
            textPasswordHash,
            textPassword: chosenSuite.textPassword,
            imageMap: chosenSuite.imageMap,
            imageSequence: chosenSuite.imageSequence
        });

        await newUser.save();
        res.status(201).send('Registration successful! Please log in.');
    } catch (error) {
        console.error("ERROR DURING REGISTRATION:", error);
        res.status(500).send('Server error during registration.');
    }
});


// --- PASSWORD VERIFICATION ROUTE (Using Argon2) ---
app.post('/verify-password', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(401).send('Verification failed.');

        const isMatch = await argon2.verify(user.textPasswordHash, password);
        if (!isMatch) return res.status(401).send('Verification failed.');

        res.status(200).send('Password verified.');
    } catch (error) {
        res.status(500).send('Server error.');
    }
});


// --- FINAL LOGIN ROUTE (Using Argon2) ---
app.post('/login', async (req, res) => {
    const { username, selectedImages } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(401).send('Invalid credentials.');

        const clickedImageNames = selectedImages.map(src => decodeURIComponent(src).split('/').pop());
        const combinedString = user.textPassword + clickedImageNames.join('');

        const isMatch = await argon2.verify(user.passwordHash, combinedString);
        if (!isMatch) return res.status(401).send('Invalid image pattern.');

        res.status(200).send('Login Successful!');
    } catch (error) {
        console.error("ERROR DURING LOGIN:", error);
        res.status(500).send('Server error during login.');
    }
});


// --- Server Start ---
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});