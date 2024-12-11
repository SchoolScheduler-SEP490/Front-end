"use client";
import { IRegisterForm } from "@/app/(auth)/_utils/constants";
import { useAppContext } from "@/context/app_provider";
import { inter } from "@/utils/fonts";
import {
  Box,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  styled,
  Typography,
} from "@mui/material";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useFormik } from "formik";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { registerSchema } from "../_libs/register_schema";
import {
  getDistrict,
  getProvince,
  getSchool,
  registerSchool,
} from "../_libs/apiRegister";
import { IDistrict, IProvince, ISchool } from "../_libs/constant";
import { Autocomplete } from "@mui/material";
import useNotify from "@/hooks/useNotify";

const CustomButton = styled(Button)({
  width: "100%",
  borderRadius: 0,
  boxShadow: "none",
  padding: "10px 12px",
  backgroundColor: "var(--primary-normal)",
  fontFamily: [inter].join(","),
});

const ITEM_HEIGHT = 40;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
      scrollbars: "none",
    },
  },
};

export const RegisterForm = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [provinces, setProvinces] = useState<IProvince[]>([]);
  const [districts, setDistricts] = useState<IDistrict[]>([]);
  const [schools, setSchools] = useState<ISchool[]>([]);
  const [selectedProvinceId, setSelectedProvinceId] = useState<number>(0);
  const [selectedDistrictCode, setSelectedDistrictCode] = useState<number>(0);
  const [searchSchoolValue, setSearchSchoolValue] = useState<string>("");
  const [selectedSchoolId, setSelectedSchoolId] = useState<number>(0);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  const handleLogin = () => {
    router.push("/login");
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
      "confirm-account-password": "",
    },
    validationSchema: registerSchema,
    onSubmit: async (values) => {},
  });

  const handleFormSubmit = async (formData: IRegisterForm) => {
    try {
      const response = await registerSchool(formData);
      if (response.status === 201) {
        useNotify({
          message: "Đăng ký tài khoản thành công.",
          type: "success",
        });
        router.push("/login");
      } else {
        setError(response.message);
      }
    } catch (error) {
      console.error("Registration failed:", error);
      setError("Registration failed. Please try again.");
    }
  };

  useEffect(() => {
    const fetchProvince = async () => {
      try {
        const response = await getProvince();
        setProvinces(response);
      } catch (error) {
        console.error("Failed to fetch province:", error);
      }
    };
    fetchProvince();
  }, []);

  useEffect(() => {
    const fetchDistricts = async () => {
      if (selectedProvinceId) {
        try {
          const response = await getDistrict(selectedProvinceId);
          setDistricts(response);
        } catch (error) {
          console.error("Failed to fetch districts:", error);
        }
      }
    };
    fetchDistricts();
  }, [selectedProvinceId]);

  useEffect(() => {
    const fetchSchools = async () => {
      if (selectedProvinceId && selectedDistrictCode) {
        try {
          const response = await getSchool(
            selectedProvinceId,
            selectedDistrictCode
          );
          setSchools(response);
        } catch (error) {
          console.error("Failed to fetch schools:", error);
        }
      }
    };
    fetchSchools();
  }, [selectedProvinceId, selectedDistrictCode]);

  const handleProvinceChange = (event: SelectChangeEvent<number>) => {
    setSelectedProvinceId(event.target.value as number);
  };

  const handleDistrictChange = (event: SelectChangeEvent<number>) => {
    setSelectedDistrictCode(event.target.value as number);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  };

  const sortedProvinces = provinces.sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  const sortedDistricts = districts.sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  const checkPasswordRequirements = (password: string) => {
    setPasswordRequirements({
      length: password.length >= 8 && password.length <= 12,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    });
  };

  return (
    <div className="w-full">
      <form
        id="registerForm"
        onSubmit={(event: any) => {
          event.preventDefault();
          handleFormSubmit({
            "school-id": selectedSchoolId,
            email: formik.values.email,
            phone: formik.values.phone,
            password: formik.values.password,
            "confirm-account-password":
              formik.values["confirm-account-password"],
          });
        }}
        className="flex flex-col justify-start items-center gap-3"
      >
        <FormControl variant="standard" fullWidth>
          <InputLabel>Lựa chọn tỉnh thành</InputLabel>
          <Select
            fullWidth
            variant="standard"
            id="province"
            name="province"
            value={selectedProvinceId}
            onChange={handleProvinceChange}
            MenuProps={MenuProps}
          >
            {sortedProvinces.map((province) => (
              <MenuItem key={province.id} value={province.id}>
                {province.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl variant="standard" fullWidth>
          <InputLabel>Lựa chọn quận/ huyện</InputLabel>
          <Select
            fullWidth
            variant="standard"
            id="district"
            name="district"
            value={selectedDistrictCode}
            onChange={handleDistrictChange}
            MenuProps={MenuProps}
          >
            {sortedDistricts.map((district) => (
              <MenuItem
                key={district["district-code"]}
                value={district["district-code"]}
              >
                {district.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl variant="standard" fullWidth>
          <Autocomplete
            fullWidth
            id="school"
            options={schools}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                label="Chọn/ Nhập tên trường"
              />
            )}
            value={
              schools.find((school) => school.id === selectedSchoolId) || null
            }
            onChange={(event, newValue) => {
              setSelectedSchoolId(newValue ? newValue.id : 0);
            }}
            inputValue={searchSchoolValue}
            onInputChange={(event, newInputValue) => {
              setSearchSchoolValue(newInputValue);
            }}
          />
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
          onChange={(e) => {
            formik.handleChange(e);
            checkPasswordRequirements(e.target.value);
          }}
          onFocus={() => setIsPasswordFocused(true)}
          onBlur={(e) => {
            formik.handleBlur(e);
            setIsPasswordFocused(false);
          }}
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
        <Box sx={{ width: "100%" }}>
          {isPasswordFocused && (
            <>
              {!passwordRequirements.length && (
                <Typography
                  sx={{
                    color: formik.values.password
                      ? "error.main"
                      : "text.primary",
                    fontSize: "0.875rem",
                    marginBottom: "4px",
                  }}
                >
                  • Mật khẩu phải từ 8 - 12 ký tự
                </Typography>
              )}

              {!passwordRequirements.uppercase && (
                <Typography
                  sx={{
                    color: formik.values.password
                      ? "error.main"
                      : "text.primary",
                    fontSize: "0.875rem",
                    marginBottom: "2px",
                  }}
                >
                  • Mật khẩu phải chứa ít nhất 1 chữ in hoa
                </Typography>
              )}

              {!passwordRequirements.lowercase && (
                <Typography
                  sx={{
                    color: formik.values.password
                      ? "error.main"
                      : "text.primary",
                    fontSize: "0.875rem",
                    marginBottom: "2px",
                  }}
                >
                  • Mật khẩu phải chứa ít nhất 1 chữ thường
                </Typography>
              )}

              {!passwordRequirements.special && (
                <Typography
                  sx={{
                    color: formik.values.password
                      ? "error.main"
                      : "text.primary",
                    fontSize: "0.875rem",
                    marginBottom: "2px",
                  }}
                >
                  • Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt
                </Typography>
              )}

              {!passwordRequirements.number && (
                <Typography
                  sx={{
                    color: formik.values.password
                      ? "error.main"
                      : "text.primary",
                    fontSize: "0.875rem",
                    marginBottom: "2px",
                  }}
                >
                  • Mật khẩu phải chứa ít nhất 1 số
                </Typography>
              )}
            </>
          )}
        </Box>
        <TextField
          fullWidth
          variant="standard"
          id="confirm-account-password"
          name="confirm-account-password"
          label="Xác nhận mật khẩu"
          type={confirmPassword ? "text" : "password"}
          value={formik.values["confirm-account-password"]}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched["confirm-account-password"] &&
            Boolean(formik.errors["confirm-account-password"])
          }
          helperText={
            formik.touched["confirm-account-password"] &&
            formik.errors["confirm-account-password"]
          }
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
