"use client";
import {
  IRegisterForm,
  IRegisterResponse,
} from "@/app/(auth)/_utils/constants";
import { useAppContext } from "@/context/app_provider";
import { inter } from "@/utils/fonts";
import {
  FormControl,
  IconButton,
  InputLabel,
  Select,
  styled,
} from "@mui/material";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useFormik } from "formik";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { registerSchema } from "../_libs/register_schema";

const CustomButton = styled(Button)({
  width: "100%",
  borderRadius: 0,
  boxShadow: "none",
  padding: "10px 12px",
  backgroundColor: "var(--primary-normal)",
  fontFamily: [inter].join(","),
});

export const RegisterForm = () => {
  const router = useRouter();
  const api = process.env.NEXT_PUBLIC_API_URL || "Unknown";
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = () => {
    router.push("/login");
  };

  const handleRegister = async ({
    email,
    phone,
    password,
    confirm,
  }: IRegisterForm) => {
    try {
      const response = await fetch(`${api}/api/users/school-manager-register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, phone, password, confirm }),
      });

      const registerResponse: IRegisterResponse = await response.json();

      if (registerResponse.status === 200) {
        router.push("/login");
      } else {
        setError(
          registerResponse.message || "An error occurred during registration."
        );
      }
    } catch (error: any) {
      setError(error.message || "An unexpected error occurred.");
    }
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleShowConfirmPassword = () => {
    setConfirmPassword(!confirmPassword);
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      phone: "",
      password: "",
      confirm: "",
    },
    validationSchema: registerSchema,
    onSubmit: async (formData) => {
      await handleRegister(formData);
    },
  });

  return (
    <div className="w-full">
      <form
        onSubmit={formik.handleSubmit}
        className="flex flex-col justify-start items-center gap-3"
      >
        <FormControl variant="standard" fullWidth>
          <InputLabel>Lựa chọn tỉnh thành</InputLabel>
          <Select fullWidth variant="standard" id="province" name="province" />
        </FormControl>

        <FormControl variant="standard" fullWidth>
          <InputLabel>Chọn/ Nhập tên trường</InputLabel>
          <Select fullWidth variant="standard" id="school" name="school" />
        </FormControl>

        <TextField
          fullWidth
          variant="standard"
          id="email"
          name="email"
          label="Nhập địa chỉ email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
          slotProps={{
            input: {
              endAdornment: (
                <Image
                  className="opacity-30 mx-2 select-none"
                  src="/images/icons/email.png"
                  alt="email"
                  width={20}
                  height={20}
                />
              ),
            },
          }}
        />
        <TextField
          fullWidth
          variant="standard"
          id="phone"
          name="phone"
          label="Nhập số điện thoại"
          value={formik.values.phone}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.phone && Boolean(formik.errors.phone)}
          helperText={formik.touched.phone && formik.errors.phone}
          slotProps={{
            input: {
              endAdornment: (
                <Image
                  className="opacity-30 mx-2 select-none"
                  src="/images/icons/phone.png"
                  alt="phone"
                  width={20}
                  height={20}
                />
              ),
            },
          }}
        />
        <TextField
          fullWidth
          variant="standard"
          id="password"
          name="password"
          label="Nhập mật khẩu"
          type={showPassword ? "text" : "password"}
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
          InputProps={{
            endAdornment: (
              <IconButton
                color="default"
                aria-label="Hiện mật khẩu"
                onClick={handleShowPassword}
              >
                <Image
                  className="opacity-30"
                  src={
                    showPassword
                      ? "/images/icons/hidden.png"
                      : "/images/icons/view.png"
                  }
                  alt="eye"
                  width={20}
                  height={20}
                />
              </IconButton>
            ),
          }}
        />
        <TextField
          fullWidth
          variant="standard"
          id="confirm"
          name="confirm"
          label="Xác nhận mật khẩu"
          type={confirmPassword ? "text" : "password"}
          value={formik.values.confirm}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.confirm && Boolean(formik.errors.confirm)}
          helperText={formik.touched.confirm && formik.errors.confirm}
          InputProps={{
            endAdornment: (
              <IconButton
                color="default"
                aria-label="Hiện mật khẩu"
                onClick={handleShowConfirmPassword}
              >
                <Image
                  className="opacity-30"
                  src={
                    confirmPassword
                      ? "/images/icons/hidden.png"
                      : "/images/icons/view.png"
                  }
                  alt="eye"
                  width={20}
                  height={20}
                />
              </IconButton>
            ),
          }}
        />
        <CustomButton
          variant="contained"
          disableRipple
          type="submit"
          className="mt-4"
        >
          <h4 className="text-body-large-strong font-medium tracking-widest">
            ĐĂNG KÝ
          </h4>
        </CustomButton>
        <h3 className="mt-12 text-body-medium font-normal text-gray-700">
          Đã có tài khoản?{" "}
          <span
            className="text-body-medium font-semibold text-tertiary-normal cursor-pointer"
            onClick={handleLogin}
          >
            Đăng nhập
          </span>
        </h3>
      </form>
    </div>
  );
};
