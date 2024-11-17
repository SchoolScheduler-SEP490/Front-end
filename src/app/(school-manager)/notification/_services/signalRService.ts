import * as signalR from "@microsoft/signalr";
import { INotificationItem } from "../_libs/constants";

export class SignalRService {
  private hubConnection: signalR.HubConnection;

  constructor(token: string) {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${process.env.NEXT_PUBLIC_API_URL}/notificationHub`, {
        accessTokenFactory: () => token,
        withCredentials: false,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect() // keep the connection alive
      .build();
  }
  
  // Maintains the initial WebSocket connection 
  public startConnection = async () => {
    try {
      await this.hubConnection.start();
      console.log("Connected");
    } catch (err) {
      console.log("Connection failed: ", err);
    }
  };

  // Adds a listener for receiving notifications from the SignalR hub.
  // A callback function that will be invoked when a notification is received.
  public addNotificationListener = (
    callback: (notification: INotificationItem) => void
  ) => {
    this.hubConnection.on("ReceiveNotification", (notification) => {
      console.log("Notification received:", notification);
      callback(notification);
    });
  };

  public stopConnection = () => {
    this.hubConnection.stop();
  };
}
