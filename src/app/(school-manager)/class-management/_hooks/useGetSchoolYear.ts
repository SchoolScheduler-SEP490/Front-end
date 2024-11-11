import useSWR from 'swr';

const useGetSchoolYear = (sessionToken: string) => {
    const api = process.env.NEXT_PUBLIC_API_URL || "Unknown";
    const endpoint = `${api}/api/academic-years`;

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

    const { data, error } = useSWR(sessionToken ? endpoint : null, fetcher, {
        revalidateOnFocus: false,
        revalidateOnReconnect: true,
        revalidateIfStale: true,
        shouldRetryOnError: false,
    });

    return { data, error };
};

export default useGetSchoolYear;
