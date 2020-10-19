import firebase from 'react-native-firebase';

var notification;
export default async (message) => {
    console.log('>>message' ,message )
    const channel = new firebase.notifications.Android.Channel(
      'channelId',
      'Channel Name',
      firebase.notifications.Android.Importance.High
    ).setDescription('A natural description of the channel');
    firebase.notifications().android.createChannel(channel);
  
   if(Platform.OS==='android'){
    notification = new firebase.notifications.Notification()
    .setNotificationId('notificationId')
    .setTitle(message.data.title)
    .setBody(message.data.displayMsg)
    .android.setSmallIcon('ic_stat_notification')
    .android.setAutoCancel(true)
    .android.setChannelId('channelId')
    .android.setPriority(firebase.notifications.Android.Priority.High);
    firebase.notifications().displayNotification(notification)
   }else{
    notification = new firebase.notifications.Notification()
    .setNotificationId('notificationId')
    .setTitle(message.data.title)
    .setBody(message.data.displayMsg);
    firebase.notifications().displayNotification(notification)
   }
    return Promise.resolve();
}