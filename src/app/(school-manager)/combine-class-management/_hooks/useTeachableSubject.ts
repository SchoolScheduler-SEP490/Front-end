import useSWR from 'swr';
import { getTeachableSubject } from '../_libs/apiCombineClass';

interface TeachableSubjectProps {
  schoolId: number;
  subjectId: number;
  grade: string;
  sessionToken: string;
}

const useTeachableSubject = ({
  schoolId,
  subjectId,
  grade,
  sessionToken,
}: TeachableSubjectProps) => {
  const fetcher = async () => {
    const response = await getTeachableSubject(schoolId, subjectId, grade, sessionToken);
    return response;
  };

  const { data, error, isLoading, mutate } = useSWR(
    sessionToken ? ['teachableSubject', schoolId, subjectId, grade] : null,
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
    data,
    error,
    isLoading,
    mutate
  };
};

export default useTeachableSubject;
