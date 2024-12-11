import * as yup from "yup";

export const registerSchema = yup.object().shape({
  province: yup.string().required("Vui lòng chọn tỉnh thành."),

  district: yup.string().required("Vui lòng chọn quận/ huyện."),

  school: yup.string().required("Vui lòng chọn trường."),

  email: yup
    .string()
    .required("Nhập địa chỉ email đăng nhập.")
    .email("Email không hợp lệ. Vui lòng nhập lại."),

  phone: yup
    .string()
    .required("Nhập số điện thoại.")
    .min(10, "Số điện thoại không hợp lệ. Vui lòng nhập lại.")
    .max(10, "Số điện thoại không hợp lệ. Vui lòng nhập lại."),

  password: yup
    .string()
    .required("Nhập mật khẩu.")
    .min(8)
    .max(12),

  "confirm-account-password": yup
    .string()
    .required("Nhập lại mật khẩu.")
    .oneOf([yup.ref("password")], "Mật khẩu không khớp. Vui lòng nhập lại."),
});
