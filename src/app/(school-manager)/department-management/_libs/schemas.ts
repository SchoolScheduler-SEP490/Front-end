import * as yup from 'yup';

export const departmentSchema = yup.object().shape({
	name: yup.string().required('Tên tổ bộ môn là bắt buộc'),
	'department-code': yup.string().required('Mã tổ bộ môn là bắt buộc'),
	description: yup.string(),
});
