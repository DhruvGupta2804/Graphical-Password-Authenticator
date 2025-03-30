import './style.css';

document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.getElementById('registerForm');
  const colorGrid = document.querySelector('.color-grid');
  const colorCells = document.querySelectorAll('.color-cell');
  let selectedColors =[];

  const imageGrid = document.querySelector('.image-grid');
  const imageCells = document.querySelectorAll('.image-cell');
  let selectedImages =[];

  imageCells.forEach(cell => {
    cell.addEventListener('click', () => {
      const imageSrc = cell.src;
      selectedImages.push(imageSrc);
      cell.classList.add('selected');
      console.log('Selected images:', selectedImages);
    });
  });

  colorCells.forEach(cell => {
    cell.addEventListener('click', () => {
      const color = cell.style.backgroundColor;
      selectedColors.push(color);
      cell.classList.add('selected');
      console.log('Selected colors:', selectedColors);
    });
  });

  registerForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password, selectedColors, selectedImages }), // Include selectedImages here
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Registration failed');
        }
        return response.text();
      })
      .then(data => {
        console.log('Server response:', data);
        alert('Registration successful!');
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Registration failed. Please try again.');
      });
  });
});