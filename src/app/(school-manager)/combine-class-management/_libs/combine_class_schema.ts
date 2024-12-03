import * as yup from "yup";
import { IExistingCombineClass } from "./constants";

export const addCombineClassSchema = (
  existCombineClass: IExistingCombineClass[]
) =>
  yup.object().shape({
    "subject-id": yup.number().required("Vui lòng chọn môn học"),

    "room-id": yup.number().required("Vui lòng chọn phòng học"),

    "term-id": yup.number().required("Vui lòng chọn học kỳ"),

    "room-subject-code": yup
      .string()
      .required("Mã phòng học không được để trống")
      .test("room-code", "Mã phòng học đã tồn tại", function (value) {
        if (!value) return true;
        return !existCombineClass.some(
          (exist) =>
            exist["room-subject-code"].toLowerCase() === value.toLowerCase()
        );
      }),

    "room-subject-name": yup
      .string()
      .required("Tên phòng học không được để trống")
      .test("room-name", "Tên phòng học đã tồn tại", function (value) {
        if (!value || !existCombineClass) return true;
        return !existCombineClass.some(
          (exist) =>
            exist["room-subject-name"]?.toLowerCase() === value?.toLowerCase()
        );
      }),

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

export const updateCombineClassSchema = yup.object().shape({

  "subject-id": yup.number().required("Vui lòng chọn môn học"),

  "room-id": yup.number().required("Vui lòng chọn phòng học"),

  "term-id": yup.number().required("Vui lòng chọn học kỳ"),

  "teacher-id": yup.number().required("Vui lòng chọn giáo viên"),

  "room-subject-code": yup
    .string()
    .required("Mã phòng học không được để trống"),

  "room-subject-name": yup
    .string()
    .required("Tên phòng học không được để trống"),

  session: yup.string().required("Vui lòng chọn buổi học"),

  "student-class-ids": yup
    .array()
    .of(yup.number().min(1, "Lớp học không hợp lệ"))
    .required("Danh sách lớp không được để trống")
    .min(1, "Phải có ít nhất một lớp học"),
});
