// ga.js - Updated for Image Patterns

// --- 1. Helper Functions ---
const generateRandomText = (length) => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

// UPDATED: This function now maps characters to one of your 9 images.
const generateCharToImageMap = (textPassword) => {
    const uniqueChars = [...new Set(textPassword)];
    // This is our new palette of images
    const images = [
        'brain.jpeg', 'dice.jpeg', 'potato.jpg',
        'elephant.jpeg', 'fish.jpeg', 'kid.jpeg',
        'pikachu.jpeg', 'smiley.jpeg', 'random.png'
    ];
    let map = new Map();
    uniqueChars.forEach(char => {
        // Assign a random image from the list to each unique character
        map.set(char, images[Math.floor(Math.random() * images.length)]);
    });
    return map;
};

// --- 2. Define the Chromosome ---
const createChromosome = () => {
    const textPassword = generateRandomText(8);
    // Use the new image mapping function
    const imageMap = generateCharToImageMap(textPassword);
    // The imageSequence is now an array of image filenames
    const imageSequence = [...textPassword].map(char => imageMap.get(char));
    
    // The chromosome now holds an imageMap instead of a colorMap
    return { textPassword, imageMap, imageSequence };
};


// --- 3. The Fitness Function (no changes needed) ---
const calculateFitness = (chromosome) => {
    let score = 0;
    score += chromosome.textPassword.length * 2;
    score += new Set(chromosome.textPassword).size;
    return score;
};


// --- 4. Crossover Function (updated to use new map) ---
const crossover = (parent1, parent2) => {
    const mid = Math.floor(parent1.textPassword.length / 2);
    const childText = parent1.textPassword.substring(0, mid) + parent2.textPassword.substring(mid);
    const childImageMap = generateCharToImageMap(childText); // Use the new function
    const childImageSequence = [...childText].map(char => childImageMap.get(char));
    return { textPassword: childText, imageMap: childImageMap, imageSequence: childImageSequence };
};

// --- 5. Mutation Function (updated to use new map) ---
const mutate = (chromosome) => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const i = Math.floor(Math.random() * chromosome.textPassword.length);
    const newChar = chars.charAt(Math.floor(Math.random() * chars.length));
    const newText = chromosome.textPassword.substring(0, i) + newChar + chromosome.textPassword.substring(i + 1);
    
    const newImageMap = generateCharToImageMap(newText); // Use the new function
    const newImageSequence = [...newText].map(char => newImageMap.get(char));
    return { textPassword: newText, imageMap: newImageMap, imageSequence: newImageSequence };
};


// --- 6. The Main GA Runner (no changes needed) ---
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