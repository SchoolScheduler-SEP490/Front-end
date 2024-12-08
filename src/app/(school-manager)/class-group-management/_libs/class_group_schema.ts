import * as yup from "yup";
import { IExistingClassGroup } from "./constants";

export const classGroupSchema = (existingClassGroup: IExistingClassGroup[]) =>
  yup.object().shape({
    "group-name": yup
      .string()
      .required("Tên nhóm lớp không được để trống")
      .test("unique-name", "Tên nhóm lớp đã tồn tại", function (value) {
        if (!value) return true;
        return !existingClassGroup.some(
          (exist) => exist["group-name"].toLowerCase() === value.toLowerCase()
        );
      }),

    "group-description": yup.string().required("Mô tả không được để trống"),

    "student-class-group-code": yup
      .string()
      .required("Mã nhóm lớp không được để trống")
      .test("unique-name", "Mã nhóm lớp đã tồn tại", function (value) {
        if (!value) return true;
        return !existingClassGroup.some(
          (exist) => exist["student-class-group-code"].toLowerCase() === value.toLowerCase()
        );
      }),

    grade: yup.string().required("Khối không được để trống"),
  });

export const assignStudentClass = yup.object().shape({
  "class-ids": yup
    .array()
    .min(1, "Vui lòng chọn ít nhất một lớp")
    .required("Vui lòng chọn lớp"),
});

export const updateClassGroupSchema = yup.object().shape({
  "group-name": yup.string().required("Tên nhóm lớp không được để trống"),

  "group-description": yup.string().required("Mô tả không được để trống"),

  "student-class-group-code": yup
    .string()
    .required("Mã nhóm lớp không được để trống"),

  grade: yup.string().required("Khối không được để trống"),
});
