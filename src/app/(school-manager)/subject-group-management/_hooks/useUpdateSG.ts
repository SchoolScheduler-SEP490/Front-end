import useNotify from '@/hooks/useNotify';
import { TRANSLATOR } from '@/utils/dictionary';
import { mutate } from 'swr';
import { getUpdateSubjectGroupApi } from '../_libs/apis';
import { IUpdateSubjectGroupRequest } from '../_libs/constants';

interface IUpdateSubjectProps {
	schoolId: number;
	schoolYearId: number;
	subjectGroupId: number;
	sessionToken: string;
	formData: IUpdateSubjectGroupRequest;
}

const useUpdateSubjectGroup = async (props: IUpdateSubjectProps) => {
	const { subjectGroupId, formData, sessionToken, schoolId, schoolYearId } = props;
	const endpoint = getUpdateSubjectGroupApi({ schoolId, schoolYearId, subjectGroupId });
	let response;

	async function updateSubjectGroup(url: string) {
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
		response = await mutate(endpoint, updateSubjectGroup(endpoint), {
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

export default useUpdateSubjectGroup;
