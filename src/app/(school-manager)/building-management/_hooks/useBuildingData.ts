import useSWR from "swr";

interface IBuildingDataProps {
  sessionToken: string;
  schoolId: string;
  pageSize: number;
  pageIndex: number;
}

const useBuildingData = ({
  sessionToken,
  schoolId,
  pageSize,
  pageIndex,
}: IBuildingDataProps) => {
  const api = process.env.NEXT_PUBLIC_API_URL || "Unknown";

  const fetcher = async (url: string) => {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message);
    }
    return data;
  };

  const endpoint = `${api}/api/schools/${schoolId}/buildings?includeRoom=false&pageIndex=${pageIndex}&pageSize=${pageSize}`;

  const { data, error, isValidating, mutate } = useSWR(
    sessionToken ? endpoint : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      revalidateIfStale: true,
      shouldRetryOnError: false,
    }
  );

  return { data, error, isValidating, mutate };
}

export default useBuildingData;