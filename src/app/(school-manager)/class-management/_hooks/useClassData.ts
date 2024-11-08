import useSWR from "swr";

interface IClassDataProps {
  sessionToken: string;
  schoolId: string;
  pageSize: number;
  pageIndex: number;
  selectedSchoolYearId: number;
}

const useClassData = ({
  sessionToken,
  schoolId,
  pageSize,
  pageIndex,
  selectedSchoolYearId
}: IClassDataProps) => {
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

  const endpoint = `${api}/api/schools/${schoolId}/academic-years/${selectedSchoolYearId}/classes?includeDeleted=false&pageIndex=${pageIndex}&pageSize=${pageSize}`;

  const { data, error, isValidating, mutate } = useSWR(
    sessionToken ? endpoint : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      revalidateIfStale: true,
    }
  );

  return { data, error, isValidating, mutate };
};

export default useClassData;
