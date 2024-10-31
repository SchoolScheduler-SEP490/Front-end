import { IAddRoomData } from "./constants";

const api = process.env.NEXT_PUBLIC_API_URL || "Unknown";

interface IBuildingFetchProps {
  sessionToken: string;
  schoolId: string;
}

export const fetchBuildingName = async ({
  sessionToken,
  schoolId,
}: IBuildingFetchProps) => {
  const queryString = new URLSearchParams({
    schoolId: schoolId,
    pageSize: "20",
    pageIndex: "1",
    includeRoom: "false",
  }).toString();

  const response = await fetch(`${api}/api/buildings?${queryString}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionToken}`,
    },
  });

  return response.json();
};

export const deleteRoomById = async (
  id: number,
  sessionToken: string
): Promise<void> => {
  if (!sessionToken) {
    throw new Error("Session token not found. Please log in.");
  }
  const url = `${api}/api/Room/${id}`;

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
  const url = `${api}/api/Room?schoolId=${schoolId}`;
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
  schoolId: string
) => {
  const initialResponse = await fetch(
    `${api}/api/subjects/${schoolId}/subjects?includeDeleted=false&pageSize=1&pageIndex=1`,
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
    `${api}/api/subjects/${schoolId}/subjects?includeDeleted=false&pageSize=${totalCount}&pageIndex=1`,
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
