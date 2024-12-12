import useSWR from 'swr';

interface ITimetableDataProps {
  schoolId: string;
  schoolYearId: number;
  termId: number;
  sessionToken: string;
  date:  Date;
}

const api = process.env.NEXT_PUBLIC_API_URL;

const useTimetableData = ({
  schoolId,
  schoolYearId,
  termId,
  sessionToken,
  date
}: ITimetableDataProps) => {
  const formattedDate = date.toISOString().split("T")[0];
  const endpoint = `${api}/api/schools/${schoolId}/academic-years/${schoolYearId}/timetables/${formattedDate}?termId=${termId}`;

  const { data, error, isValidating } = useSWR(
    sessionToken ? endpoint : null,
    async (url) => {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
          "Content-Type": "application/json",
        },
      });
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message);
      }
      return responseData;
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false
    }
  );

  return { data: data?.result, error, isValidating };
};

export default useTimetableData;
