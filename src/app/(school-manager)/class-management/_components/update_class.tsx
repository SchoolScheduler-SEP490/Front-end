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
  Checkbox,
  FormHelperText,
} from "@mui/material";
import { useFormik } from "formik";
import { IUpdateClassData } from "../_libs/constants";
import { updateClassSchema } from "../_libs/class_schema";
import { useEffect, useState } from "react";
import { KeyedMutator } from "swr";
import { useUpdateClass } from "../_hooks/useUpdateClass";

interface UpdateClassFormProps {
  open: boolean;
  onClose: (close: boolean) => void;
  classId: number;
  mutate: KeyedMutator<any>;
}

const UpdateClassModal = (props: UpdateClassFormProps) => {
  const { open, onClose, classId, mutate } = props;
  const { sessionToken } = useAppContext();
  const api = process.env.NEXT_PUBLIC_API_URL;
  const { editClass, isUpdating } = useUpdateClass(mutate);
  const [oldData, setOldData] = useState<IUpdateClassData>(
    {} as IUpdateClassData
  );

  const formik = useFormik({
    initialValues: {
      ...oldData,
    },
    validationSchema: updateClassSchema,
    onSubmit: async (values) => {
      const success = await editClass(classId, values);
      if (success) {
        console.log("Class updated successfully");
        useNotify({
          message: "Cập nhật lớp học thành công.",
          type: "success",
        });
        handleClose();
      } else {
        console.log("Failed to update teacher");
        useNotify({
          message: "Cập nhật lớp học thất bại.",
          type: "error",
        });
      }
    },
    enableReinitialize: true,
  });

  useEffect(() => {
    const fetchClassById = async () => {
      const response = await fetch(`${api}/api/student-classes/${classId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      });
      const data = await response.json();
      if (data.status !== 200) {
        useNotify({
          type: "error",
          message: data.message,
        });
      } else {
        setOldData({
          name: data.result.name,
          "homeroom-teacher-id": data.result["homeroom-teacher-id"],
          "school-id": data.result["school-id"],
          "school-year-id": data.result["school-year-id"],
          "main-session": data.result["main-session"],
          "is-full-day": data.result["is-full-day"],
          "period-count": data.result["period-count"],
          grade: data.result.grade,
          "subject-group-id": data.result["subject-group-id"],
        });
        console.log(oldData);
      }
    };
    if (open) {
      fetchClassById();
    }
  }, [open]);

  const handleClose = () => {
    formik.resetForm();
    onClose(false);
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
          Cập nhật thông tin lớp học
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
                    Tên lớp
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <TextField
                    variant="standard"
                    fullWidth
                    placeholder="Nhập tên lớp"
                    name="name"
                    type="text"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.name && Boolean(formik.errors.name)}
                    helperText={formik.touched.name && formik.errors.name}
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
                    Khối
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <FormControl
                    fullWidth
                    error={formik.touched.grade && Boolean(formik.errors.grade)}
                  >
                    <Select
                      variant="standard"
                      name="grade"
                      value={formik.values.grade}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.grade && Boolean(formik.errors.grade)
                      }
                    >
                      <MenuItem value={0}>0</MenuItem>
                      <MenuItem value={1}>1</MenuItem>
                    </Select>
                    {formik.touched.grade && formik.errors.grade && (
                      <FormHelperText className="m-0">
                        {formik.errors.grade}
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
                    Số tiết học
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <TextField
                    variant="standard"
                    fullWidth
                    type="number"
                    name="period-count"
                    value={formik.values["period-count"]}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched["period-count"] &&
                      Boolean(formik.errors["period-count"])
                    }
                    helperText={
                      formik.touched["period-count"] &&
                      formik.errors["period-count"]
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
                    Buổi chính khóa
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <FormControl component="fieldset">
                    <RadioGroup
                      row
                      name="main-session"
                      value={formik.values["main-session"]}
                      onChange={formik.handleChange}
                    >
                      <FormControlLabel
                        value="0"
                        control={<Radio />}
                        label="Chiều"
                      />
                      <FormControlLabel
                        value="1"
                        control={<Radio />}
                        label="Sáng"
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
                    Học cả ngày
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="is-full-day"
                        checked={Boolean(formik.values["is-full-day"])}
                        onChange={(e) => {
                          formik.setFieldValue("is-full-day", e.target.checked);
                        }}
                      />
                    }
                    label=""
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
            disabled={!formik.isValid}
            styles="bg-primary-300 text-white !py-1 px-4"
          />
          <ContainedButton
            title="Huỷ"
            onClick={handleClose}
            disableRipple
            styles="!bg-basic-gray-active text-basic-gray !py-1 px-4"
          />
        </div>
      </form>
    </Dialog>
  );
};
export default UpdateClassModal;