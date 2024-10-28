import * as yup from 'yup';

export const createSubjectGroupSchema = yup.object().shape({
	'group-name': yup
		.string()
		.required('Tên nhóm môn học là bắt buộc')
		.max(50, 'Tên nhóm môn học tối đa 50 ký tự'),

	'group-code': yup
		.string()
		.required('Mã nhóm môn học là bắt buộc')
		.matches(/^[A-Z0-9]+$/, 'Mã nhóm môn học phải là chữ cái in hoa và số')
		.max(10, 'Mã nhóm môn học tối đa 10 ký tự'),

	'group-description': yup
		.string()
		.required('Mô tả nhóm môn học là bắt buộc')
		.max(255, 'Mô tả nhóm môn học tối đa 255 ký tự'),

	grade: yup
		.string()
		.required('Khối lớp là bắt buộc')
		.matches(/^\d{1,2}$/, 'Khối lớp phải là số từ 1 đến 12')
		.max(2, 'Khối lớp tối đa 2 ký tự'),

	'school-year-id': yup
		.number()
		.required('ID năm học là bắt buộc')
		.integer('ID năm học phải là số nguyên')
		.positive('ID năm học phải là số dương'),

	'elective-subject-ids': yup
		.array()
		.of(
			yup
				.number()
				.integer('ID môn tự chọn phải là số nguyên')
				.positive('ID môn tự chọn phải là số dương')
		)
		.required('Danh sách ID môn tự chọn là bắt buộc'),

	'specialized-subject-ids': yup
		.array()
		.of(
			yup
				.number()
				.integer('ID môn chuyên phải là số nguyên')
				.positive('ID môn chuyên phải là số dương')
		)
		.required('Danh sách ID môn chuyên là bắt buộc'),
});
