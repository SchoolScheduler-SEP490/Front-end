import * as yup from "yup";

export const addCombineClassSchema = yup.object().shape({
    
  "subject-id": yup.number().required("Vui lòng chọn môn học"),

  "room-id": yup.number().required("Vui lòng chọn phòng học"),

  "term-id": yup.number().required("Vui lòng chọn học kỳ"),

  "room-subject-code": yup
    .string()
    .required("Mã phòng học không được để trống"),

  "room-subject-name": yup
    .string()
    .required("Tên phòng học không được để trống"),

  model: yup
    .string()
    .required("Vui lòng chọn loại phòng")
    .oneOf(["Full", "NotFull"], "Loại phòng không hợp lệ"),

  "student-class-id": yup
    .array()
    .of(yup.number().min(1, "Lớp học không hợp lệ"))
    .required("Danh sách lớp không được để trống")
    .min(1, "Phải có ít nhất một lớp học"),
});
