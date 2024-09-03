/* export function formatId(id) {
  if (typeof id !== 'number') {
    return '00000'
  }
  return id.toString().padStart(5, '0')
} */

// helpers.js
/* export function formatSequentialNumber(index) {
  // Asegúrate de que esta función esté formateando el número correctamente
  return (index + 1).toString().padStart(5, '0'); // Ejemplo de formato
} */


// helpers.js
export function generateUniqueId(length) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'R-'; // Prefijo para el folio
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}


export function formatClientId(id) {
  if (typeof id !== 'number') {
    return '000'
  }
  return id.toString().padStart(3, '0')
}