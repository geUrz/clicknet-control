// En tu archivo libs/onesignal.js
import { useAuth } from "@/contexts/AuthContext"; // Asegúrate de que la importación sea correcta

export const initializeOneSignal = () => {
  window.OneSignal = window.OneSignal || [];
  OneSignal.push(function() {
    OneSignal.init({
      appId: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID,
      // Otras configuraciones que necesites
    });

    OneSignal.getUserId().then((playerId) => {
      console.log('Player ID:', playerId);
      const { user } = useAuth(); // Obtener el user aquí (en un componente de React)

      if (playerId && user) {
        // Enviar el playerId y el userId al servidor
        fetch('/api/savePlayerId', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ playerId, userId: user.id }), // Aquí se envía el userId
        })
        .then(response => response.json())
        .then(data => {
          console.log(data.message);
        })
        .catch(error => {
          console.error('Error al enviar Player ID:', error);
        });
      }
    });
  });
};
