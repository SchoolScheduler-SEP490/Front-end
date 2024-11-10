"use client";

import ContainedButton from "@/commons/button-contained";
import { useAppContext } from "@/context/app_provider";
import useNotify from "@/hooks/useNotify";
import CloseIcon from "@mui/icons-material/Close";
import {
  Dialog,
  FormControl,
  FormControlLabel,
  IconButton,
  Radio,
  RadioGroup,
  Select,
  MenuItem,
  TextField,
  Typography,
  DialogContent,
  Grid,
  FormHelperText,
} from "@mui/material";
import { useFormik } from "formik";
import dayjs from "dayjs";
import { IDepartment, ISubject, IUpdateTeacherRequestBody } from "../_libs/constants";
import { useUpdateTeacher } from "../_hooks/useUpdateTeacher";
import { updateTeacherSchema } from "../_libs/teacher_schema";
import React, { useEffect, useState } from "react";
import { KeyedMutator } from "swr";
import { getDepartmentName, getSubjectName } from "../_libs/apiTeacher";
import { TEACHER_STATUS, TEACHER_STATUS_TRANSLATOR } from "@/utils/constants";

interface UpdateTeacherFormProps {
  open: boolean;
  onClose: (close: boolean) => void;
  teacherId: number;
  mutate: KeyedMutator<any>;
}
const UpdateTeacherModal = (props: UpdateTeacherFormProps) => {
  const { open, onClose, teacherId, mutate } = props;
 const { sessionToken, selectedSchoolYearId, schoolId } = useAppContext();
  const api = process.env.NEXT_PUBLIC_API_URL;
  const { editTeacher, isUpdating } = useUpdateTeacher(mutate);
  const [oldData, setOldData] = useState<IUpdateTeacherRequestBody>(
    {} as IUpdateTeacherRequestBody
  );
  const [departments, setDepartments] = React.useState<IDepartment[]>([]);
  const [subjects, setSubjects] = React.useState<ISubject[]>([]);

  const formik = useFormik({
    initialValues: {
      ...oldData,
      "date-of-birth": dayjs(oldData["date-of-birth"]).format("YYYY-MM-DD"),
      "department-id": oldData["department-id"] || "",
      "teachable-subject-ids": oldData["teachable-subject-ids"] || [],
      "school-id": schoolId,
    },
    validationSchema: updateTeacherSchema,
    onSubmit: async (values) => {
      const updatedTeacher: IUpdateTeacherRequestBody = {
        "first-name": values["first-name"],
        "last-name": values["last-name"],
        abbreviation: values.abbreviation,
        email: values.email,
        gender: values.gender,
        "department-id": values["department-id"],
        "date-of-birth": values["date-of-birth"],
        "school-id": 2555,
        "teacher-role": values["teacher-role"],
        status: values.status,
        phone: values.phone,
        "is-deleted": false,
        "teachable-subject-ids": values["teachable-subject-ids"].map(Number),
      };
      console.log("Form submitted with values:", updatedTeacher);
      const success = await editTeacher(teacherId, updatedTeacher);
      if (success) {
        useNotify({
          message: "Cập nhật giáo viên thành công.",
          type: "success",
        });
        handleClose();
      } else {
        useNotify({
          message: "Cập nhật giáo viên thất bại.",
          type: "error",
        });
        console.log("Failed to update teacher");
      }
    },
    enableReinitialize: true,
  });
  

  useEffect(() => {
    const fetchTeacherById = async () => {
      const response = await fetch(`${api}/api/schools/${schoolId}/teachers/${teacherId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      });
      const data = await response.json();
      if (data.status == 200) {
        console.log("Raw API response:", data.result);
        const teacherData = {
          ...data.result,
          "department-id": data.result["department-id"],
          "teachable-subject-ids": data.result["teachable-subjects"].map(
            (subject: any) => subject["subject-id"]
          ) 
        }
        setOldData(teacherData);
      } else {
        useNotify({
          message: "Lỗi khi tải dữ liệu giáo viên.",
          type: "error",
        });
        console.log(oldData);
      }
    };

    const loadDepartments = async () => {
      const data = await getDepartmentName(schoolId, sessionToken);
      if (data.result?.items) {
        setDepartments(data.result.items);
      }
    }

    const loadSubjects = async () => {
      const subjectData = await getSubjectName(sessionToken, selectedSchoolYearId);
      if (subjectData?.status === 200) {
        setSubjects(subjectData.result.items);
        console.log("Subjects loaded:", subjectData.result.items);
      }
    };

    if (open) {
      fetchTeacherById();
      loadDepartments();
      loadSubjects();
    }
  }, [open, teacherId, sessionToken, schoolId]);

  const handleClose = () => {
    formik.resetForm();
    onClose(false);
  };

  console.log("error", formik.errors);
  console.log("values", formik.values);
  console.log("isValid", formik.isValid);

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
          Cập nhật thông tin giáo viên
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
                    onChange={formik.handleChange("first-name")}
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
                    onChange={formik.handleChange("last-name")}
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
                    onChange={formik.handleChange("abbreviation")}
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
                    onChange={formik.handleChange("email")}
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
                      onChange={formik.handleChange("gender")}
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
                      formik.touched["department-id"] &&
                      Boolean(formik.errors["department-id"])
                    }
                  >
                    <Select
                      variant="standard"
                      name="department-id"
                      value={formik.values["department-id"]}
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
                          key={department.id}
                          value={department.id}
                        >
                          {department.name} 
                        </MenuItem>
                      ))}
                    </Select>
                    {formik.touched["department-id"] &&
                      formik.errors["department-id"] && (
                        <FormHelperText className="m-0">
                          {formik.errors["department-id"]}
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
                    Môn học
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <FormControl fullWidth>
                    <Select
                      variant="standard"
                      multiple
                      name="teachable-subject-ids"
                      value={formik.values["teachable-subject-ids"] || []}
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
                      {subjects.map((subject) => (
                        <MenuItem key={subject.id} value={subject.id}>
                          {`${subject["subject-name"]} (${subject.abbreviation})`}
                        </MenuItem>
                      ))}
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
                    onChange={formik.handleChange("date-of-birth")}
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
                  <FormControl component="fieldset">
                    <RadioGroup
                      row
                      name="teacher-role"
                      value={formik.values["teacher-role"]}
                      onChange={formik.handleChange("teacher-role")}
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
                      value={formik.values.status || 1}
                      onChange={(event) =>
                        formik.setFieldValue("status", event.target.value)
                      }
                      onBlur={formik.handleBlur}
                    >
                      {TEACHER_STATUS.map((status) => (
                        <MenuItem key={status.value} value={status.value}>
                          {TEACHER_STATUS_TRANSLATOR[status.value]}
                        </MenuItem>
                      ))}
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
                    onChange={formik.handleChange("phone")}
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
            title="Cập nhật"
            disableRipple
            type="submit"
            disabled={!formik.dirty}
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

export default UpdateTeacherModal;
