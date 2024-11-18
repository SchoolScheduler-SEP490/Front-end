import * as yup from "yup";

export const classSchema = yup.object().shape({
  name: yup.string().required("Vui lòng nhập tên lớp"),

  ["homeroom-teacher-abbreviation"]: yup
    .string()
    .required("Vui lòng chọn tên của giáo viên chủ nhiệm"),

  ["main-session"]: yup.number().required("Vui lòng chọn ca học chính"),

  ["is-full-day"]: yup.boolean().required("Vui lòng chọn"),

  grade: yup.number().required("Vui lòng chọn khối lớp"),

  ["room-code"]: yup.string().required("Vui lòng chọn phòng học"),

});

export const updateClassSchema = yup.object().shape({
  name: yup.string().required("Vui lòng nhập tên lớp"),

  ["homeroom-teacher-id"]: yup.number().required("Vui lòng chọn giáo viên chủ nhiệm"),

  ["main-session"]: yup.number().required("Vui lòng chọn ca học chính"),

  ["is-full-day"]: yup.boolean().required("Vui lòng chọn"),

  grade: yup.number().required("Vui lòng chọn khối lớp"),

  ["room-id"]: yup.number().required("Vui lòng chọn phòng học"),  

});
