const generateRandomUsername = (name) => {
    // Reemplaza los espacios en el nombre con guiones bajos y convierte a minúsculas
    const usernameBase = name.split(" ").map(word => word.charAt(0)).join("").toLowerCase();
    
    // Genera un número aleatorio entre 1 y 99
    const randomNumber = Math.floor(Math.random() * 99) + 1;
  
    // Formatea el número aleatorio a dos dígitos (añade un cero al principio si es menor que 10)
    const formattedRandomNumber = randomNumber.toString().padStart(2, "0");
    
    // Combina el nombre de usuario base, el id y el número aleatorio
    const username = `${usernameBase}${formattedRandomNumber}`;
    
    return username;
};

module.exports = generateRandomUsername;