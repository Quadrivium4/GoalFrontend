import { PushNotifications } from '@capacitor/push-notifications';
import { postPushNotificationToken } from '../controllers/user';

const addPushNotificationListeners = () => {
    console.log("adding listeners");
  PushNotifications.addListener('registration', token => {
    console.info('Registration token: ', token.value);
    postPushNotificationToken(token.value)
  });

 PushNotifications.addListener('registrationError', err => {
    console.error('Registration error: ', err.error);
  });

PushNotifications.addListener('pushNotificationReceived', notification => {
    console.log('Push notification received: ', notification);
  });

PushNotifications.addListener('pushNotificationActionPerformed', notification => {
    console.log('Push notification action performed', notification.actionId, notification.inputValue);
  });
}

const registerPushNotificationsNotifications = async () => {
    console.log("registering not")
  let permStatus = await PushNotifications.checkPermissions();
    console.log(permStatus,1);
  if (permStatus.receive === 'prompt') {
    permStatus = await PushNotifications.requestPermissions();
  }

  if (permStatus.receive !== 'granted') {
    throw new Error('User denied permissions!');
  }
    console.log(permStatus,2);
  await PushNotifications.register();
}
const initPushNotifications = async() =>{
    console.log("init push notifications");
    addPushNotificationListeners();
    await registerPushNotificationsNotifications();
     console.log("push notifications initialized");
}
// const getDeliveredNotifications = async () => {
//   const notificationList = await PushNotifications.getDeliveredNotifications();
//   console.log('delivered notifications', notificationList);
// }
export {
    initPushNotifications
}