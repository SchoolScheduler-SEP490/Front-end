const api = process.env.NEXT_PUBLIC_API_URL || "Unknown";

interface IBuildingFetchProps {
  sessionToken: string;
  schoolId: string;
}

export const fetchBuildingName = async (props: IBuildingFetchProps) => {
  const { sessionToken, schoolId } = props;

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
  const url = `${api}/api/rooms/${id}`;

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
