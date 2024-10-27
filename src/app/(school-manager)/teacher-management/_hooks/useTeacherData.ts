import useSWR from 'swr';

interface ITeacherDataProps {
  sessionToken: string;
  schoolId: string;
  pageSize: number;
  pageIndex: number;
}

const useTeacherData = ({ sessionToken, schoolId, pageSize, pageIndex }: ITeacherDataProps) => {
  const api = process.env.NEXT_PUBLIC_API_URL || 'Unknown';
  
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

  const endpoint = `${api}/api/teachers?schoolId=${schoolId}&includeDeleted=false&pageSize=${pageSize}&pageIndex=${pageIndex}`;

  const { data, error, isLoading, isValidating, mutate } = useSWR(
    sessionToken ? endpoint : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      revalidateIfStale: true,
    }
  );

  return { data, error, isLoading, isValidating, mutate };
};

export default useTeacherData;
