import * as yup from "yup";
import { IExistingClass } from "./constants";

// uniqueness checks on the class name and homeroom teacher assignments and room.
export const classSchema = (existingClasses: IExistingClass[]) =>
  yup.object().shape({
    name: yup
      .string()
      .required("Vui lòng nhập tên lớp")
      .test("unique-name", "Tên lớp học đã tồn tại", function (value) {
        if (!value) return true;
        return !existingClasses.some(
          (existingClass) =>
            existingClass.name.toLowerCase() === value.toLowerCase()
        );
      }),

    "homeroom-teacher-abbreviation": yup
      .string()
      .required("Vui lòng chọn tên của giáo viên chủ nhiệm")
      .test(
        "teacher-assigned",
        "Giáo viên chủ nhiệm đã được phân công cho lớp khác",
        function (value) {
          if (!value) return true;
          return !existingClasses.some(
            (existingClass) =>
              existingClass["homeroom-teacher-abbreviation"] === value
          );
        }
      ),

    ["main-session"]: yup.number().required("Vui lòng chọn ca học chính"),

    ["is-full-day"]: yup.boolean().required("Vui lòng chọn"),

    grade: yup.number().required("Vui lòng chọn khối lớp"),

    "room-code": yup
      .string()
      .required("Vui lòng chọn phòng học")
      .test(
        "room-available",
        "Phòng học đã được sử dụng cho lớp khác",
        function (value) {
          if (!value) return true;
          return !existingClasses.some(
            (existingClass) => existingClass["room-name"] === value
          );
        }
      ),
  });

export const updateClassSchema = yup.object().shape({
  name: yup.string().required("Vui lòng nhập tên lớp"),

  ["homeroom-teacher-id"]: yup
    .number()
    .required("Vui lòng chọn giáo viên chủ nhiệm"),

  ["main-session"]: yup.number().required("Vui lòng chọn ca học chính"),

  ["is-full-day"]: yup.boolean().required("Vui lòng chọn"),

  grade: yup.number().required("Vui lòng chọn khối lớp"),

  ["room-id"]: yup.number().required("Vui lòng chọn phòng học"),
});
