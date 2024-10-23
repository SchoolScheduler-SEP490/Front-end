import useSWR, { mutate } from 'swr';
import { IAddSubjectRequestBody } from '../../_utils/contants';

interface ICreateSubjectProps {
	schoolId: string;
	sessionToken: string;
	formData: IAddSubjectRequestBody[];
}

const useCreateSubject = async (props: ICreateSubjectProps) => {
	const { schoolId, formData, sessionToken } = props;
	const api = process.env.NEXT_PUBLIC_API_URL;
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
		response = await mutate(
			`${api}/api/subjects$/{schoolId}/subjects`,
			createSubject(`${api}/api/subjects/${schoolId}/subjects`),
			{
				revalidate: true,
			}
		);
		return response;
	} catch (err) {
		console.error('Lỗi khi gửi dữ liệu:', err);
	}
};

export default useCreateSubject;