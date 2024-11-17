import useNotify from '@/hooks/useNotify';
import { TRANSLATOR } from '@/utils/dictionary';
import { mutate } from 'swr';
import { getUpdateCurriculumApi } from '../_libs/apis';
import { IUpdateCurriculumRequest } from '../_libs/constants';

interface IUpdateCurriculumProps {
	schoolId: number;
	schoolYearId: number;
	subjectGroupId: number;
	sessionToken: string;
	formData: IUpdateCurriculumRequest;
}

const useUpdateCurriculum = async (props: IUpdateCurriculumProps) => {
	const { subjectGroupId, formData, sessionToken, schoolId, schoolYearId } = props;
	const endpoint = getUpdateCurriculumApi({ schoolId, schoolYearId, subjectGroupId });
	let response;

	async function updateCurriculum(url: string) {
		const response = await fetch(url, {
			headers: {
				Authorization: `Bearer ${sessionToken}`,
				'Content-Type': 'application/json',
			},
			method: 'PATCH',
			body: JSON.stringify({
				...formData,
			}),
		});
		const data = await response.json();
		if (!response.ok) {
			throw new Error(data.message);
		}
		return data;
	}

	try {
		// Sử dụng mutate với POST request
		response = await mutate(endpoint, updateCurriculum(endpoint), {
			revalidate: true,
		});
		useNotify({
			message: TRANSLATOR[response?.message || ''] ?? 'Có lỗi xảy ra',
			type: response?.status === 200 ? 'success' : 'error',
		});
		return response;
	} catch (err: any) {
		useNotify({
			message: TRANSLATOR[err.message ?? ''] ?? 'Có lỗi xảy ra',
			type: 'error',
		});
	}
};

export default useUpdateCurriculum;
