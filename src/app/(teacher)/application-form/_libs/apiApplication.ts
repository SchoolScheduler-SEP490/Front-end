import { ISendApplication } from "./constants";

const api = process.env.NEXT_PUBLIC_API_URL;

export const sendApplication = async (
  sessionToken: string,
  formData: ISendApplication
) => {
  try {
    const url = `${api}/api/submit-requests`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionToken}`,
      },
      body: JSON.stringify(formData),
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to send application');
    }
    return data;
  } catch (error) {
    console.error("Error sending application:", error);
    throw error;
  }
};
