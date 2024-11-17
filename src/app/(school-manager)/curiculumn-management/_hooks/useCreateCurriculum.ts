import useNotify from '@/hooks/useNotify';
import { TRANSLATOR } from '@/utils/dictionary';
import { mutate } from 'swr';
import { getCreateCurriculumApi } from '../_libs/apis';
import { ICreateCurriculumRequest } from '../_libs/constants';

interface ICreateSubjectProps {
	schoolId: number;
	schoolYearId: number;
	sessionToken: string;
	formData: ICreateCurriculumRequest;
}

const useCreateCurriculum = async (props: ICreateSubjectProps) => {
	const { schoolId, formData, sessionToken, schoolYearId } = props;
	const endpoint = getCreateCurriculumApi({ schoolId, schoolYearId });
	let response;

	async function createSubject(url: string) {
		const response = await fetch(url, {
			headers: {
				Authorization: `Bearer ${sessionToken}`,
				'Content-Type': 'application/json',
			},
			method: 'POST',
			body: JSON.stringify(formData),
		});
		const data = await response.json();
		if (!response.ok) {
			throw new Error(data.message);
		}
		return data;
	}

	try {
		// Sử dụng mutate với POST request
		response = await mutate(endpoint, createSubject(endpoint), {
			revalidate: true,
		});
		useNotify({
			message: TRANSLATOR[response?.message || ''] ?? 'Có lỗi xảy ra',
			type: response?.status === 201 ? 'success' : 'error',
		});
		return response;
	} catch (err: any) {
		useNotify({
			message: TRANSLATOR[err.message ?? ''] ?? 'Có lỗi xảy ra',
			type: 'error',
		});
	}
};

export default useCreateCurriculum;
