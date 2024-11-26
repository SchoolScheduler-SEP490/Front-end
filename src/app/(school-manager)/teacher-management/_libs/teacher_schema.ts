import { APPROPRIATE_LEVEL, CLASSGROUP_TRANSLATOR } from "@/utils/constants";
import * as yup from "yup";

export const teacherSchema = yup.object().shape({
  ["first-name"]: yup.string().required("Vui lòng nhập họ giáo viên."),

  ["last-name"]: yup.string().required("Vui lòng nhập tên giáo viên."),

  abbreviation: yup.string().required("Vui lòng nhập tên viết tắt giáo viên."),

  email: yup
    .string()
    .required("Vui lòng nhập địa chỉ email.")
    .email("Email không hợp lệ. Vui lòng nhập lại."),

  gender: yup.string().required("Vui lòng chọn giới tính."),

  ["department-code"]: yup.string().required("Vui lòng chọn mã tổ bộ môn."),

  ["date-of-birth"]: yup.string().required("Vui lòng nhập ngày sinh."),

  ["teacher-role"]: yup.string().required("Vui lòng chọn vai trò."),

  status: yup.string().required("Vui lòng chọn trạng thái."),

  phone: yup
    .string()
    .required("Vui lòng nhập số điện thoại.")
    .matches(/^[0-9]+$/, "Số điện thoại chỉ được chứa số.")
    .min(10, "Số điện thoại phải có đúng 10 số.")
    .max(10, "Số điện thoại phải có đúng 10 số."),

});

export const updateTeacherSchema = yup.object().shape({
  ["first-name"]: yup.string().required("Vui lòng nhập họ giáo viên."),

  ["last-name"]: yup.string().required("Vui lòng nhập tên giáo viên."),

  abbreviation: yup.string().required("Vui lòng nhập tên viết tắt giáo viên."),

  email: yup
    .string()
    .required("Vui lòng nhập địa chỉ email.")
    .email("Email không hợp lệ. Vui lòng nhập lại."),

  gender: yup.string().required("Vui lòng chọn giới tính."),

  ["department-id"]: yup.string().required("Vui lòng chọn mã tổ bộ môn."),

  ["date-of-birth"]: yup.string().required("Vui lòng nhập ngày sinh."),

  ["teacher-role"]: yup.string().required("Vui lòng chọn vai trò."),

  status: yup.string().required("Vui lòng chọn trạng thái."),

  phone: yup
    .string()
    .required("Vui lòng nhập số điện thoại.")
    .matches(/^[0-9]+$/, "Số điện thoại chỉ được chứa số.")
    .min(10, "Số điện thoại phải có đúng 10 số.")
    .max(10, "Số điện thoại phải có đúng 10 số."),

    "teachable-subjects": yup.array().of(
      yup.object().shape({
        "subject-abreviation": yup.string().required(),
        "grades": yup.array().of(yup.string()).min(1, "Vui lòng chọn ít nhất một khối."),
        "is-main": yup.boolean()
      })
    )
});

export const addTeachableSubject = yup.object().shape({
  subjects: yup.array().of(
    yup.object().shape({
      "subject-abreviation": yup.string().required("Vui lòng chọn môn học"),
      "list-approriate-level-by-grades": yup.array().of(
        yup.object().shape({
          "appropriate-level": yup.string()
            .oneOf(APPROPRIATE_LEVEL.map(level => level.value))
            .required("Vui lòng chọn độ phù hợp"),
          grade: yup.string()
            .oneOf(Object.keys(CLASSGROUP_TRANSLATOR))
            .required("Vui lòng chọn khối")
        })
      ).min(1, "Vui lòng chọn ít nhất một khối"),
      "is-main": yup.boolean().required("Vui lòng chọn loại môn học")
    })
  )
});
