import React from "react";
import {
  Dialog,
  DialogContent,
  FormControl,
  Grid,
  MenuItem,
  Select,
  FormHelperText,
  IconButton,
  Radio,
  RadioGroup,
  FormControlLabel,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  InputLabel,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import ContainedButton from "@/commons/button-contained";
import { useFormik } from "formik";
import { addTeachableSubject } from "../_libs/teacher_schema";
import { useAppContext } from "@/context/app_provider";
import { ISubject, ITeachableSubjectRequest } from "../_libs/constants";
import useAddTeachableSubject from "../_hooks/useAddTeachableSubject";
import { APPROPRIATE_LEVEL, CLASSGROUP_TRANSLATOR } from "@/utils/constants";
import { addNewTeachableSubject, getSubjectName } from "../_libs/apiTeacher";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

interface AddTeachableSubjectProps {
  open: boolean;
  onClose: (close: boolean) => void;
  teacherId: string | null;
  mutate: () => Promise<void>;
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 150,
      scrollbars: "none",
    },
  },
};

interface FormValues {
  subjects: ITeachableSubjectRequest[];
}

const AddTeachableSubjectModal = (props: AddTeachableSubjectProps) => {
  const { open, onClose, teacherId, mutate } = props;
  const { schoolId, sessionToken, selectedSchoolYearId } = useAppContext();
  const [subjects, setSubjects] = React.useState<ISubject[]>([]);
  const [gradeFields, setGradeFields] = React.useState([{ id: 0 }]);
  const [expandedAccordion, setExpandedAccordion] = React.useState<number>(0);

  React.useEffect(() => {
    const loadSubjects = async () => {
      const data = await getSubjectName(sessionToken, selectedSchoolYearId);
      if (data.result?.items) {
        setSubjects(data.result.items);
      }
    };
    loadSubjects();
  }, [sessionToken, selectedSchoolYearId]);

  const handleClose = () => {
    formik.resetForm();
    onClose(false);
  };

  const handleFormSubmit = async (values: FormValues) => {
    if (teacherId) {
      const result = await useAddTeachableSubject({
        schoolId,
        teacherId: Number(teacherId),
        teachableData: values.subjects[0],
        sessionToken
      });
      if (result) {
        await mutate();
        handleClose();
      }
    }
  };
  
  const formik = useFormik<FormValues>({
    initialValues: {
      subjects: [{
        "subject-abreviation": "",
        "list-approriate-level-by-grades": [],
        "is-main": false,
      }]
    },
    validationSchema: addTeachableSubject,
    onSubmit: async (formData) => {
      handleFormSubmit(formData)
    },
  });

  const addNewSubject = () => {
    const newSubject = {
      "subject-abreviation": "",
      "list-approriate-level-by-grades": [],
      "is-main": false,
    };
    formik.setValues({
      subjects: [
        ...formik.values.subjects,
        {
          "subject-abreviation": newSubject["subject-abreviation"],
          "list-approriate-level-by-grades": newSubject["list-approriate-level-by-grades"],
          "is-main": newSubject["is-main"],
        }
      ]
    });
    setExpandedAccordion(formik.values.subjects.length);
  };

  const removeSubject = (index: number) => {
    const newSubjects = [formik.values];
    newSubjects.splice(index, 1);
    formik.setValues(newSubjects[0]);
    setExpandedAccordion(Math.max(0, index - 1));
  };
  
  console.log(formik.values);
  console.log(formik.errors);
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      sx={{
        "& .MuiDialog-paper": {
          overflowY: "auto",
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },
          "-ms-overflow-style": "none",
        },
      }}
    >
      <div className="w-full h-fit flex flex-row justify-between items-center bg-primary-50 p-3">
        <Typography
          variant="h6"
          className="text-title-medium-strong font-normal opacity-60"
        >
          Thêm chuyên môn giảng dạy
        </Typography>
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </div>

      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          {formik.values.subjects.map((subject, index) => (
            <Accordion
              key={index}
              expanded={expandedAccordion === index}
              onChange={() => setExpandedAccordion(index)}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                className="bg-gray-50"
              >
                <div className="flex justify-between items-center w-full">
                  <Typography variant="subtitle1" className="font-semibold">
                    Chuyên môn {index + 1}
                  </Typography>
                  {index > 0 && (
                    <IconButton
                      onClick={(e) => {
                        // e.stopPropagation();
                        removeSubject(index);
                      }}
                      color="error"
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </div>
              </AccordionSummary>

              <AccordionDetails>
                {/* Subject Selection */}
                <Grid item xs={12}>
                  <Grid item xs={12}>
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                      <Grid item xs={3}>
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: "bold",
                            display: "flex",
                            alignItems: "center",
                            height: "100%",
                            minHeight: "80px",
                          }}
                        >
                          Môn học
                        </Typography>
                      </Grid>
                      <Grid item xs={8}>
                        <FormControl fullWidth>
                          <InputLabel>Tên môn học</InputLabel>
                          <Select
                            variant="standard"
                            name={`subjects.${index}.subject-abreviation`}
                            value={subject["subject-abreviation"]}
                            onChange={formik.handleChange}
                            MenuProps={MenuProps}
                          >
                            <MenuItem value="">--Chọn môn học--</MenuItem>
                            {subjects.map((s) => (
                              <MenuItem
                                key={s.abbreviation}
                                value={s.abbreviation}
                              >
                                {s["subject-name"]}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Grid>

                  {/* Grade Levels */}
                  <Grid item xs={12}>
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                      <Grid item xs={3}>
                        <div className="flex flex-row justify-start items-center gap-1">
                          <Typography
                            variant="body1"
                            sx={{
                              fontWeight: "bold",
                              display: "flex",
                              alignItems: "center",
                              height: "100%",
                              minHeight: "80px",
                            }}
                          >
                            Khối
                          </Typography>
                          <IconButton
                            size="small"
                            onClick={() =>
                              setGradeFields([
                                ...gradeFields,
                                { id: gradeFields.length },
                              ])
                            }
                          >
                            <AddIcon fontSize="small" />
                          </IconButton>
                        </div>
                      </Grid>

                      <Grid item xs={9}>
                        {gradeFields.map((field, gradeIndex) => (
                          <div
                            key={field.id}
                            className="mb-4 flex gap-4 items-center"
                          >
                            <Grid container spacing={2}>
                              <Grid item xs={6}>
                                <FormControl fullWidth>
                                  <InputLabel>Khối</InputLabel>
                                  <Select
                                    variant="standard"
                                    value={
                                      formik.values.subjects[index][
                                        "list-approriate-level-by-grades"
                                      ][gradeIndex]?.grade || ""
                                    }
                                    onChange={(event) => {
                                      const selectedGrade = event.target.value;
                                      const currentGrades = [
                                        ...formik.values.subjects[index][
                                          "list-approriate-level-by-grades"
                                        ],
                                      ];
                                      if (currentGrades[gradeIndex]) {
                                        currentGrades[gradeIndex] = {
                                          ...currentGrades[gradeIndex],
                                          grade: selectedGrade,
                                        };
                                      } else {
                                        currentGrades[gradeIndex] = {
                                          grade: selectedGrade,
                                          "appropriate-level": "",
                                        };
                                      }
                                      formik.setFieldValue(
                                        `subjects.${index}.list-approriate-level-by-grades`,
                                        currentGrades
                                      );
                                    }}
                                  >
                                    {Object.entries(CLASSGROUP_TRANSLATOR).map(
                                      ([grade, value]) => (
                                        <MenuItem key={grade} value={grade}>
                                          Khối {value}
                                        </MenuItem>
                                      )
                                    )}
                                  </Select>
                                </FormControl>
                              </Grid>
                              <Grid item xs={5}>
                                <FormControl fullWidth>
                                  <InputLabel>Độ phù hợp</InputLabel>
                                  <Select
                                    variant="standard"
                                    value={
                                      formik.values.subjects[index][
                                        "list-approriate-level-by-grades"
                                      ][gradeIndex]?.["appropriate-level"] || ""
                                    }
                                    onChange={(event) => {
                                      const selectedLevel = event.target.value;
                                      const currentGrades = [
                                        ...formik.values.subjects[index][
                                          "list-approriate-level-by-grades"
                                        ],
                                      ];
                                      if (currentGrades[gradeIndex]) {
                                        currentGrades[gradeIndex] = {
                                          ...currentGrades[gradeIndex],
                                          "appropriate-level": selectedLevel,
                                        };
                                      }
                                      formik.setFieldValue(
                                        `subjects.${index}.list-approriate-level-by-grades`,
                                        currentGrades
                                      );
                                    }}
                                  >
                                    {APPROPRIATE_LEVEL.map((level) => (
                                      <MenuItem
                                        key={level.key}
                                        value={level.value}
                                      >
                                        {level.key}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>
                              </Grid>
                              {gradeIndex > 0 && (
                                <Grid
                                  item
                                  xs={1}
                                  sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                  }}
                                >
                                  <IconButton
                                    onClick={() => {
                                      const newFields = gradeFields.filter(
                                        (_, i) => i !== gradeIndex
                                      );
                                      setGradeFields(newFields);
                                      const currentGrades = [
                                        ...formik.values.subjects[index][
                                          "list-approriate-level-by-grades"
                                        ],
                                      ];
                                      currentGrades.splice(gradeIndex, 1);
                                      formik.setFieldValue(
                                        `subjects.${index}.list-approriate-level-by-grades`,
                                        currentGrades
                                      );
                                    }}
                                  >
                                    <DeleteIcon
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        height: "100%",
                                      }}
                                    />
                                  </IconButton>
                                </Grid>
                              )}
                            </Grid>
                          </div>
                        ))}
                      </Grid>
                    </Grid>
                  </Grid>

                  {/* Is Main Radio */}
                  <Grid item xs={12}>
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                      <Grid item xs={3}>
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: "bold",
                            display: "flex",
                            alignItems: "center",
                            height: "100%",
                          }}
                        >
                          Loại môn học
                        </Typography>
                      </Grid>
                      <Grid item xs={9}>
                        <FormControl>
                          <RadioGroup
                            row
                            name={`subjects.${index}.is-main`}
                            value={subject["is-main"]}
                            onChange={(e) => {
                              const boolValue = e.target.value === "true";
                              formik.setFieldValue(
                                `subjects.${index}.is-main`,
                                boolValue
                              );
                            }}
                          >
                            <FormControlLabel
                              value="true"
                              control={<Radio />}
                              label="Môn chính"
                            />
                            <FormControlLabel
                              value="false"
                              control={<Radio />}
                              label="Môn phụ"
                            />
                          </RadioGroup>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          ))}

          <Button
            startIcon={<AddIcon />}
            onClick={addNewSubject}
            variant="outlined"
            fullWidth
            className="mt-4"
          >
            Thêm môn học
          </Button>
        </DialogContent>

        <div className="w-full flex flex-row justify-end items-center gap-2 bg-basic-gray-hover p-3">
          <ContainedButton
            title="Huỷ"
            onClick={handleClose}
            disableRipple
            styles="!bg-basic-gray-active !text-basic-gray !py-1 px-4"
          />
          <ContainedButton
            title="Thêm môn học"
            type="submit"
            disableRipple
            disabled={!formik.isValid}
            styles="bg-primary-300 text-white !py-1 px-4"
          />
        </div>
      </form>
    </Dialog>
  );
};
export default AddTeachableSubjectModal;
