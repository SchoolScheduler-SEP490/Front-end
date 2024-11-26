import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  FormControl,
  Grid,
  Typography,
  Select,
  MenuItem,
  IconButton,
  FormHelperText,
  ListItem,
  List,
  Checkbox,
  ListItemText,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ContainedButton from "@/commons/button-contained";
import { useFormik } from "formik";
import { useAppContext } from "@/context/app_provider";
import { IClass, IClassGroup, ICurriculum, IStudentClass } from "../_libs/constants";
import useAssignClass from "../_hooks/useAssignClass";
import { assignStudentClass } from "../_libs/class_group_schema";
import { getClassGroupById, getCurriculum, getStudentClass } from "../_libs/apiClassGroup";
import { KeyedMutator } from "swr";

interface AssignClassProps {
  open: boolean;
  onClose: () => void;
  classGroupId: number;
  mutate: KeyedMutator<any>;
}

const AssignClassModal = ({ open, onClose, classGroupId, mutate }: AssignClassProps) => {
  const { schoolId, sessionToken, selectedSchoolYearId } = useAppContext();
  const [classes, setClasses] = useState<IStudentClass[]>([]);
  const [curriculums, setCurriculums] = useState<ICurriculum[]>([]);
  const { handleAssignClass } = useAssignClass();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [classesResponse, curriculumsResponse] = await Promise.all([
          getStudentClass(sessionToken, schoolId, selectedSchoolYearId),
          getCurriculum(sessionToken, schoolId, selectedSchoolYearId)
        ]);

        if (classesResponse.status === 200 && curriculumsResponse.status === 200) {
          setClasses(classesResponse.result.items);
          setCurriculums(curriculumsResponse.result.items);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    if (open) {
      fetchData();
    }
  }, [open, schoolId, selectedSchoolYearId, sessionToken]);


  const formik = useFormik({
    initialValues: {
      "class-ids": [] as number[]
    },
    validationSchema: assignStudentClass,
    onSubmit: async (values) => {
      const success = await handleAssignClass(classGroupId, values["class-ids"]);
      if (success) {
        mutate();
        onClose();
      }
    },
  });

  const handleClose = () => {
    formik.resetForm();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <div className="w-full h-fit flex flex-row justify-between items-center bg-primary-50 p-3">
        <Typography variant="h6" className="text-title-medium-strong font-normal opacity-60">
          Phân công lớp học
        </Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </div>

      <form onSubmit={formik.handleSubmit}>
        <DialogContent
          sx={{
            maxHeight: "70vh",
            overflowY: "auto",
            "&::-webkit-scrollbar": {
              width: "8px",
              display: "none",
            },
            "&::-webkit-scrollbar-track": {
              background: "#f1f1f1",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "#888",
              borderRadius: "4px",
            },
            "-ms-overflow-style": "none",
          }}
        >
          <List>
            {classes.map((classItem) => (
              <ListItem
                key={classItem.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '8px 16px',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)'
                  }
                }}
              >
                <Checkbox
                  checked={formik.values["class-ids"].includes(classItem.id)}
                  onChange={() => {
                    const currentValues = [...formik.values["class-ids"]];
                    const index = currentValues.indexOf(classItem.id);
                    if (index === -1) {
                      currentValues.push(classItem.id);
                    } else {
                      currentValues.splice(index, 1);
                    }
                    formik.setFieldValue("class-ids", currentValues);
                  }}
                />
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={3}>
                    <Typography>{classItem.name}</Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography>{classItem["student-class-group-name"]}</Typography>
                  </Grid>
                  <Grid item xs={5}>
                    <Typography>{classItem["curriculum-name"]}</Typography>
                  </Grid>
                </Grid>
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <div className="w-full flex flex-row justify-end items-center gap-2 bg-basic-gray-hover p-3">
          <ContainedButton
            title="Phân công"
            type="submit"
            disabled={!formik.isValid}
            styles="bg-primary-300 text-white !py-1 px-4"
          />
          <ContainedButton
            title="Huỷ"
            onClick={onClose}
            styles="!bg-basic-gray-active !text-basic-gray !py-1 px-4"
          />
        </div>
      </form>
    </Dialog>
  );
};


export default AssignClassModal;
