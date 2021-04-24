import PushNotification from "react-native-push-notification";

PushNotification.configure({
    // (optional) Called when Token is generated (iOS and Android)
    onRegister: function (token) {
        console.log("TOKEN:", token);
    },
    onNotification: function (notification) {
        console.log("NOTIFICATION:", notification);
        // notification.finish(PushNotificationIOS.FetchResult.NoData);
    },

    // IOS ONLY (optional): default: all - Permissions to register.
    permissions: {
        alert: true,
        badge: true,
        sound: true,
    },
    requestPermissions: true,
    requestPermissions: Platform.OS === 'ios'
});


export const notification = {
    deleteChannel: (channel) => {
        PushNotification.deleteChannel(channel);
    },
    createChannel: (channel) => {
        PushNotification.createChannel(
            {
                channelId: channel, // (required)
                channelName: "My channel", // (required)
                channelDescription: "A channel to categorise your notifications", // (optional) default: undefined.
                playSound: true, // (optional) default: true
                soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
                importance: 4, // (optional) default: 4. Int value of the Android notification importance
                vibrate: false, // (optional) default: true. Creates the default vibration patten if true.
            },
            (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
        );
    },
    notify: (channel, title, message) => {
        PushNotification.localNotification({
            channelId: channel,
            title: title,
            message: message,
        });
    },
    scheduledNotify: (channel, title, message, date) => {
        PushNotification.localNotificationSchedule({
            channelId: channel,
            title: title,
            message: message, // (required)
            date: new Date(date),
        });
    },
    getScheduledNotifications: (callback) => {
        PushNotification.getScheduledLocalNotifications(callback);
    },
    removeAllDeliveredNotifications: () => {
        console.log('removing all delivered notifications')
        PushNotification.removeAllDeliveredNotifications();
    },
    cancelAllLocalNotifications: () => {
        console.log('cancelling all notifications')
        PushNotification.cancelAllLocalNotifications();
    }
};

