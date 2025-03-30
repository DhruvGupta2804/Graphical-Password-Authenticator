import './style.css';

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const colorGrid = document.querySelector('.color-grid');
  const colorCells = document.querySelectorAll('.color-cell');
  let selectedColors = [];

  const imageGrid = document.querySelector('.image-grid');
  const imageCells = document.querySelectorAll('.image-cell');
  let selectedImages = [];

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

  loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    fetch('/login', {
      method: 'POST', // Add this line
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password, selectedColors, selectedImages }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Invalid username or password or image pattern');
        }
        return response.text();
      })
      .then((data) => {
        console.log('Server response:', data);
      })
      .catch((error) => {
        console.error('Error:', error.message);
        alert(error.message);
      });
  });
});