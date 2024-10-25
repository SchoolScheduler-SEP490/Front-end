import useSWR from 'swr';

interface IFetcherProps {
	sessionToken: string;
	pageSize: number;
	pageIndex: number;
	schoolId: string;
	schoolYearId: number;
	subjectGroupId?: number;
	grade?: string;
	deletedIncluded?: boolean;
}

const useFetchSGData = (props: IFetcherProps) => {
	const {
		sessionToken,
		schoolId,
		pageSize,
		schoolYearId,
		grade,
		subjectGroupId,
		pageIndex,
		deletedIncluded,
	} = props;
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
		schoolYearId: schoolYearId.toString(),
		...(grade !== undefined && { grade }),
		...(subjectGroupId !== undefined && {
			subjectGroupId: subjectGroupId.toString(),
		}),
		...(deletedIncluded !== undefined && {
			includeDeleted: deletedIncluded.toString(),
		}),
	}).toString();

	const { data, error, isLoading, isValidating, mutate } = useSWR(
		`${api}/api/subject-groups?${queryString}`,
		fetcher,
		{
			revalidateOnFocus: false,
			revalidateOnReconnect: true,
			revalidateIfStale: true,
		}
	);

	return { data, error, isLoading, isValidating, mutate };
};

export default useFetchSGData;
