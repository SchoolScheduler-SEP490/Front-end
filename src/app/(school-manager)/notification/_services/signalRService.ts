import * as signalR from '@microsoft/signalr';
import { INotificationItem } from '../_libs/constants';

export class SignalRService {
    private hubConnection: signalR.HubConnection;

    constructor(token: string) {
        this.hubConnection = new signalR.HubConnectionBuilder()
            .withUrl(`${process.env.NEXT_PUBLIC_API_URL}/notificationHub`, {
                accessTokenFactory: () => token
            })
            .withAutomaticReconnect()
            .build();
    }

    public startConnection = async () => {
        try {
            await this.hubConnection.start();
            console.log('Connected');
        } catch (err) {
            console.log('Connection failed: ', err);
        }
    }

    public addNotificationListener = (callback: (notification: INotificationItem) => void) => {
        this.hubConnection.on('ReceiveNotification', callback);
    }

    public stopConnection = () => {
        this.hubConnection.stop();
    }
}
