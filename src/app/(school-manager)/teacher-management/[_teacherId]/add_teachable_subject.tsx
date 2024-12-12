import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  FormControl,
  Grid,
  MenuItem,
  Select,
  IconButton,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  InputLabel,
  Checkbox,
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
  subjects: {
    "subject-abreviation": string;
    "list-approriate-level-by-grades": GradeLevel[];
  }[];
}

interface GradeLevel {
  id: number;
  grade: string;
  "appropriate-level": string;
  "is-main": boolean;
}

type FormErrors = {
  subjects?: {
    "list-approriate-level-by-grades"?: {
      grade?: string;
    }[];
  }[];
};

const AddTeachableSubjectModal = (props: AddTeachableSubjectProps) => {
  const { open, onClose, teacherId, mutate } = props;
  const { schoolId, sessionToken, selectedSchoolYearId } = useAppContext();
  const [subjects, setSubjects] = React.useState<ISubject[]>([]);
  const [gradeFields, setGradeFields] = React.useState([{ id: 0 }]);
  const [expandedAccordion, setExpandedAccordion] = React.useState<number>(0);
  const [expandedAccordions, setExpandedAccordions] = useState<number[]>([0]);


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
      const teachableSubject: ITeachableSubjectRequest[] = [
        {
          "subject-abreviation": values.subjects[0]["subject-abreviation"],
          "list-approriate-level-by-grades": values.subjects[0][
            "list-approriate-level-by-grades"
          ].map((grade) => ({
            id: 0,
            grade: grade.grade,
            "appropriate-level": grade["appropriate-level"],
            "is-main": grade["is-main"],
          })),
        },
      ];

      const { handleAddTeachableSubject } = useAddTeachableSubject({
        schoolId,
        teacherId: Number(teacherId),
        teachableData: teachableSubject,
        sessionToken,
      });

      const success = await handleAddTeachableSubject();
      if (success) {
        await mutate();
        handleClose();
      }
    }
  };

  const formik = useFormik<FormValues>({
    initialValues: {
      subjects: [
        {
          "subject-abreviation": "",
          "list-approriate-level-by-grades": [] as GradeLevel[],
        },
      ],
    },
    validationSchema: addTeachableSubject,
    onSubmit: async (formData) => {
      handleFormSubmit(formData);
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
          "list-approriate-level-by-grades":
            newSubject["list-approriate-level-by-grades"],
        },
      ],
    });
    setExpandedAccordion(formik.values.subjects.length);
  };

  const removeSubject = (index: number) => {
    const newSubjects = [...formik.values.subjects];
    newSubjects.splice(index, 1);
    formik.setValues({
      subjects: newSubjects
    });
    setExpandedAccordion(Math.max(0, index - 1));
  };
  
  const handleGradeChange = (event: any, index: number, gradeIndex: number) => {
    const selectedGrade = event.target.value;
    const currentGrades = [
      ...formik.values.subjects[index]["list-approriate-level-by-grades"],
    ];

    if (currentGrades[gradeIndex]) {
      currentGrades[gradeIndex] = {
        ...currentGrades[gradeIndex],
        grade: selectedGrade,
      };
    } else {
      currentGrades[gradeIndex] = {
        id: 0,
        grade: selectedGrade,
        "appropriate-level": "",
        "is-main": false,
      };
    }

    formik.setFieldValue(
      `subjects.${index}.list-approriate-level-by-grades`,
      currentGrades
    );
  };

  const handleAccordionChange = (index: number) => {
    setExpandedAccordions((prev: number[]) => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index);
      } else {
        return [...prev, index];
      }
    });
  };

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
            expanded={expandedAccordions.includes(index)}
            onChange={() => handleAccordionChange(index)}
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
                        e.stopPropagation();
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
                            {subjects
                              .filter(
                                (s) => !s["is-teached-by-homeroom-teacher"]
                              )
                              .map((s) => (
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
                          <div key={field.id} className="mb-4">
                            <Grid container spacing={2}>
                              <Grid item xs={4}>
                                <FormControl fullWidth>
                                  <InputLabel>Khối</InputLabel>
                                  <Select
                                    variant="standard"
                                    value={
                                      formik.values.subjects[index][
                                        "list-approriate-level-by-grades"
                                      ][gradeIndex]?.grade || ""
                                    }
                                    onChange={(event) =>
                                      handleGradeChange(
                                        event,
                                        index,
                                        gradeIndex
                                      )
                                    }
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

                              <Grid item xs={4}>
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
                                      const currentGrades =
                                        formik.values.subjects[index][
                                          "list-approriate-level-by-grades"
                                        ];
                                      const updatedGrades = [...currentGrades];
                                      if (!updatedGrades[gradeIndex]) {
                                        updatedGrades[gradeIndex] = {
                                          id: 0,
                                          grade: "",
                                          "appropriate-level":
                                            event.target.value,
                                          "is-main": false,
                                        };
                                      } else {
                                        updatedGrades[gradeIndex] = {
                                          ...updatedGrades[gradeIndex],
                                          "appropriate-level":
                                            event.target.value,
                                        };
                                      }
                                      formik.setFieldValue(
                                        `subjects.${index}.list-approriate-level-by-grades`,
                                        updatedGrades
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

                              <Grid item xs={3}>
                                <FormControl fullWidth>
                                  <InputLabel>Môn chính</InputLabel>
                                  <Select
                                    variant="standard"
                                    value={
                                      formik.values.subjects[index][
                                        "list-approriate-level-by-grades"
                                      ][gradeIndex]?.["is-main"]
                                        ? "true"
                                        : "false"
                                    }
                                    onChange={(event) => {
                                      const currentGrades =
                                        formik.values.subjects[index][
                                          "list-approriate-level-by-grades"
                                        ];
                                      const updatedGrades = [...currentGrades];
                                      if (!updatedGrades[gradeIndex]) {
                                        updatedGrades[gradeIndex] = {
                                          id: 0,
                                          grade: "",
                                          "appropriate-level": "",
                                          "is-main":
                                            event.target.value === "true",
                                        };
                                      } else {
                                        updatedGrades[gradeIndex] = {
                                          ...updatedGrades[gradeIndex],
                                          "is-main":
                                            event.target.value === "true",
                                        };
                                      }
                                      formik.setFieldValue(
                                        `subjects.${index}.list-approriate-level-by-grades`,
                                        updatedGrades
                                      );
                                    }}
                                  >
                                    <MenuItem value="true">Có</MenuItem>
                                    <MenuItem value="false">Không</MenuItem>
                                  </Select>
                                </FormControl>
                              </Grid>
                            </Grid>
                          </div>
                        ))}
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
            Thêm chuyên môn
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
            title="Thêm chuyên môn"
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
