import { SUBJECT_GROUP_TYPE } from '@/utils/constants';
import * as yup from 'yup';

export const addSubjectSchema = yup.object().shape({
	'subject-name': yup
		.string()
		.required('Tên môn học là bắt buộc')
		.min(3, 'Tên môn học phải có ít nhất 3 ký tự')
		.matches(
			RegExp('^[a-zA-Z0-9À-ỹ ]+$'),
			'Tên môn học không được chứa các ký tự đặc biệt'
		),
	abbreviation: yup
		.string()
		.required('Tên tắt TKB là bắt buộc')
		.matches(
			RegExp('^[a-zA-Z0-9]+$'),
			'Tên tắt TKB không được chứa các ký tự đặc biệt'
		),

	description: yup.string().required('Tổ bộ môn là bắt buộc'),
	'subject-group-type': yup
		.string()
		.required('Loại môn học là bắt buộc')
		.oneOf(
			SUBJECT_GROUP_TYPE.map((type) => type.key),
			'Loại môn học không hợp lệ'
		),
});

export const updateSubjectSchema = yup.object().shape({
	'subject-name': yup
		.string()
		.required('Tên môn học là bắt buộc')
		.min(3, 'Tên môn học phải có ít nhất 3 ký tự')
		.matches(
			RegExp('^[a-zA-Z0-9À-ỹ ]+$'),
			'Tên môn học không được chứa các ký tự đặc biệt'
		),
	abbreviation: yup
		.string()
		.required('Tên tắt TKB là bắt buộc')
		.matches(
			RegExp('^[a-zA-Z0-9]+$'),
			'Tên tắt TKB không được chứa các ký tự đặc biệt'
		),
	description: yup.string().required('Tổ bộ môn là bắt buộc'),
	'is-required': yup.boolean().required('Trường này là bắt buộc'),
	'total-slot-in-year': yup
		.number()
		.required('Tổng số tiết trong năm là bắt buộc')
		.min(0, 'Tổng số tiết trong năm phải lớn hơn hoặc bằng 0'),
	'slot-specialized': yup
		.number()
		.required('Số tiết chuyên ngành là bắt buộc')
		.min(0, 'Số tiết chuyên ngành phải lớn hơn hoặc bằng 0'),
	'subject-group-type': yup
		.string()
		.required('Loại môn học là bắt buộc')
		.oneOf(
			SUBJECT_GROUP_TYPE.map((type) => type.key),
			'Loại môn học không hợp lệ'
		),
});
