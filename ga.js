// ga.js - Updated with an Advanced Fitness Function

// --- 1. Helper Functions (No changes here) ---
const generateRandomText = (length) => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

const generateCharToImageMap = (textPassword) => {
    const uniqueChars = [...new Set(textPassword)];
    const images = [
        'brain.jpeg', 'dice.jpeg', 'potato.jpg',
        'elephant.jpeg', 'fish.jpeg', 'kid.jpeg',
        'pikachu.jpeg', 'smiley.jpeg', 'random.png'
    ];
    let map = new Map();
    uniqueChars.forEach(char => {
        map.set(char, images[Math.floor(Math.random() * images.length)]);
    });
    return map;
};


// --- 2. Chromosome Definition (No changes here) ---
const createChromosome = () => {
    const textPassword = generateRandomText(8);
    const imageMap = generateCharToImageMap(textPassword);
    const imageSequence = [...textPassword].map(char => imageMap.get(char));
    return { textPassword, imageMap, imageSequence };
};


// --- 3. ADVANCED FITNESS FUNCTION ---
/**
 * This function calculates a score based on the security principles
 * outlined in the project report[cite: 329, 552]. It evaluates the
 * complexity and randomness of both the text and image passwords.
 */
const calculateFitness = (chromosome) => {
    // --- 3.1: Text Password Security Score ---
    const text = chromosome.textPassword;
    let textScore = 0;
    // Reward length
    textScore += text.length * 2;
    // Reward character variety (uppercase, lowercase, numbers)
    if (/[a-z]/.test(text)) textScore += 5;
    if (/[A-Z]/.test(text)) textScore += 5;
    if (/[0-9]/.test(text)) textScore += 5;
    // Reward number of unique characters
    textScore += new Set(text).size;

    // --- 3.2: Image Pattern Security Score ---
    const sequence = chromosome.imageSequence;
    let imageScore = 0;
    // Reward sequence length (same as text length)
    imageScore += sequence.length * 2;
    // Reward variety of images used
    imageScore += new Set(sequence).size * 3;
    // Evaluate Non-Linearity: Penalize simple, repetitive patterns 
    let nonLinearity = 0;
    for (let i = 0; i < sequence.length - 1; i++) {
        if (sequence[i] !== sequence[i+1]) {
            nonLinearity++;
        }
    }
    imageScore += nonLinearity * 2;

    // --- 3.3: Final Weighted Score ---
    // Weights can be tuned to prioritize text vs. image complexity.
    const textWeight = 0.5;
    const imageWeight = 0.5;
    const finalScore = (textScore * textWeight) + (imageScore * imageWeight);

    return finalScore;
};


// --- 4 & 5. Crossover and Mutation (No changes here) ---
const crossover = (parent1, parent2) => {
    const mid = Math.floor(parent1.textPassword.length / 2);
    const childText = parent1.textPassword.substring(0, mid) + parent2.textPassword.substring(mid);
    const childImageMap = generateCharToImageMap(childText);
    const childImageSequence = [...childText].map(char => childImageMap.get(char));
    return { textPassword: childText, imageMap: childImageMap, imageSequence: childImageSequence };
};

const mutate = (chromosome) => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const i = Math.floor(Math.random() * chromosome.textPassword.length);
    const newChar = chars.charAt(Math.floor(Math.random() * chars.length));
    const newText = chromosome.textPassword.substring(0, i) + newChar + chromosome.textPassword.substring(i + 1);
    
    const newImageMap = generateCharToImageMap(newText);
    const newImageSequence = [...newText].map(char => newImageMap.get(char));
    return { textPassword: newText, imageMap: newImageMap, imageSequence: newImageSequence };
};


// --- 6. Main GA Runner (No changes here) ---
const runGA = () => {
    let population = [];
    for (let i = 0; i < 20; i++) {
        population.push(createChromosome());
    }

    for (let gen = 0; gen < 10; gen++) {
        population.sort((a, b) => calculateFitness(b) - calculateFitness(a));
        const newPopulation = population.slice(0, 10);

        for (let i = 0; i < 10; i++) {
            const parent1 = newPopulation[Math.floor(Math.random() * newPopulation.length)];
            const parent2 = newPopulation[Math.floor(Math.random() * newPopulation.length)];
            let child = crossover(parent1, parent2);
            if (Math.random() < 0.1) {
                child = mutate(child);
            }
            newPopulation.push(child);
        }
        population = newPopulation;
    }
    return population.slice(0, 3);
};

module.exports = { runGA };