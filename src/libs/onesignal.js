export const initializeOneSignal = () => {
  window.OneSignal = window.OneSignal || [];
  OneSignal.push(function() {
    OneSignal.init({
      appId: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID,
      // Otras configuraciones que necesites
    });

    OneSignal.getUserId().then((playerId) => {
      console.log('Player ID:', playerId);

      // Obtener el userId desde las cookies
      const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
      };

      const userId = getCookie('userId'); // Asegúrate de que 'userId' está en las cookies
      console.log('User ID from cookies:', userId)
      if (playerId && userId) {
        // Enviar el playerId y el userId al servidor
        fetch('/api/savePlayerId', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ playerId, userId }), // Aquí se envía el userId obtenido de las cookies
        })
        .then(response => response.json())
        .then(data => {
          console.log(data.message);
        })
        .catch(error => {
          console.error('Error al enviar Player ID:', error);
        });
      } else {
        console.error('Player ID o User ID no disponible');
      }
    });
  });
};
