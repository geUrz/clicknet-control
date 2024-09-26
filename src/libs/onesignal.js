// libs/onesignal.js
export const initializeOneSignal = () => {
  window.OneSignal = window.OneSignal || [];
  OneSignal.push(function() {
    OneSignal.init({
      appId: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID,
      // Otras configuraciones que necesites
    });

    OneSignal.getUserId().then((playerId) => {
      console.log('Player ID:', playerId);
      // Aquí puedes enviar el playerId al servidor o guardarlo en el estado
    });
  });
};
