import * as yup from 'yup';

export const createSubjectGroupSchema = yup.object().shape({
	'group-name': yup
		.string()
		.required('Tên Tổ hợp môn là bắt buộc')
		.max(50, 'Tên Tổ hợp môn tối đa 50 ký tự'),

	'group-code': yup
		.string()
		.required('Mã Tổ hợp môn là bắt buộc')
		.matches(/^[A-Z0-9À-ỹ]+$/, 'Mã Tổ hợp môn phải là chữ cái in hoa và số')
		.max(10, 'Mã Tổ hợp môn tối đa 10 ký tự'),

	'group-description': yup.string().max(255, 'Mô tả Tổ hợp môn tối đa 255 ký tự'),

	grade: yup
		.number()
		.oneOf([10, 11, 12], 'Khối lớp không hợp lệ')
		.required('Khối lớp là bắt buộc'),

	'school-year-id': yup
		.number()
		.min(0, 'Cần phải nhập thông tin năm học')
		.required('Cần phải nhập thông tin năm học'),

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
