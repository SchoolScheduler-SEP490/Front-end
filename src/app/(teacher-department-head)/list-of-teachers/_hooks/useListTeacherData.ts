import useSWR from "swr";

interface IListTeacherDataProps {
  sessionToken: string;
  schoolId: string;
  pageSize: number;
  pageIndex: number;
  departmentId?: number | null;
}

const useListTeacherData = ({
  sessionToken,
  schoolId,
  pageSize,
  pageIndex,
  departmentId,
}: IListTeacherDataProps) => {
  const api = process.env.NEXT_PUBLIC_API_URL;

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

  const endpoint = `${api}/api/schools/${schoolId}/teachers?${
    departmentId ? `departmentId=${departmentId}&` : ""
  }includeDeleted=false&pageSize=${pageSize}&pageIndex=${pageIndex}`;
  
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

export default useListTeacherData;
