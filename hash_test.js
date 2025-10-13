// hash_test.js
const argon2 = require('argon2');

async function runTest() {
  try {
    const myPassword = 'password123';
    console.log('--- Argon2 Sanity Check ---');
    console.log('Original String:', myPassword);

    // Hash the string
    const hash = await argon2.hash(myPassword);
    console.log('Generated Argon2 Hash:', hash);

    // Immediately verify the hash against the original string
    const isMatch = await argon2.verify(hash, myPassword);
    console.log('Verification Result (isMatch):', isMatch);

    if (isMatch) {
      console.log('\n✅ SUCCESS: Argon2 is working correctly on your system.');
    } else {
      console.log('\n❌ FAILURE: Something is fundamentally wrong with the Argon2 installation or your Node.js environment.');
    }
  } catch (err) {
    console.error('An error occurred during the test:', err);
  }
}

runTest();