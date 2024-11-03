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
  FormHelperText,
} from "@mui/material";
import { useFormik } from "formik";
import { teacherSchema } from "../_libs/teacher_schema";
import dayjs from "dayjs";
import CloseIcon from "@mui/icons-material/Close";
import ContainedButton from "@/commons/button-contained";
import { KeyedMutator } from "swr";
import { useAppContext } from "@/context/app_provider";
import { IAddTeacherData, IDepartment, ISubject } from "../_libs/constants";
import useAddTeacher from "../_hooks/useAddTeacher";
import { getDepartmentName, getSubjectName } from "../_libs/apiTeacher";

//Add new teacher form
interface AddTeacherFormProps {
  open: boolean;
  onClose: (close: boolean) => void;
  mutate: KeyedMutator<any>;
}

const ITEM_HEIGHT = 48;
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

const AddTeacherModal = (props: AddTeacherFormProps) => {
  const { open, onClose, mutate } = props;
  const { schoolId, sessionToken } = useAppContext();
  const [departments, setDepartments] = React.useState<IDepartment[]>([]);
  const [subjects, setSubjects] = React.useState<ISubject[]>([]);

  React.useEffect(() => {
    const loadDepartments = async () => {
      const data = await getDepartmentName(schoolId, sessionToken);
      if (data.result?.items) {
        setDepartments(data.result.items);
      }
    };
    loadDepartments();
  }, [schoolId, sessionToken]);

  React.useEffect(() => {
    const loadSubjects = async () => {
      const data = await getSubjectName(sessionToken, schoolId);
      if (data.result?.items) {
        setSubjects(data.result.items);
      }
    };
    loadSubjects();
  }, [sessionToken, schoolId]);

  const handleClose = () => {
    formik.handleReset(formik.initialValues);
    onClose(false);
  };

  const handleFormSubmit = async (body: IAddTeacherData) => {
    const formattedData = {
      ...body,
      "date-of-birth": dayjs(body["date-of-birth"]).format("YYYY-MM-DD"),
    };
    await useAddTeacher({
      formData: [formattedData],
      schoolId: schoolId,
      sessionToken: sessionToken,
    });
    mutate();
    handleClose();
  };

  const formik = useFormik({
    initialValues: {
      "first-name": "",
      "last-name": "",
      abbreviation: "",
      email: "",
      gender: "Male",
      "department-code": "",
      "date-of-birth": "",
      "teacher-role": "Role1",
      status: "Active",
      phone: "",
      "subjects-abreviation": [],
    },
    validationSchema: teacherSchema,
    onSubmit: async (formData) => {
      handleFormSubmit({
        ...formData,
        "subjects-abreviation": Array.isArray(formData["subjects-abreviation"])
        ? formData["subjects-abreviation"]
        : [formData["subjects-abreviation"]],
      });
    },
  });

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
          Thêm giáo viên
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
                <Grid
                  item
                  xs={3}
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    Họ và tên
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    variant="standard"
                    fullWidth
                    placeholder="Nhập Họ"
                    name="first-name"
                    value={formik.values["first-name"]}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched["first-name"] &&
                      Boolean(formik.errors["first-name"])
                    }
                    helperText={
                      formik.touched["first-name"] &&
                      formik.errors["first-name"]
                    }
                  />
                </Grid>
                <Grid item xs={5}>
                  <TextField
                    variant="standard"
                    fullWidth
                    placeholder="Nhập Tên"
                    name="last-name"
                    value={formik.values["last-name"]}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched["last-name"] &&
                      Boolean(formik.errors["last-name"])
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
                <Grid
                  item
                  xs={3}
                  sx={{ display: "flex", alignItems: "center" }}
                >
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
                <Grid
                  item
                  xs={3}
                  sx={{ display: "flex", alignItems: "center" }}
                >
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
                <Grid
                  item
                  xs={3}
                  sx={{ display: "flex", alignItems: "center" }}
                >
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
                <Grid
                  item
                  xs={3}
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    Tổ bộ môn
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <FormControl
                    fullWidth
                    error={
                      formik.touched["department-code"] &&
                      Boolean(formik.errors["department-code"])
                    }
                  >
                    <Select
                      variant="standard"
                      name="department-code"
                      value={formik.values["department-code"]}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 150,
                            overflow: "auto",
                          },
                        },
                      }}
                    >
                      <MenuItem value="">--Chọn tổ bộ môn--</MenuItem>
                      {departments.map((department) => (
                        <MenuItem
                          key={department["department-code"]}
                          value={department["department-code"]}
                        >
                          {department.name} 
                        </MenuItem>
                      ))}
                    </Select>
                    {formik.touched["department-code"] &&
                      formik.errors["department-code"] && (
                        <FormHelperText className="m-0">
                          {formik.errors["department-code"]}
                        </FormHelperText>
                      )}
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid
                  item
                  xs={3}
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    Môn học áp dụng
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <FormControl
                    fullWidth
                    error={
                      formik.touched["subjects-abreviation"] &&
                      Boolean(formik.errors["subjects-abreviation"])
                    }
                  >
                    <Select
                      variant="standard"
                      multiple
                      name="subjects-abreviation"
                      value={
                        Array.isArray(formik.values["subjects-abreviation"])
                          ? formik.values["subjects-abreviation"]
                          : [formik.values["subjects-abreviation"]]
                      }
                      onChange={(event) => {
                        const value = event.target.value;
                        formik.setFieldValue(
                          "subjects-abreviation",
                          Array.isArray(value) ? value : [value]
                        );
                      }}
                      onBlur={formik.handleBlur}
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 150,
                            overflow: "auto",
                          },
                        },
                      }}
                    >
                      {subjects.map((subject) => (
                        <MenuItem key={subject.id} value={subject.abbreviation}>
                          {`${subject["subject-name"]} - ${subject.abbreviation}`}
                        </MenuItem>
                      ))}
                    </Select>
                    {formik.touched["subjects-abreviation"] &&
                      formik.errors["subjects-abreviation"] && (
                        <FormHelperText className="m-0">
                          {formik.errors["subjects-abreviation"]}
                        </FormHelperText>
                      )}
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid
                  item
                  xs={3}
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    Ngày sinh
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <TextField
                    variant="standard"
                    fullWidth
                    name="date-of-birth"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={formik.values["date-of-birth"]}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched["date-of-birth"] &&
                      Boolean(formik.errors["date-of-birth"])
                    }
                    helperText={
                      formik.touched["date-of-birth"] &&
                      formik.errors["date-of-birth"]
                    }
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid
                  item
                  xs={3}
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    Vai trò
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <FormControl fullWidth>
                    <RadioGroup
                      row
                      name="teacher-role"
                      value={formik.values["teacher-role"]}
                      onChange={formik.handleChange}
                    >
                      <FormControlLabel
                        value="Role1"
                        control={<Radio />}
                        label="Giáo viên"
                      />
                      <FormControlLabel
                        value="Role2"
                        control={<Radio />}
                        label="Trưởng bộ môn"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid
                  item
                  xs={3}
                  sx={{ display: "flex", alignItems: "center" }}
                >
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
                <Grid
                  item
                  xs={3}
                  sx={{ display: "flex", alignItems: "center" }}
                >
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
            title="Thêm giáo viên"
            disableRipple
            type="submit"
            disabled={!formik.isValid}
            styles="bg-primary-300 text-white !py-1 px-4"
          />
          <ContainedButton
            title="Huỷ"
            onClick={handleClose}
            disableRipple
            styles="!bg-basic-gray-active !text-basic-gray !py-1 px-4"
          />
        </div>
      </form>
    </Dialog>
  );
};

export default AddTeacherModal;
