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
import {
  IClassDetail,
  IExistingClass,
  IRoom,
  ITeacher,
  IUpdateClassData,
} from "../_libs/constants";
import { updateClassSchema } from "../_libs/class_schema";
import { useEffect, useState } from "react";
import { KeyedMutator } from "swr";
import { useUpdateClass } from "../_hooks/useUpdateClass";
import { CLASSGROUP_STRING_TYPE } from "@/utils/constants";
import { ISubjectGroup } from "../_libs/constants";
import {
  getExistingClasses,
  getRooms,
  getSubjectGroup,
  getTeacherName,
} from "../_libs/apiClass";

interface UpdateClassFormProps {
  open: boolean;
  onClose: (close: boolean) => void;
  classId: number;
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

const UpdateClassModal = (props: UpdateClassFormProps) => {
  const { open, onClose, classId, mutate } = props;
  const { sessionToken, schoolId, selectedSchoolYearId } = useAppContext();
  const api = process.env.NEXT_PUBLIC_API_URL;
  const { editClass, isUpdating } = useUpdateClass(mutate);
  const [subjectGroups, setSubjectGroups] = useState<ISubjectGroup[]>([]);
  const [teachers, setTeachers] = useState<ITeacher[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [classData, setClassData] = useState<IClassDetail | null>(null);
  const [rooms, setRooms] = useState<IRoom[]>([]);
  const [existingClasses, setExistingClasses] = useState<IExistingClass[]>([]);

  const formik = useFormik({
    initialValues: {
      name: "",
      "homeroom-teacher-id": 0,
      "school-year-id": selectedSchoolYearId,
      "main-session": "",
      "is-full-day": false,
      grade: 0,
      "room-id": 0,
    },
    validationSchema: updateClassSchema,
    // validate when input change
    validate: (values) => {
      const errors: { [key: string]: string } = {};
      if (
        existingClasses.some((c) => c.name === values.name && c.id !== classId)
      ) {
        errors.name = "Tên lớp học đã tồn tại";
      }
      if (
        existingClasses.some(
          (c) => c["room-id"] === values["room-id"] && c.id !== classId
        )
      ) {
        errors["room-id"] = "Phòng học đã được sử dụng cho lớp khác";
        console.log("Validation Errors:", errors);
      }
      if (
        existingClasses.some(
          (c) =>
            c["homeroom-teacher-id"] === values["homeroom-teacher-id"] &&
            c.id !== classId
        )
      ) {
        errors["homeroom-teacher-id"] =
          "Giáo viên chủ nhiệm đã được phân công cho lớp khác";
      }
      return errors;
    },
    onSubmit: async (values) => {
      const updatedValues: IUpdateClassData = {
        ...values,
        "school-year-id": selectedSchoolYearId,
      };
      const success = await editClass(classId, updatedValues);
      if (success) {
        useNotify({
          message: "Cập nhật lớp học thành công.",
          type: "success",
        });
        mutate();
        handleClose();
      } else {
        useNotify({
          message: "Cập nhật lớp học thất bại.",
          type: "error",
        });
      }
    },
  });

  useEffect(() => {
    if (!open) {
      setIsLoading(true);
    }
  }, [open]);

  useEffect(() => {
    const loadClassData = async () => {
      try {
        const response = await fetch(
          `${api}/api/schools/${schoolId}/academic-years/${selectedSchoolYearId}/classes/${classId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${sessionToken}`,
            },
          }
        );
        const data = await response.json();
        if (data.status === 200) {
          const gradeNumber = Number(data.result.grade.split("_")[1]);
          setClassData(data);
          formik.setValues({
            name: data.result.name,
            "homeroom-teacher-id": data.result["homeroom-teacher-id"],
            "school-year-id": selectedSchoolYearId,
            "main-session": data.result["main-session"].toString(),
            "is-full-day": data.result["is-full-day"],
            grade: gradeNumber,
            "room-id": data.result["room-id"],
          });
        }
        setIsLoading(false);
      } catch (error) {
        useNotify({
          type: "error",
          message: "Lỗi khi tải dữ liệu lớp học",
        });
      }
    };

    const loadSubjectGroups = async () => {
      const response = await getSubjectGroup(
        sessionToken,
        schoolId,
        selectedSchoolYearId
      );
      if (response.status === 200) {
        setSubjectGroups(response.result.items);
      }
    };

    const loadTeacherName = async () => {
      const response = await getTeacherName(sessionToken, schoolId);
      if (response.status === 200) {
        setTeachers(response.result.items);
      }
    };

    const loadRoomName = async () => {
      const response = await getRooms(sessionToken, schoolId);
      if (response.status === 200) {
        setRooms(response.result.items);
      }
    };

    const loadExistingClasses = async () => {
      try {
        const response = await getExistingClasses(
          schoolId,
          selectedSchoolYearId,
          sessionToken
        );
        if (response.status === 200) {
          setExistingClasses(response.result.items);
        }
      } catch (error) {
        console.error("Failed to load existing classes:", error);
      }
    };

    if (open && isLoading) {
      loadClassData();
      loadSubjectGroups();
      loadTeacherName();
      loadRoomName();
      loadExistingClasses();
    }
  }, [open, isLoading, classId, sessionToken, schoolId, selectedSchoolYearId]);

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
                      labelId="grade-label"
                      id="grade"
                      variant="standard"
                      value={formik.values.grade || ""}
                      onChange={(event) => {
                        formik.setFieldValue(
                          "grade",
                          Number(event.target.value)
                        );
                      }}
                      onBlur={formik.handleBlur("grade")}
                      error={
                        formik.touched.grade && Boolean(formik.errors.grade)
                      }
                      MenuProps={MenuProps}
                      sx={{ width: "100%" }}
                    >
                      {CLASSGROUP_STRING_TYPE.map((item) => (
                        <MenuItem key={item.key} value={item.value}>
                          {item.key}
                        </MenuItem>
                      ))}
                    </Select>
                    {formik.touched.grade && formik.errors.grade && (
                      <FormHelperText error variant="standard">
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
                    Phòng học
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <FormControl
                    fullWidth
                    error={
                      formik.touched["room-id"] &&
                      Boolean(formik.errors["room-id"])
                    }
                  >
                    <Select
                      variant="standard"
                      name="room-id"
                      value={formik.values["room-id"]}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      MenuProps={MenuProps}
                    >
                      <MenuItem value={0}>--Chọn phòng học--</MenuItem>
                      {rooms.map((room) => (
                        <MenuItem key={room.id} value={room.id}>
                          {room.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {formik.touched["room-id"] && formik.errors["room-id"] && (
                      <FormHelperText sx={{ margin: 0 }} error>
                        {formik.errors["room-id"]}
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
                    Giáo viên chủ nhiệm
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <FormControl
                    fullWidth
                    error={
                      formik.touched["homeroom-teacher-id"] &&
                      Boolean(formik.errors["homeroom-teacher-id"])
                    }
                  >
                    <Select
                      variant="standard"
                      name="homeroom-teacher-id"
                      value={formik.values["homeroom-teacher-id"]}
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
                      <MenuItem value={0}>--Chọn giáo viên--</MenuItem>
                      {teachers.map((teacher) => (
                        <MenuItem key={teacher.id} value={teacher.id}>
                          {`${teacher["first-name"]} ${teacher["last-name"]} (${teacher.abbreviation})`}
                        </MenuItem>
                      ))}
                    </Select>
                    {formik.touched["homeroom-teacher-id"] &&
                      formik.errors["homeroom-teacher-id"] && (
                        <FormHelperText sx={{ margin: 0 }} error>
                          {formik.errors["homeroom-teacher-id"]}
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
            styles="!bg-basic-gray-active !text-basic-gray !py-1 px-4"
          />
        </div>
      </form>
    </Dialog>
  );
};
export default UpdateClassModal;
