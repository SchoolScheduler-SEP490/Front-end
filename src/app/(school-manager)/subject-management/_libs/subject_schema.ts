import * as yup from 'yup';

export const addSubjectSchema = yup.object().shape({
	'subject-name': yup
		.string()
		.required('Tên môn học là bắt buộc')
		.min(3, 'Tên môn học phải có ít nhất 3 ký tự'),
	abbreviation: yup.string().required('Tên tắt TKB là bắt buộc'),
	description: yup.string().required('Tổ bộ môn là bắt buộc'),
	'subject-group-type': yup.string().required('Loại môn học là bắt buộc'),
});
