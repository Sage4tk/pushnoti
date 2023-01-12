import { IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useEffect, useState } from 'react';
import ExploreContainer from '../components/ExploreContainer';
import './Home.css';
import { Capacitor } from "@capacitor/core";
import { PushNotifications, Token, PushNotificationSchema, ActionPerformed } from "@capacitor/push-notifications";
import { FCM } from "@capacitor-community/fcm";
import { Toast } from "@capacitor/toast";

const Home: React.FC = () => {

  const nullEntry: any[] = []
  const [notifications, setnotifications] = useState(nullEntry);

  useEffect(()=>{
      PushNotifications.checkPermissions().then((res) => {
          if (res.receive !== 'granted') {
            PushNotifications.requestPermissions().then((res) => {
              if (res.receive === 'denied') {
                showToast('Push Notification permission denied');
              }
              else {
                showToast('Push Notification permission granted');
                register();
              }
            });
          }
          else {
            register();
          }
        });
  },[])
  
  const register = async() => {
      console.log('Initializing HomePage');

      // Register with Apple / Google to receive push via APNS/FCM
      PushNotifications.register();

      // On success, we should be able to receive notifications
      PushNotifications.addListener('registration',
          (token: Token) => {
              console.log("REGISTERED");
              console.log(token)
              showToast('Push registration success');
          }
      );
      

      // Some issue with our setup and push will not work
      PushNotifications.addListener('registrationError',
          (error: any) => {
            console.log("HIT")
              alert('Error on registration: ' + JSON.stringify(error));
          }
      );

      // Show us the notification payload if the app is open on our device
      PushNotifications.addListener('pushNotificationReceived',
          (notification: PushNotificationSchema) => {
              setnotifications(notifications => [...notifications, { id: notification.id, title: notification.title, body: notification.body, type: 'foreground' }])
          }
      );

      // Method called when tapping on a notification
      PushNotifications.addListener('pushNotificationActionPerformed',
          (notification: ActionPerformed) => {
              setnotifications(notifications => [...notifications, { id: notification.notification.data.id, title: notification.notification.data.title, body: notification.notification.data.body, type: 'action' }])
          }
      );
  }

  const showToast = async (msg: string) => {
      await Toast.show({
          text: msg
      })
  }

  // const getApns = async () => {
  //   try {
  //     const result:any = await PushNotifications.register();

  //     console.log(result.value)
  //   } catch(err) {
  //     console.log(err);
  //   }
  // }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Blank</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonButton onClick={() => {}}>LOLSKI</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Home;
