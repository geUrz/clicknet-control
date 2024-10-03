export const initializeOneSignal = () => {
  window.OneSignal = window.OneSignal || [];
  
  OneSignal.push(function() {
    OneSignal.init({
      appId: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID,
    });

    // Registrar para notificaciones
    OneSignal.push(() => {
      OneSignal.registerForPushNotifications(); // Registra al usuario para notificaciones

      OneSignal.getUserId().then((playerId) => {
        if (!playerId) {
          console.error('Player ID no disponible. Asegúrate de que el usuario haya aceptado las notificaciones.');
          return;
        }

        const userId = getCookie('userId'); // Asegúrate de que 'userId' esté en las cookies
        if (userId) {
          // Enviar Player ID al backend
          fetch('/api/savePlayerId', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ playerId, userId }),
          })
          .then(response => response.json())
          .then(data => {
            console.log(data.message);
          })
          .catch(error => {
            console.error('Error al enviar Player ID:', error);
          });
        } else {
          console.error('User ID no disponible en las cookies');
        }
      });

      // Captura cuando un usuario se suscribe
      OneSignal.on('subscriptionChange', function(isSubscribed) {
        if (isSubscribed) {
          OneSignal.getUserId().then((playerId) => {
            if (playerId) {
              const userId = getCookie('userId');
              if (userId) {
                // Enviar solicitud al backend para enviar correo
                fetch('/api/notificaciones/sendSubscriptionEmail', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ playerId, userId }),
                })
                .then(response => response.json())
                .then(data => {
                  console.log('Correo de suscripción enviado:', data.message);
                })
                .catch(error => {
                  console.error('Error al enviar correo de suscripción:', error);
                });
              } else {
                console.error('User ID no disponible en las cookies');
              }
            } else {
              console.error('Player ID no disponible.');
            }
          });
        }
      });
    });
  });
};

// Función para obtener cookies
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
};
