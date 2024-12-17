"use client";

import ContainedButton from "@/commons/button-contained";
import { useAppContext } from "@/context/app_provider";
import useNotify from "@/hooks/useNotify";
import CloseIcon from "@mui/icons-material/Close";
import {
  Dialog,
  IconButton,
  TextField,
  Typography,
  DialogContent,
  Grid,
  FormControl,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { KeyedMutator } from "swr";
import {
  IClassCombination,
  ICombineClassDetail,
  IExistingCombineClass,
  IRoom,
  IStudentClass,
  ISubject,
  ITeachableSubject,
  ITerm,
} from "../_libs/constants";
import { useUpdateCombineClass } from "../_hooks/useUpdateCombineClass";
import {
  getClassCombination,
  getCombineClassDetail,
  getExistingCombineClass,
  getRoomName,
  getSubjectName,
  getTermName,
} from "../_libs/apiCombineClass";
import { updateCombineClassSchema } from "../_libs/combine_class_schema";
import {
  CLASSGROUP_TRANSLATOR,
  MAIN_SESSION,
  MAIN_SESSION_TRANSLATOR,
  ROOM_SUBJECT_MODEL,
} from "@/utils/constants";
import useTeachableSubject from "../_hooks/useTeachableSubject";

interface UpdateCombineClassFormProps {
  open: boolean;
  onClose: (close: boolean) => void;
  combineClassId: number;
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

const UpdateCombineClassModal = (props: UpdateCombineClassFormProps) => {
  const { open, onClose, combineClassId, mutate } = props;
  const { sessionToken, schoolId, selectedSchoolYearId } = useAppContext();
  const { editCombineClass, isUpdating } = useUpdateCombineClass(mutate);
  const [isLoading, setIsLoading] = useState(true);
  const [combineClassData, setCombineClassData] =
    useState<ICombineClassDetail | null>(null);
  const [existCombineClass, setExistCombineClass] = useState<
    IExistingCombineClass[]
  >([]);
  const [subjects, setSubjects] = useState<ISubject[]>([]);
  const [rooms, setRooms] = useState<IRoom[]>([]);
  const [termName, setTermName] = useState<ITerm[]>([]);
  const [availableClasses, setAvailableClasses] = useState<IClassCombination[]>(
    []
  );

  type ModelType = (typeof ROOM_SUBJECT_MODEL)[number]["key"];

  const formik = useFormik({
    initialValues: {
      "subject-id": 0,
      "room-id": 0,
      "term-id": 0,
      "teacher-id": 0,
      "room-subject-code": "",
      "room-subject-name": "",
      model: ROOM_SUBJECT_MODEL[0].key as ModelType,
      session: "",
      "student-class-ids": [] as number[],
      grade: "",
    },
    validationSchema: updateCombineClassSchema(existCombineClass, combineClassId),
    validate: (values) => {
      const errors: { [key: string]: string } = {};
      if (
        existCombineClass.some(
          (c) =>
            c["room-subject-code"] === values["room-subject-code"] &&
            c.id !== combineClassId
        )
      ) {
        errors["room-subject-code"] = "Mã lớp ghép đã tồn tại";
      }
      if (
        existCombineClass.some(
          (c) =>
            c["room-subject-name"] === values["room-subject-name"] &&
            c.id !== combineClassId
        )
      ) {
        errors["room-subject-name"] = "Tên lớp ghép đã tồn tại";
      }
      return errors;
    },
    onSubmit: async (values) => {
      const success = await editCombineClass(combineClassId, values);
      if (success) {
        useNotify({
          message: "Cập nhật lớp ghép thành công.",
          type: "success",
        });
        handleClose();
        mutate();
      } else {
        useNotify({
          message: "Cập nhật lớp ghép thất bại.",
          type: "error",
        });
      }
    },
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log("Loading data for combineClassId:", combineClassId);
        // Get combine class detail
        const response = await getCombineClassDetail(
          schoolId,
          combineClassId,
          sessionToken
        );

        const combineClass = response.result.items[0];
        console.log("Found combine class:", combineClass);
        setCombineClassData(combineClass);

        formik.setValues({
          "subject-id": combineClass["subject-id"],
          "room-id": combineClass["room-id"],
          "term-id": combineClass["term-id"],
          "teacher-id": combineClass["teacher-id"],
          "room-subject-code": combineClass["room-subject-code"],
          "room-subject-name": combineClass["room-subject-name"],
          model: combineClass.model,
          grade: combineClass["e-grade"],
          session: combineClass.session,
          "student-class-ids": combineClass["student-class"].map(
            (sc: IStudentClass) => sc.id
          ),
        });
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    const loadExistingCombineClass = async () => {
      try {
        const data = await getExistingCombineClass(schoolId, sessionToken);
        setExistCombineClass(data.result.items);
      } catch (error) {
        console.error("Error loading existing combine class:", error);
      }
    };

    if (open) {
      loadData();
      loadExistingCombineClass();
    }
  }, [
    open,
    isLoading,
    combineClassId,
    subjects,
    schoolId,
    sessionToken,
    selectedSchoolYearId,
  ]);

  useEffect(() => {
    const fetchSubjects = async () => {
      const response = await getSubjectName(sessionToken, selectedSchoolYearId);
      if (response.status === 200) {
        setSubjects(response.result.items);
      }
    };
    fetchSubjects();
  }, [sessionToken, selectedSchoolYearId]);

  useEffect(() => {
    const fetchRooms = async () => {
      const selectedClassCount = formik.values["student-class-ids"].length;
      if (selectedClassCount > 0) {
        const response = await getRoomName(
          sessionToken,
          schoolId,
          selectedClassCount
        );
        if (response.status === 200) {
          const filteredRooms = response.result.items.filter(
            (room: IRoom) => room["max-class-per-time"] >= selectedClassCount
          );
          setRooms(filteredRooms);
        }
      }
    };
    fetchRooms();
  }, [formik.values["student-class-ids"]]);

  useEffect(() => {
    const fetchTerm = async () => {
      try {
        const response = await getTermName(sessionToken, selectedSchoolYearId);
        if (response.status === 200) {
          setTermName(response.result.items);
        }
      } catch (error) {
        console.error("Failed to fetch term name:", error);
      }
    };
    fetchTerm();
  }, [sessionToken, selectedSchoolYearId]);

  const { data: teachableSubjects } = useTeachableSubject({
    schoolId: Number(schoolId),
    subjectId: formik.values["subject-id"],
    grade: combineClassData?.["e-grade"] || "",
    sessionToken,
  });

  useEffect(() => {
    const fetchAvailableClasses = async () => {
      if (
        formik.values.grade &&
        formik.values.session &&
        formik.values["subject-id"] &&
        formik.values["term-id"]
      ) {
        const response = await getClassCombination(
          sessionToken,
          schoolId,
          selectedSchoolYearId,
          formik.values["subject-id"],
          formik.values["term-id"],
          formik.values.grade,
          formik.values.session
        );

        if (response.status === 200) {
          setAvailableClasses(response.result);
        }
      }
    };

    fetchAvailableClasses();
  }, [
    formik.values.grade,
    formik.values.session,
    formik.values["subject-id"],
    formik.values["term-id"],
  ]);

  const handleClose = () => {
    formik.resetForm();
    onClose(false);
  };

  useEffect(() => {
    if (!open) {
      setIsLoading(true);
    }
  }, [open]);

  return (
    <Dialog open={open} onClose={() => onClose(false)} maxWidth="sm" fullWidth>
      <div className="w-full h-fit flex flex-row justify-between items-center bg-primary-50 p-3">
        <Typography
          variant="h6"
          className="text-title-medium-strong font-normal opacity-60"
        >
          Cập nhật lớp ghép
        </Typography>
        <IconButton onClick={() => onClose(false)}>
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
                    Môn học
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <FormControl variant="standard" fullWidth>
                    <Select
                      name="subject-id"
                      value={formik.values["subject-id"]}
                      onChange={formik.handleChange}
                      error={
                        formik.touched["subject-id"] &&
                        Boolean(formik.errors["subject-id"])
                      }
                      MenuProps={MenuProps}
                    >
                      {subjects.map((subject) => (
                        <MenuItem key={subject.id} value={subject.id}>
                          {subject["subject-name"]}
                        </MenuItem>
                      ))}
                    </Select>
                    {formik.touched["subject-id"] &&
                      formik.errors["subject-id"] && (
                        <FormHelperText error>
                          {formik.errors["subject-id"]}
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
                  <FormControl variant="standard" fullWidth>
                    <Select
                      name="room-id"
                      value={formik.values["room-id"]}
                      onChange={formik.handleChange}
                      error={
                        formik.touched["room-id"] &&
                        Boolean(formik.errors["room-id"])
                      }
                      MenuProps={MenuProps}
                    >
                      {rooms.map((room) => (
                        <MenuItem key={room.id} value={room.id}>
                          {room.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {formik.touched["room-id"] && formik.errors["room-id"] && (
                      <FormHelperText error>
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
                    Học kỳ
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <FormControl variant="standard" fullWidth>
                    <Select
                      name="term-id"
                      value={formik.values["term-id"]}
                      onChange={formik.handleChange}
                      error={
                        formik.touched["term-id"] &&
                        Boolean(formik.errors["term-id"])
                      }
                      MenuProps={MenuProps}
                    >
                      {termName.map((term) => (
                        <MenuItem key={term.id} value={term.id}>
                          {term.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {formik.touched["term-id"] && formik.errors["term-id"] && (
                      <FormHelperText error>
                        {formik.errors["term-id"]}
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
                    Giáo viên
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <FormControl variant="standard" fullWidth>
                    <Select
                      name="teacher-id"
                      value={formik.values["teacher-id"]}
                      onChange={formik.handleChange}
                      MenuProps={MenuProps}
                    >
                      {console.log(
                        "Rendering teachers:",
                        teachableSubjects?.result
                      )}
                      {Array.isArray(teachableSubjects?.result) &&
                        teachableSubjects?.result.map(
                          (teacher: ITeachableSubject) => (
                            <MenuItem
                              key={teacher["teacher-id"]}
                              value={teacher["teacher-id"]}
                            >
                              {teacher["teacher-name"]}
                            </MenuItem>
                          )
                        )}
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
                    Mã lớp ghép
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <FormControl variant="standard" fullWidth>
                    <TextField
                      variant="standard"
                      fullWidth
                      name="room-subject-code"
                      value={formik.values["room-subject-code"]}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched["room-subject-code"] &&
                        Boolean(formik.errors["room-subject-code"])
                      }
                      helperText={
                        formik.touched["room-subject-code"] &&
                        formik.errors["room-subject-code"]
                      }
                    />
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
                    Tên lớp ghép
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <FormControl variant="standard" fullWidth>
                    <TextField
                      variant="standard"
                      fullWidth
                      name="room-subject-name"
                      value={formik.values["room-subject-name"]}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched["room-subject-name"] &&
                        Boolean(formik.errors["room-subject-name"])
                      }
                      helperText={
                        formik.touched["room-subject-name"] &&
                        formik.errors["room-subject-name"]
                      }
                    />
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
                    Khối lớp
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <FormControl variant="standard" fullWidth>
                    <Select
                      name="grade"
                      value={formik.values.grade}
                      onChange={formik.handleChange}
                      MenuProps={MenuProps}
                    >
                      {Object.entries(CLASSGROUP_TRANSLATOR).map(
                        ([key, value]) => (
                          <MenuItem key={key} value={key}>
                            {`Khối ${value}`}
                          </MenuItem>
                        )
                      )}
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
                    Buổi học
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <FormControl variant="standard" fullWidth>
                    <Select
                      name="session"
                      value={formik.values.session}
                      onChange={formik.handleChange}
                      MenuProps={MenuProps}
                    >
                      {MAIN_SESSION.map((session) => (
                        <MenuItem key={session.key} value={session.key}>
                          {MAIN_SESSION_TRANSLATOR[session.value]}
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
                    Lớp học
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <FormControl
                    variant="standard"
                    fullWidth
                    error={
                      formik.touched["student-class-ids"] &&
                      Boolean(formik.errors["student-class-ids"])
                    }
                  >
                    <Select
                      multiple
                      name="student-class-ids"
                      value={formik.values["student-class-ids"]}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      MenuProps={MenuProps}
                    >
                      {availableClasses && availableClasses.length > 0 ? (
                        availableClasses.map((classItem) => (
                          <MenuItem
                            key={classItem.id}
                            value={classItem.id}
                            disabled={existCombineClass.some(
                              (combine) =>
                                combine.id !== combineClassId && // Exclude current combine class
                                combine["subject-id"] ===
                                  formik.values["subject-id"] &&
                                combine["student-class"].some(
                                  (studentClass) => studentClass.id === classItem.id
                                )
                            )}
                          >
                            {classItem.name}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem disabled>Không có lớp học khả dụng</MenuItem>
                      )}
                    </Select>
                    {formik.touched["student-class-ids"] &&
                      formik.errors["student-class-ids"] && (
                        <FormHelperText error>
                          {formik.errors["student-class-ids"]}
                        </FormHelperText>
                      )}
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <div className="w-full flex flex-row justify-end items-center gap-2 bg-basic-gray-hover p-3">
          <ContainedButton
            title="Huỷ"
            onClick={() => onClose(false)}
            styles="!bg-basic-gray-active !text-basic-gray !py-1 px-4"
          />
          <ContainedButton
            title="Cập nhật"
            type="submit"
            disabled={!formik.isValid || isUpdating}
            styles="bg-primary-300 text-white !py-1 px-4"
          />
        </div>
      </form>
    </Dialog>
  );
};
export default UpdateCombineClassModal;
