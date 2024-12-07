import * as yup from "yup";
import { IExistingClass, IExistingCombineClass } from "./constants";

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
      .of(yup.number())
      .required("Danh sách lớp không được để trống")
      .min(2, "Số lượng lớp phải lớn hơn 1")
      .test(
        "unique-class",
        "Một số lớp đã được ghép trong môn học này",
        function (value) {
          if (!value) return true;

          const subjectId = this.parent["subject-id"];

          const conflictingClasses = existCombineClass.filter(
            (combineClass) =>
              // Check same subject and overlapping classes
              combineClass["subject-id"] === subjectId &&
              combineClass["student-class"].some((existingClass) =>
                value.includes(existingClass.id)
              )
          );

          return conflictingClasses.length === 0;
        }
      ),
  });

export const updateCombineClassSchema = (
  existCombineClass: IExistingCombineClass[],
  currentId: number
) => {
  if (!existCombineClass) {
    existCombineClass = [];
  }

  return yup.object().shape({
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
      .of(yup.number())
      .required("Danh sách lớp không được để trống")
      .min(1, "Phải có ít nhất một lớp học")
      .test(
        "unique-class",
        "Một số lớp đã được ghép trong môn học này",
        function (value) {
          if (!value) return true;

          const subjectId = this.parent["subject-id"];

          // Add null checks
          if (!existCombineClass || !Array.isArray(existCombineClass)) {
            return true;
          }

          const otherCombineClasses = existCombineClass.filter(
            (c) => c.id !== currentId
          );

          const conflictingClasses = otherCombineClasses.filter(
            (combineClass) =>
              combineClass["subject-id"] === subjectId &&
              combineClass["student-class"].some((existingClass) =>
                value.includes(existingClass.id)
              )
          );

          return conflictingClasses.length === 0;
        }
      ),
  });
};
