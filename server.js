const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const bcryptjs = require('bcryptjs');
const mongoose = require('mongoose');

const app = express();
const port = 3001;

mongoose.connect('mongodb://127.0.0.1:27017/authdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  colorPattern: { type: String, required: true },  // Store as a raw JSON string
  imagePattern: { type: [String],required:true},  // Store as an array
});

const User = mongoose.model('User', userSchema);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('dist'));

app.get('/register', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'dist', 'register.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'dist', 'login.html'));
});

app.post('/register', async (req, res) => {
  const { username, password, selectedColors, selectedImages } = req.body;
  try {
    console.log('Checking for existing user:', username);
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      console.log('Username already exists:', username);
      return res.status(400).send('Username already exists');
    }

    console.log('Registering user:', username);
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newUser = new User({
      username,
      password: hashedPassword,
      colorPattern: JSON.stringify(selectedColors),  // Store as raw JSON string
      imagePattern: selectedImages,  // Store as an array
    });

    await newUser.save();
    console.log('User registered successfully:', username);
    res.send('Registration successful');
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).send('Registration failed');
  }
});

app.post('/login', async (req, res) => {
  const { username, password, selectedColors, selectedImages } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).send('Invalid username or password');
    }

    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send('Invalid username or password');
    }

    // Compare color pattern
    if (JSON.stringify(selectedColors) !== user.colorPattern) {
      return res.status(400).send('Invalid color pattern');
    }

    // Compare image pattern (convert both to JSON string for comparison)
    if (JSON.stringify(selectedImages) !== JSON.stringify(user.imagePattern)) {
      return res.status(400).send('Invalid image pattern');
    }

    res.send('Login successful');
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).send('Login failed');
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
