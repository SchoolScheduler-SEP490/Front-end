import useNotify from '@/hooks/useNotify';
import { TRANSLATOR } from '@/utils/dictionary';
import { mutate } from 'swr';
import { IUpdateDepartmentRequest } from '../_libs/constants';
import { getUpdateDepartmentApi } from '../_libs/apis';

interface IUpdateSubjectProps {
	schoolId: number;
	departmentId: number;
	sessionToken: string;
	formData: IUpdateDepartmentRequest;
}

const useUpdateDepartment = async (props: IUpdateSubjectProps) => {
	const { departmentId, formData, sessionToken, schoolId } = props;
	const endpoint = getUpdateDepartmentApi({ schoolId, departmentId });
	let response;

	async function updateDepartment(url: string) {
		const response = await fetch(url, {
			headers: {
				Authorization: `Bearer ${sessionToken}`,
				'Content-Type': 'application/json',
			},
			method: 'PUT',
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
		response = await mutate(endpoint, updateDepartment(endpoint), {
			revalidate: true,
		});
		useNotify({
			message: TRANSLATOR[response?.message || ''] ?? 'Không thể cập nhật tổ bộ môn',
			type: response?.status === 200 ? 'success' : 'error',
		});
		return response;
	} catch (err: any) {
		useNotify({
			message: TRANSLATOR[err.message ?? ''] ?? 'Không thể cập nhật tổ bộ môn',
			type: 'error',
		});
	}
};

export default useUpdateDepartment;
