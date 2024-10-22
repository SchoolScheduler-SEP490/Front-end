import useSWR from 'swr';

interface IFetcherProps {
	sessionToken: string;
	schoolId: string;
	pageSize: number;
	pageIndex: number;
	roomTypeId?: number;
}

const useFetchData = (props: IFetcherProps) => {
	const { sessionToken, schoolId, pageSize, pageIndex, roomTypeId } = props;
	const api = process.env.NEXT_PUBLIC_API_URL;

	async function fetcher(url: string) {
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
	}

	const queryString = new URLSearchParams({
		schoolId: schoolId,
		pageSize: pageSize.toString(),
		pageIndex: pageIndex.toString(),
		...(roomTypeId !== undefined && { RoomTypeId: roomTypeId.toString() }),
	}).toString();

	const { data, error, isLoading, isValidating, mutate } = useSWR(
		`${api}/api/Room?${queryString}`,
		fetcher,
		{
			revalidateOnFocus: false,
			revalidateOnReconnect: true,
			revalidateOnMount: true,
			refreshInterval: 30000,
		}
	);

	return { data, error, isLoading, isValidating, mutate };
};

export default useFetchData;
