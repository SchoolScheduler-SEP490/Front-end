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
import { KeyedMutator } from "swr";
import useAssignCurriculum from "../_hooks/useAssignCurriculum";
import { IClassGroupDetail, ICurriculum } from "../_libs/constants";
import { getClassGroupById, getCurriculum } from "../_libs/apiClassGroup";

interface AssignCurriculumProps {
  open: boolean;
  onClose: () => void;
  classGroupId: number;
  mutate: KeyedMutator<any>;
}

const AssignCurriculumModal = ({
  open,
  onClose,
  classGroupId,
  mutate,
}: AssignCurriculumProps) => {
  const { handleAssignCurriculum } = useAssignCurriculum();
  const { schoolId, sessionToken, selectedSchoolYearId } = useAppContext();
  const [curriculums, setCurriculums] = useState<ICurriculum[]>([]);
  const [classGroupData, setClassGroupData] = useState<IClassGroupDetail | null>(null);
  const hasClasses = classGroupData?.classes && classGroupData.classes.length > 0;

  useEffect(() => {

    const loadClassGroup = async () => {
      try {
        const classGroup = await getClassGroupById(classGroupId, schoolId, selectedSchoolYearId, sessionToken);
        setClassGroupData(classGroup);

        const response = await getCurriculum(sessionToken, schoolId, selectedSchoolYearId);
        if (response.status === 200) {
          setCurriculums(response.result.items);
        }
      } catch (error) {
        console.error('Failed to fetch curriculums:', error);
      }
    }

    if (open) {
      loadClassGroup();
    }
  }, [open, classGroupId, schoolId, selectedSchoolYearId, sessionToken]);

  const formik = useFormik({
    initialValues: {
      curriculumId: ""
    },
    onSubmit: async (values) => {
      if (!hasClasses) {
        return;
      }
      const success = await handleAssignCurriculum(classGroupId, Number(values.curriculumId));
      if (success) {
        mutate();
        onClose();
      }
    },
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <div className="w-full h-fit flex flex-row justify-between items-center bg-primary-50 p-3">
        <Typography variant="h6" className="text-title-medium-strong font-normal opacity-60">
          Phân công chương trình giảng dạy
        </Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </div>

      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <Select
                  value={formik.values.curriculumId}
                  onChange={(e) => formik.setFieldValue("curriculumId", e.target.value)}
                  variant="standard"
                  disabled={!hasClasses}
                >
                  {curriculums.map((curriculum) => (
                    <MenuItem key={curriculum.id} value={curriculum.id}>
                      {curriculum["curriculum-name"]}
                    </MenuItem>
                  ))}
                </Select>
                {!hasClasses && (
                  <FormHelperText sx={{ margin: 0}} error>
                    Vui lòng thêm lớp học trước khi chọn khung chương trình.
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <div className="w-full flex flex-row justify-end items-center gap-2 bg-basic-gray-hover p-3">
          <ContainedButton
            title="Phân công"
            type="submit"
            disabled={!hasClasses || !formik.values.curriculumId}
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

export default AssignCurriculumModal;
