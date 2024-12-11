import useNotify from '@/hooks/useNotify';
import { TRANSLATOR } from '@/utils/dictionary';
import { mutate } from 'swr';
import { getGenerateTimetableApi } from '../_libs/apis';
import { IGenerateTimetableRequest } from '../_libs/constants';

interface IGenerateTimetableProps {
	sessionToken: string;
	schoolId: number;
	schoolYearId: number;
	formData: IGenerateTimetableRequest;
}

const useGenerateTimetable = async (props: IGenerateTimetableProps) => {
	const { formData, sessionToken, schoolId, schoolYearId } = props;
	const endpoint = getGenerateTimetableApi({ schoolId, schoolYearId });
	let response;

	async function assignTeacher(url: string) {
		const response = await fetch(url, {
			headers: {
				Authorization: `Bearer ${sessionToken}`,
				'Content-Type': 'application/json',
			},
			method: 'POST',
			body: JSON.stringify(formData),
		});
		const data = await response.json();
		// if (!response.ok) {
		// 	throw new Error((await data).Message);
		// }
		return data;
	}

	try {
		// Sử dụng mutate với POST request
		response = await mutate(endpoint, assignTeacher(endpoint), {
			revalidate: true,
		});
		return response;
	} catch (err: any) {
		useNotify({
			message: err?.Message ?? 'Có lỗi xảy ra',
			type: 'error',
		});
	}
};

export default useGenerateTimetable;
