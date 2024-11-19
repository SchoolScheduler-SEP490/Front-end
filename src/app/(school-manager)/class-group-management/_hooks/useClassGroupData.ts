import useSWR from "swr";

interface IClassGroupDataProps {
  sessionToken: string;
  schoolId: string;
  pageSize: number;
  pageIndex: number;
  schoolYearId: number;
}

const useClassGroupData = ({
  sessionToken,
  schoolId,
  pageSize,
  pageIndex,
  schoolYearId,
}: IClassGroupDataProps) => {
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

  const endpoint = `${api}/api/schools/${schoolId}/academic-years/${schoolYearId}/class-groups?pageIndex=${pageIndex}&pageSize=${pageSize}`;

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
};

export default useClassGroupData;
