import React from "react";
import {
  Dialog,
  DialogContent,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Grid,
  Typography,
  Select,
  MenuItem,
  IconButton,
} from "@mui/material";
import { useFormik } from "formik";
import { teacherSchema } from "../_libs/teacher_schema";
import dayjs from "dayjs";
import ContainedButton from "@/commons/button-contained";
import CloseIcon from "@mui/icons-material/Close";
import { useUpdateTeacher } from "../_hooks/useUpdateTeacher";
import { IUpdateTeacherData } from "../_libs/apiTeacher";

interface UpdateTeacherFormProps {
  open: boolean;
  onClose: () => void;
  teacherId: number;
  initialData: IUpdateTeacherData;
}

const UpdateTeacherModal: React.FC<UpdateTeacherFormProps> = ({
  open,
  onClose,
  teacherId,
  initialData,
}) => {
  const { editTeacher, isUpdating } = useUpdateTeacher();

  const formik = useFormik({
    initialValues: {
      ...initialData,
      dateOfBirth: dayjs(initialData["date-of-birth"]).format("YYYY-MM-DD"),
    },
    validationSchema: teacherSchema,
    onSubmit: async (values) => {
      const formattedValues: IUpdateTeacherData = {
        "first-name": values["first-name"],
        "last-name": values["last-name"],
        abbreviation: values.abbreviation,
        email: values.email,
        gender: values.gender,
        "department-id": values["department-id"],
        "date-of-birth": dayjs(values.dateOfBirth).format("YYYY-MM-DD"),
        "school-id": 2555,
        "teacher-role": values["teacher-role"],
        status: values.status,
        phone: values.phone,
        "is-deleted": values["is-deleted"],
      };

      const success = await editTeacher(teacherId, formattedValues);
      if (success) {
        onClose();
      }
    },
  });

  const handleClose = () => {
    formik.handleReset;
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <div
        id="modal-header"
        className="w-full h-fit flex flex-row justify-between items-center bg-primary-50 p-3"
      >
        <Typography
          variant="h6"
          component="h2"
          className="text-title-medium-strong font-normal opacity-60"
        >
          Chỉnh sửa giáo viên
        </Typography>
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </div>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={3} sx={{ display: "flex", alignItems: "center" }}>
                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    Họ và tên
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    variant="standard"
                    fullWidth
                    placeholder="Nhập Họ"
                    name="firstName"
                    value={formik.values["first-name"]}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched["first-name"] &&
                      Boolean(formik.errors["first-name"])
                    }
                    helperText={
                      formik.touched["first-name"] && formik.errors["first-name"]
                    }
                  />
                </Grid>
                <Grid item xs={5}>
                  <TextField
                    variant="standard"
                    fullWidth
                    placeholder="Nhập Tên"
                    name="lastName"
                    value={formik.values["last-name"]}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched["last-name"] && Boolean(formik.errors["last-name"])
                    }
                    helperText={
                      formik.touched["last-name"] && formik.errors["last-name"]
                    }
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={3} sx={{ display: "flex", alignItems: "center" }}>
                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    Tên viết tắt
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <TextField
                    variant="standard"
                    fullWidth
                    placeholder="Nhập tên viết tắt giáo viên"
                    name="abbreviation"
                    type="text"
                    value={formik.values.abbreviation}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.abbreviation &&
                      Boolean(formik.errors.abbreviation)
                    }
                    helperText={
                      formik.touched.abbreviation && formik.errors.abbreviation
                    }
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={3} sx={{ display: "flex", alignItems: "center" }}>
                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    Email
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <TextField
                    variant="standard"
                    fullWidth
                    placeholder="Nhập email"
                    name="email"
                    type="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={3} sx={{ display: "flex", alignItems: "center" }}>
                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    Giới tính
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <FormControl component="fieldset">
                    <RadioGroup
                      row
                      name="gender"
                      value={formik.values.gender}
                      onChange={formik.handleChange}
                    >
                      <FormControlLabel
                        value="Male"
                        control={<Radio />}
                        label="Nam"
                      />
                      <FormControlLabel
                        value="Female"
                        control={<Radio />}
                        label="Nữ"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={3} sx={{ display: "flex", alignItems: "center" }}>
                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    Chuyên môn
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <TextField
                    variant="standard"
                    fullWidth
                    placeholder="Nhập môn đảm nhiệm"
                    name="departmentId"
                    type="text"
                    value={formik.values["department-id"]}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched["department-id"] &&
                      Boolean(formik.errors["department-id"])
                    }
                    helperText={
                      formik.touched["department-id"] &&
                      formik.errors["department-id"]
                    }
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={3} sx={{ display: "flex", alignItems: "center" }}>
                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    Ngày sinh
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <TextField
                    variant="standard"
                    fullWidth
                    name="dateOfBirth"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={formik.values.dateOfBirth}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.dateOfBirth &&
                      Boolean(formik.errors.dateOfBirth)
                    }
                    helperText={
                      formik.touched.dateOfBirth && formik.errors.dateOfBirth
                    }
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={3} sx={{ display: "flex", alignItems: "center" }}>
                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    Vai trò
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <FormControl fullWidth>
                    <Select
                      variant="standard"
                      label="Vai trò"
                      name="teacherRole"
                      value={formik.values["teacher-role"]}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    >
                      <MenuItem value="Role1">Giáo viên</MenuItem>
                      <MenuItem value="Role2">Trưởng bộ môn</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={3} sx={{ display: "flex", alignItems: "center" }}>
                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    Trạng thái
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <FormControl fullWidth>
                    <Select
                      variant="standard"
                      name="status"
                      value={formik.values.status}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    >
                      <MenuItem value="Active">Hoạt động</MenuItem>
                      <MenuItem value="Inactive">Vô hiệu</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={3} sx={{ display: "flex", alignItems: "center" }}>
                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    Số điện thoại
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <TextField
                    variant="standard"
                    fullWidth
                    placeholder="Nhập số điện thoại"
                    name="phone"
                    type="text"
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.phone && Boolean(formik.errors.phone)}
                    helperText={formik.touched.phone && formik.errors.phone}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <div className="w-full flex flex-row justify-end items-center gap-2 bg-basic-gray-hover p-3">
          <ContainedButton
            title="Lưu thay đổi"
            disableRipple
            type="submit"
            disabled={!formik.isValid || isUpdating}
            styles="bg-primary-300 text-white !py-1 px-4"
          />
          <ContainedButton
            title="Huỷ"
            onClick={onClose}
            disableRipple
            styles="bg-basic-gray-active text-basic-gray !py-1 px-4"
          />
        </div>
      </form>
    </Dialog>
  );
};

export default UpdateTeacherModal;
