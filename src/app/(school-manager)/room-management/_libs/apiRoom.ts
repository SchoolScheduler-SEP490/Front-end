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
