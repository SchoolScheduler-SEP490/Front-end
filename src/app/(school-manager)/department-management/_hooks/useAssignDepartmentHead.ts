import useNotify from '@/hooks/useNotify';
import { TRANSLATOR } from '@/utils/dictionary';
import { mutate } from 'swr';
import { getAssignDepartmentHeadApi } from '../_libs/apis';
import { IDepartmentHeadAssignmentRequest } from '../_libs/constants';

interface IUpdateSubjectProps {
	schoolId: number;
	sessionToken: string;
	formData: IDepartmentHeadAssignmentRequest[];
}

const useAssignDepartmentHead = async (props: IUpdateSubjectProps) => {
	const { formData, sessionToken, schoolId } = props;
	const endpoint = getAssignDepartmentHeadApi({ schoolId });
	let response;

	async function updateDepartment(url: string) {
		const response = await fetch(url, {
			headers: {
				Authorization: `Bearer ${sessionToken}`,
				'Content-Type': 'application/json',
			},
			method: 'PATCH',
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
		response = await mutate(endpoint, updateDepartment(endpoint), {
			revalidate: true,
		});
		useNotify({
			message: TRANSLATOR[response?.message || ''] ?? 'Không thể phân công',
			type: response?.status === 200 ? 'success' : 'error',
		});
		return response;
	} catch (err: any) {
		useNotify({
			message: TRANSLATOR[err.message ?? ''] ?? 'Không thể phân công',
			type: 'error',
		});
	}
};

export default useAssignDepartmentHead;
