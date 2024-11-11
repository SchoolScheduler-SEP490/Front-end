import useNotify from '@/hooks/useNotify';
import { TRANSLATOR } from '@/utils/dictionary';
import { mutate } from 'swr';
import { ICreateDepartmentRequest } from '../_libs/constants';
import { getCreateDepartmentApi } from '../_libs/apis';

interface ICreateSubjectProps {
	schoolId: number;
	sessionToken: string;
	formData: ICreateDepartmentRequest[];
}

const useCreateDepartment = async (props: ICreateSubjectProps) => {
	const { schoolId, formData, sessionToken } = props;
	const endpoint = getCreateDepartmentApi({ schoolId });
	let response;

	async function createDepartment(url: string) {
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
		response = await mutate(endpoint, createDepartment(endpoint), {
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

export default useCreateDepartment;
