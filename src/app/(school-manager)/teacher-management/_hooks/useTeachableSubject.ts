import useSWR from 'swr';
import { getTeacherSubject } from "../_libs/apiTeacher";

interface ITeachableSubjectProps {
  schoolId: string;
  teacherId: number | string | null;
  sessionToken: string;
}

const useTeachableSubject = (props: ITeachableSubjectProps) => {
  const { schoolId, teacherId, sessionToken } = props;

  async function fetcher(url: string) {
    const response = await getTeacherSubject(schoolId, Number(teacherId), sessionToken);
    if (response.status !== 200) {
      throw new Error('Failed to fetch teachable subjects');
    }
    return response.result;
  }
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    teacherId ? ['teachable-subjects', schoolId, teacherId] : null,
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateOnMount: false,
      shouldRetryOnError: false,
    }
  );

  return {
    teachableSubjects: data?.["teachable-subjects"] || [],
    departmentName: data?.["department-name"] || "",
    isLoading,
    error,
    isValidating,
    mutate
  };
};

export default useTeachableSubject;
