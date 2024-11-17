export interface INotificationItem {
  title: string;
  message: string;
  type: string;
  "create-date": string;
  "is-read": boolean;
  link: string;
  "notification-url": string;
}

export interface INotificationResponse {
    status: number;
    message: string;
    result: {
        "total-item-count": number;
        "page-size": number;
        "total-pages-count": number;
        "page-index": number;
        next: boolean;
        previous: boolean;
        items: INotificationItem[];
    }
}

export interface ISendNotification {
  title: string;
  message: string;
  type: "HeThong";
  link: string;
  "notification-url": string;
}
