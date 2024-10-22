import * as yup from 'yup';

export const teacherSchema = yup.object().shape({
  firstName: yup.string().required('Vui lòng nhập họ giáo viên.'),

  lastName: yup.string().required('Vui lòng nhập tên giáo viên.'),

  gender: yup.string().required('Vui lòng chọn giới tính.'),

  dateOfBirth: yup.string().required('Vui lòng nhập ngày sinh.'),

  email: yup.string().required('Vui lòng nhập địa chỉ email.').email('Email không hợp lệ. Vui lòng nhập lại.'),

  phone: yup.string().required('Vui lòng nhập số điện thoại.').min(10, 'Số điện thoại không hợp lệ. Vui lòng nhập lại.').max(10, 'Số điện thoại không hợp lệ. Vui lòng nhập lại.'),

  nameAbbreviation: yup.string().required('Vui lòng nhập tên viết tắt giáo viên.'),

  teachingSubject: yup.string().required('Vui lòng chọn chuyên môn.'),

  subjectDepartment: yup.string().required('Vui lòng chọn tổ bộ môn.'),

  role: yup.string().required('Vui lòng chọn vai trò.'),

  teacherGroup: yup.string().required('Vui lòng chọn nhóm giáo viên.'),

});