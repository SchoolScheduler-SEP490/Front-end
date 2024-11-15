import { INotificationResponse } from "./constants";

const api = process.env.NEXT_PUBLIC_API_URL;

export const getNotification = async (
  sessionToken: string,
  accountId: number
): Promise<INotificationResponse> => {
  try {
    const response = await fetch(`${api}/api/notifications/${accountId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${sessionToken}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    if (response.ok) {
      return data;
    }
    throw new Error(data.message);
  } catch (error) {
    console.log("API Error:", error);
    throw error;
  }
};
