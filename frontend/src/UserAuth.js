import { jwtDecode } from "jwt-decode"; // Changer l'import de jwt-decode

const getUserIdFromLocalStorage = () => {
  const token = localStorage.getItem("token"); // Supposons que votre token JWT est stocké sous le nom 'token' dans le localStorage
  if (token) {
    const decoded = jwtDecode(token);
    return decoded.userId;
  } else {
    // Gérer le cas où aucun token n'est présent dans le localStorage
    console.log("Aucun token trouvé dans le localStorage");
    return null; // Ou une autre valeur par défaut si nécessaire
  }
};

export default getUserIdFromLocalStorage;
