import React, { useEffect, useState } from "react";
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
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ContainedButton from "@/commons/button-contained";
import { useFormik } from "formik";
import { addCombineClassSchema } from "../_libs/combine_class_schema";
import { KeyedMutator } from "swr";
import { useAppContext } from "@/context/app_provider";
import {
  IClassCombination,
  IExistingCombineClass,
  IRoom,
  ISubject,
  ITerm,
} from "../_libs/constants";
import useAddCombineClass from "../_hooks/useAddCombineClass";
import {
  getClassCombination,
  getExistingCombineClass,
  getRoomName,
  getSubjectName,
  getTermName,
} from "../_libs/apiCombineClass";
import {
  CLASSGROUP_TRANSLATOR,
  MAIN_SESSION,
  MAIN_SESSION_TRANSLATOR,
  ROOM_SUBJECT_MODEL,
} from "@/utils/constants";

interface AddCombineClassFormProps {
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

const AddCombineClassModal = (props: AddCombineClassFormProps) => {
  const { open, onClose, mutate } = props;
  const { schoolId, sessionToken, selectedSchoolYearId } = useAppContext();
  const [availableClasses, setAvailableClasses] = useState<IClassCombination[]>([]);
  const [subjects, setSubjects] = useState<ISubject[]>([]);
  const [termName, setTermName] = useState<ITerm[]>([]);
  const [rooms, setRooms] = useState<IRoom[]>([]);
  const [existingCombineClass, setExistingCombineClass] = useState<IExistingCombineClass[]>([]);

  const formik = useFormik({
    initialValues: {
      "subject-id": 0,
      "room-id": 0,
      "school-id": schoolId,
      "term-id": 0,
      "room-subject-code": "",
      "room-subject-name": "",
      model: ROOM_SUBJECT_MODEL[0].key,
      "student-class-id": [],
      session: "",
      grade: "",
    },
    validationSchema: addCombineClassSchema(existingCombineClass),
    onSubmit: async (values) => {
      const requestData = {
        "subject-id": values["subject-id"],
        "room-id": values["room-id"],
        "school-id": values["school-id"],
        "term-id": values["term-id"],
        "room-subject-code": values["room-subject-code"],
        "room-subject-name": values["room-subject-name"],
        model: values["model"],
        "student-class-id": values["student-class-id"],
      };

      await useAddCombineClass({
        sessionToken,
        requestData,
      });
      mutate();
      onClose(false);
    },
  });

  useEffect(() => {
    const loadAvailableClasses = async () => {
      if (
        formik.values["subject-id"] &&
        formik.values["term-id"] &&
        formik.values.grade &&
        formik.values.session
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
    loadAvailableClasses();
  }, [
    formik.values["subject-id"],
    formik.values["term-id"],
    formik.values.grade,
    formik.values.session,
  ]);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await getSubjectName(
          sessionToken,
          selectedSchoolYearId
        );
        if (response.status === 200) {
          setSubjects(response.result.items);
        }
      } catch (error) {
        console.error("Failed to fetch subjects:", error);
      }
    };
    fetchSubjects();
  }, [sessionToken, selectedSchoolYearId]);

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

  useEffect(() => {
    const fetchRooms = async () => {
      const selectedClassCount = formik.values["student-class-id"].length;
      if (selectedClassCount > 0) {
        const response = await getRoomName(sessionToken, schoolId, selectedClassCount);
        if (response.status === 200) {
          // Filter rooms based on max-class-per-time
          const filteredRooms = response.result.items.filter(
            (room: { "max-class-per-time": number }) => room["max-class-per-time"] >= selectedClassCount
          );
          setRooms(filteredRooms);
        }
      }
    };
    fetchRooms();
  }, [formik.values["student-class-id"]]);

  useEffect(() => {
    const loadExistingCombineClass = async () => {
      try {
        const response = await getExistingCombineClass(schoolId, sessionToken);
        if (response.status === 200) {
          setExistingCombineClass(response.result.items);
        }
      } catch (error) {
        console.error("Failed to load existing combine class:", error);
      }
    }
    loadExistingCombineClass();
  }, [schoolId, sessionToken]);

  const handleClose = () => {
    formik.handleReset(formik.initialValues);
    onClose(false);
  };

  console.log("Value: ", formik.values);
  console.log("Error: ", formik.errors);

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
          Thêm lớp ghép
        </Typography>
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </div>

      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                Lọc danh sách
              </Typography>
              <Divider sx={{ mt: 2 }} />
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
                    Khối lớp
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <FormControl variant="standard" fullWidth>
                    <Select
                      name="grade"
                      value={formik.values.grade}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.grade && Boolean(formik.errors.grade)
                      }
                    >
                      {Object.entries(CLASSGROUP_TRANSLATOR).map(
                        ([key, value]) => (
                          <MenuItem key={key} value={key}>
                            {`Khối ${value}`}
                          </MenuItem>
                        )
                      )}
                    </Select>
                    {formik.touched.grade && formik.errors.grade && (
                      <FormHelperText error>
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
                    Buổi học
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <FormControl variant="standard" fullWidth>
                    <Select
                      name="session"
                      value={formik.values.session}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.session && Boolean(formik.errors.session)
                      }
                      MenuProps={MenuProps}
                    >
                      {MAIN_SESSION.map((session) => (
                        <MenuItem key={session.key} value={session.key}>
                          {MAIN_SESSION_TRANSLATOR[session.value]}
                        </MenuItem>
                      ))}
                    </Select>
                    {formik.touched.session && formik.errors.session && (
                      <FormHelperText error>
                        {formik.errors.session}
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
                    Lớp học
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <FormControl variant="standard" fullWidth>
                    <Select
                      multiple
                      name="student-class-id"
                      value={formik.values["student-class-id"]}
                      onChange={formik.handleChange}
                      MenuProps={MenuProps}
                      displayEmpty
                    >
                      {availableClasses && availableClasses.length > 0 ? (
                        availableClasses.map((classItem) => (
                          <MenuItem key={classItem.id} value={classItem.id}>
                            {classItem.name}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem disabled>Không có lớp học khả dụng</MenuItem>
                      )}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              <Divider sx={{ mt: 4 }} />
            </Grid>

            {/* add new combine class */}

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
                    Mã lớp ghép
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <TextField
                    variant="standard"
                    fullWidth
                    placeholder="Nhập mã lớp ghép"
                    name="room-subject-code"
                    type="text"
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
                  <TextField
                    variant="standard"
                    fullWidth
                    placeholder="Nhập tên lớp ghép"
                    name="room-subject-name"
                    type="text"
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
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <div className="w-full flex flex-row justify-end items-center gap-2 bg-basic-gray-hover p-3">
          <ContainedButton
            title="Thêm lớp ghép"
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

export default AddCombineClassModal;
