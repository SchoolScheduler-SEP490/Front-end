import * as yup from 'yup';

export const curriculumSchema = yup.object().shape({
	'curriculum-name': yup
		.string()
		.required('Tên Khung chương trình là bắt buộc')
		.max(50, 'Tên Khung chương trình tối đa 50 ký tự'),

	'curriculum-code': yup
		.string()
		.required('Mã Khung chương trình là bắt buộc')
		.matches(/^[A-Z0-9\-]+$/, 'Mã Khung chương trình chỉ chứa chữ in hoa, số và dấu gạch ngang')
		.max(20, 'Mã Khung chương trình tối đa 20 ký tự'),

	grade: yup
		.number()
		.oneOf([10, 11, 12], 'Khối lớp không hợp lệ')
		.required('Khối lớp là bắt buộc'),

	'elective-subject-ids': yup
		.array()
		.of(
			yup
				.number()
				.integer('ID môn tự chọn phải là số nguyên')
				.positive('ID môn tự chọn phải là số dương')
		)
		.min(4, 'Phải chọn 4 môn học tự chọn theo chương trình mới')
		.max(4, 'Không được chọn quá 4 môn học tự chọn')
		.required('Danh sách ID môn tự chọn là bắt buộc'),

	'specialized-subject-ids': yup
		.array()
		.min(3, 'Phải chọn 3 môn học chuyên đề theo chương trình mới')
		.max(3, 'Không được chọn quá 3 môn học chuyên đề')
		.of(
			yup
				.number()
				.integer('ID môn chuyên phải là số nguyên')
				.positive('ID môn chuyên phải là số dương')
		)
		.required('Danh sách ID môn chuyên là bắt buộc'),
});
