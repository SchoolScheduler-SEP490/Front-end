import * as yup from "yup";

export const classGroupSchema = yup.object().shape({
  "group-name": yup.string().required("Tên tổ hợp không được để trống"),

  "group-description": yup.string().required("Mô tả không được để trống"),

  "student-class-group-code": yup
    .string()
    .required("Mã nhóm lớp không được để trống"),

  grade: yup.string().required("Khối không được để trống"),
});

export const assignStudentClass = yup.object().shape({
  "class-ids": yup.array().min(1, "Vui lòng chọn ít nhất một lớp").required("Vui lòng chọn lớp")
});
