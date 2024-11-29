import { IAddRoomData, IRoomResponse, IUpdateRoomData } from "./constants";

const api = process.env.NEXT_PUBLIC_API_URL || "Unknown";

export const fetchBuildingName = async (
  sessionToken: string,
  schoolId: string
) => {
  const initialResponse = await fetch(
    `${api}/api/schools/${schoolId}/buildings?includeRoom=false&pageIndex=1&pageSize=20`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionToken}`,
      },
    }
  );

  const initialData = await initialResponse.json();
  const totalCount = initialData.result["total-item-count"];

  const response = await fetch(
    `${api}/api/schools/${schoolId}/buildings?includeRoom=false&pageIndex=1&pageSize=${totalCount}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionToken}`,
      },
    }
  );

  const data = await response.json();
  return data;
};

export const deleteRoomById = async (
  id: number,
  sessionToken: string,
  schoolId: string
): Promise<void> => {
  if (!sessionToken) {
    throw new Error("Session token not found. Please log in.");
  }
  const url = `${api}/api/schools/${schoolId}/rooms/${id}`;

  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionToken}`,
    },
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
};

export const addRoom = async (
  schoolId: string,
  sessionToken: string,
  roomData: IAddRoomData
): Promise<any> => {
  if (!sessionToken) {
    throw new Error("Session token not found. Please log in.");
  }
  const url = `${api}/api/schools/${schoolId}/rooms`;
  const requestBody = [
    {
      ...roomData,
      "subjects-abreviation": Array.isArray(roomData["subjects-abreviation"])
        ? roomData["subjects-abreviation"]
        : [roomData["subjects-abreviation"]],
    },
  ];

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionToken}`,
    },
    body: JSON.stringify(requestBody),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message);
  }
  return data;
};

export const getSubjectName = async (
  sessionToken: string,
  selectedSchoolYearId: number
) => {
  const initialResponse = await fetch(
    `${api}/api/subjects?schoolYearIdint=${selectedSchoolYearId}&includeDeleted=false&pageIndex=1&pageSize=20`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionToken}`,
      },
    }
  );

  const initialData = await initialResponse.json();
  const totalCount = initialData.result["total-item-count"];

  const response = await fetch(
    `${api}/api/subjects?schoolYearIdint=${selectedSchoolYearId}&includeDeleted=false&pageIndex=1&pageSize=${totalCount}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionToken}`,
      },
    }
  );

  const data = await response.json();
  return data;
};

export const updateRoom = async (
  roomId: number,
  sessionToken: string,
  schoolId: string,
  roomData: IUpdateRoomData
): Promise<boolean> => {
  if (!sessionToken) {
    throw new Error("Session token not found. Please log in.");
  }
  const url = `${api}/api/schools/${schoolId}/rooms/${roomId}`;
  const requestBody = roomData;
  console.log("Request Body:", requestBody);

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionToken}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error occurred while sending request:", error);
    return false;
  }
};

export const getExistingRoom = async (
  schoolId: string,
  sessionToken: string
): Promise<IRoomResponse> => {

  const initialResponse = await fetch (
    `${api}/api/schools/${schoolId}/rooms?pageIndex=1&pageSize=20`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionToken}`,
      },
    }
  );

  const initialData = await initialResponse.json();
  const totalCount = initialData.result["total-item-count"];

  const response = await fetch (
    `${api}/api/schools/${schoolId}/rooms?pageIndex=1&pageSize=${totalCount}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionToken}`,
      },
    }
  );
  const data = await response.json();
  return data;
}