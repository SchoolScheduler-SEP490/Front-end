import * as yup from 'yup';

export const teacherSchema = yup.object().shape({
  firstName: yup.string().required('Vui lòng nhập họ giáo viên.'),

  lastName: yup.string().required('Vui lòng nhập tên giáo viên.'),

  abbreviation: yup.string().required('Vui lòng nhập tên viết tắt giáo viên.'),

  email: yup.string().required('Vui lòng nhập địa chỉ email.').email('Email không hợp lệ. Vui lòng nhập lại.'),

  gender: yup.string().required('Vui lòng chọn giới tính.'),

  departmentCode: yup.string().required('Vui lòng chọn mã tổ bộ môn.'),

  dateOfBirth: yup.string().required('Vui lòng nhập ngày sinh.'),

  teacherRole: yup.string().required('Vui lòng chọn vai trò.'),

  status: yup.string().required('Vui lòng chọn trạng thái.'),

  phone: yup
    .string()
    .required('Vui lòng nhập số điện thoại.')
    .matches(/^[0-9]+$/, 'Số điện thoại chỉ được chứa số.')
    .min(10, 'Số điện thoại phải có đúng 10 số.')
    .max(10, 'Số điện thoại phải có đúng 10 số.'),
});

export const updateTeacherSchema = yup.object().shape({
  ['first-name']: yup.string().required('Vui lòng nhập họ giáo viên.'),

  ['last-name']: yup.string().required('Vui lòng nhập tên giáo viên.'),

  abbreviation: yup.string().required('Vui lòng nhập tên viết tắt giáo viên.'),

  email: yup.string().required('Vui lòng nhập địa chỉ email.').email('Email không hợp lệ. Vui lòng nhập lại.'),

  gender: yup.string().required('Vui lòng chọn giới tính.'),

  ['department-id']: yup.string().required('Vui lòng chọn mã tổ bộ môn.'),

  ['date-of-birth']: yup.string().required('Vui lòng nhập ngày sinh.'),

  ['teacher-role']: yup.string().required('Vui lòng chọn vai trò.'),

  status: yup.string().required('Vui lòng chọn trạng thái.'),

  phone: yup
    .string()
    .required('Vui lòng nhập số điện thoại.')
    .matches(/^[0-9]+$/, 'Số điện thoại chỉ được chứa số.')
    .min(10, 'Số điện thoại phải có đúng 10 số.')
    .max(10, 'Số điện thoại phải có đúng 10 số.'),
})