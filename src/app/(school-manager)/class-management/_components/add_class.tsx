import React, { useEffect } from "react";
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
  Checkbox,
  FormHelperText,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ContainedButton from "@/commons/button-contained";
import { useFormik } from "formik";
import { classSchema } from "../_libs/class_schema";
import { KeyedMutator } from "swr";
import { useAppContext } from "@/context/app_provider";
import {
  IAddClassData,
  IExistingClass,
  IRoom,
  ISubjectGroup,
  ITeacher,
} from "../_libs/constants";
import useAddClass from "../_hooks/useAddClass";
import {
  getExistingClasses,
  getRooms,
  getSubjectGroup,
  getTeacherName,
} from "../_libs/apiClass";
import { CLASSGROUP_STRING_TYPE, SUBJECT_GROUP_TYPE } from "@/utils/constants";

interface AddClassFormProps {
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
const AddClassModal = (props: AddClassFormProps) => {
  const { open, onClose, mutate } = props;
  const { schoolId, sessionToken, selectedSchoolYearId } = useAppContext();
  const [teachers, setTeachers] = React.useState<ITeacher[]>([]);
  const [subjectGroups, setSubjectGroups] = React.useState<ISubjectGroup[]>([]);
  const [rooms, setRooms] = React.useState<IRoom[]>([]);
  const [existingClasses, setExistingClasses] = React.useState<IExistingClass[]>([]);

  React.useEffect(() => {
    const loadTeachers = async () => {
      const data = await getTeacherName(sessionToken, schoolId);
      if (data.result?.items) {
        setTeachers(data.result.items);
      }
    };
    loadTeachers();
  }, [schoolId, sessionToken]);

  React.useEffect(() => {
    const loadSubjectGroup = async () => {
      const data = await getSubjectGroup(
        sessionToken,
        schoolId,
        selectedSchoolYearId
      );
      if (data?.status === 200 && data.result?.items) {
        setSubjectGroups(data.result.items);
      }
    };

    loadSubjectGroup();
  }, [schoolId, sessionToken]);

  React.useEffect(() => {
    const loadRooms = async () => {
      const data = await getRooms(sessionToken, schoolId);
      if (data.result?.items) {
        setRooms(data.result.items);
      }
    };
    loadRooms();
  }, [schoolId, sessionToken]);

  const handleFormSubmit = async (body: IAddClassData) => {
    await useAddClass({
      schoolId: schoolId,
      sessionToken: sessionToken,
      formData: [body],
      schoolYearId: selectedSchoolYearId,
    });
    mutate();
    handleClose();
  };

  const handleClose = () => {
    formik.handleReset(formik.initialValues);
    onClose(false);
  };

  // load existing classes compared to the new class
  useEffect(() => {
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
    loadExistingClasses();
  }, [schoolId, selectedSchoolYearId, sessionToken]);

  const formik = useFormik({
    initialValues: {
      name: "",
      "homeroom-teacher-abbreviation": "",
      "main-session": "",
      "is-full-day": false,
      grade: "",
      "room-code": "",
    },
    validationSchema: classSchema(existingClasses),
    onSubmit: async (values) => {
      const formData: IAddClassData = {
        name: values.name,
        "homeroom-teacher-abbreviation":
          values["homeroom-teacher-abbreviation"],
        "main-session": Number(values["main-session"]),
        "is-full-day": values["is-full-day"],
        grade: values.grade,
        "room-code": values["room-code"],
      };
      await handleFormSubmit(formData);
    },
  });

  console.log(formik.values);

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
          Thêm lớp học
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
                      value={formik.values.grade}
                      onChange={(event) =>
                        formik.setFieldValue("grade", event.target.value)
                      }
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
                      formik.touched["room-code"] &&
                      Boolean(formik.errors["room-code"])
                    }
                  >
                    <Select
                      variant="standard"
                      name="room-code"
                      value={formik.values["room-code"]}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      MenuProps={MenuProps}
                    >
                      <MenuItem value="">--Chọn phòng học--</MenuItem>
                      {rooms.map((room) => (
                        <MenuItem key={room.id} value={room["room-code"]}>
                          {room.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {formik.touched["room-code"] &&
                      formik.errors["room-code"] && (
                        <FormHelperText sx={{ margin: 0 }} error>
                          {formik.errors["room-code"]}
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
                      formik.touched["homeroom-teacher-abbreviation"] &&
                      Boolean(formik.errors["homeroom-teacher-abbreviation"])
                    }
                  >
                    <Select
                      variant="standard"
                      name="homeroom-teacher-abbreviation"
                      value={formik.values["homeroom-teacher-abbreviation"]}
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
                      <MenuItem>--Chọn giáo viên--</MenuItem>
                      {teachers.map((teacher) => (
                        <MenuItem key={teacher.id} value={teacher.abbreviation}>
                          {`${teacher["first-name"]} ${teacher["last-name"]} - ${teacher.abbreviation}`}
                        </MenuItem>
                      ))}
                    </Select>
                    {formik.touched["homeroom-teacher-abbreviation"] &&
                      formik.errors["homeroom-teacher-abbreviation"] && (
                        <FormHelperText className="m-0">
                          {formik.errors["homeroom-teacher-abbreviation"]}
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
            title="Thêm lớp học"
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
export default AddClassModal;
