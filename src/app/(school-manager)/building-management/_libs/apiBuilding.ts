import {
  IAddBuilding,
  IBuildingDetail,
  IBuildingResponse,
  IUpdateBuilding,
} from "./constants";

const api = process.env.NEXT_PUBLIC_API_URL || "Unknown";

export const addBuilding = async (
  schoolId: string,
  sessionToken: string,
  buildingData: IAddBuilding
) => {
  const url = `${api}/api/schools/${schoolId}/buildings`;
  const requestBody = [buildingData];

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

export const deleteBuildingById = async (
  id: number,
  schoolId: string,
  sessionToken: string
) => {
  const url = `${api}/api/schools/${schoolId}/buildings/${id}`;

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

export const updateBuilding = async (
  id: number,
  schoolId: string,
  buildingData: IUpdateBuilding,
  sessionToken: string
): Promise<boolean> => {
  if (!sessionToken) {
    console.error("Session token is not found. Please log in.");
    return false;
  }

  const url = `${api}/api/schools/${schoolId}/buildings/${id}`;
  const requestBody = buildingData;

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

export const getBuildingById = async (
  id: number,
  schoolId: string,
  sessionToken: string
): Promise<IBuildingDetail> => {
  const url = `${api}/api/schools/${schoolId}/buildings/${id}`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionToken}`,
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message);
  }
  return data.result;
};

export const getExistingBuilding = async (
  schoolId: string,
  sessionToken: string
): Promise<IBuildingResponse> => {
  const intialResponse = await fetch(
    `${api}/api/schools/${schoolId}/buildings?includeRoom=false&pageIndex=1&pageSize=20`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionToken}`,
      },
    }
  );
  const initialData = await intialResponse.json();
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
