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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ContainedButton from "@/commons/button-contained";
import { useFormik } from "formik";
import { useAppContext } from "@/context/app_provider";
import { IStudentClass } from "../_libs/constants";
import useAssignClass from "../_hooks/useAssignClass";
import { assignStudentClass } from "../_libs/class_group_schema";
import { getStudentClass } from "../_libs/apiClassGroup";
import { KeyedMutator } from "swr";

interface AssignClassProps {
  open: boolean;
  onClose: () => void;
  classGroupId: number;
  mutate: KeyedMutator<any>;
}

const AssignClassModal = ({ open, onClose, classGroupId, mutate }: AssignClassProps) => {
  const { schoolId, sessionToken, selectedSchoolYearId } = useAppContext();
  const { handleAssignClass } = useAssignClass();
  const [availableClasses, setAvailableClasses] = useState<IStudentClass[]>([]);

  const fetchStudentClasses = async () => {
    try {
      const response = await getStudentClass(
        sessionToken,
        schoolId,
        selectedSchoolYearId
      );
      if (response.status === 200) {
        setAvailableClasses(response.result.items);
      }
    } catch (error) {
      console.error("Failed to fetch classes:", error);
    }
  };

  useEffect(() => {
    if (open) {
      fetchStudentClasses();
    }
  }, [open, schoolId, selectedSchoolYearId]);

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
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <div className="w-full h-fit flex flex-row justify-between items-center bg-primary-50 p-3">
        <Typography variant="h6" className="text-title-medium-strong font-normal opacity-60">
          Phân công lớp học
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
                <Grid item xs={3} sx={{ display: "flex", alignItems: "center" }}>
                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    Lớp học
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <FormControl
                    fullWidth
                    error={formik.touched["class-ids"] && Boolean(formik.errors["class-ids"])}
                  >
                    <Select
                      multiple
                      value={formik.values["class-ids"]}
                      onChange={(e) => formik.setFieldValue("class-ids", e.target.value)}
                      onBlur={formik.handleBlur("class-ids")}
                      variant="standard"
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 150,
                            overflow: "auto",
                          },
                        },
                      }}
                    >
                      {availableClasses.map((classItem) => (
                        <MenuItem key={classItem.id} value={classItem.id}>
                          {classItem.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {formik.touched["class-ids"] && formik.errors["class-ids"] && (
                      <FormHelperText>{formik.errors["class-ids"]}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
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
            onClick={handleClose}
            styles="!bg-basic-gray-active !text-basic-gray !py-1 px-4"
          />
        </div>
      </form>
    </Dialog>
  );
};

export default AssignClassModal;
