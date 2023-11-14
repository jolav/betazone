/* */

function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomColor() {
  const letters = '0123456789ABCDEF'.split('');
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export {
  randomInteger,
  randomColor
};
