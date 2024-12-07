"use client";

import ContainedButton from "@/commons/button-contained";
import { useAppContext } from "@/context/app_provider";
import useNotify from "@/hooks/useNotify";
import CloseIcon from "@mui/icons-material/Close";
import {
  Dialog,
  FormControl,
  IconButton,
  MenuItem,
  TextField,
  Typography,
  DialogContent,
  Grid,
  FormHelperText,
  Select,
} from "@mui/material";
import { useFormik } from "formik";
import { IClassGroupDetail, IExistingClassGroup } from "../_libs/constants";
import { useUpdateClassGroup } from "../_hooks/useUpdateClassGroup";
import { updateClassGroupSchema } from "../_libs/class_group_schema";
import React, { useEffect, useState } from "react";
import { KeyedMutator } from "swr";
import { getClassGroupById, getExistingClassGroup } from "../_libs/apiClassGroup";
import { CLASSGROUP_STRING_TYPE } from "@/utils/constants";

interface UpdateClassGroupFormProps {
  open: boolean;
  onClose: (close: boolean) => void;
  classGroupId: number;
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

const UpdateClassGroupModal = (props: UpdateClassGroupFormProps) => {
  const { open, onClose, classGroupId, mutate } = props;
  const { sessionToken, selectedSchoolYearId, schoolId } = useAppContext();
  const { editClassGroup, isUpdating } = useUpdateClassGroup(mutate);
  const [isLoading, setIsLoading] = useState(true);
  const [classGroupData, setClassGroupData] =
    useState<IClassGroupDetail | null>(null);
  const [existClassGroup, setExistClassGroup] = React.useState<IExistingClassGroup[]>([]);

  const hasClasses =
    classGroupData?.classes && classGroupData.classes.length > 0;

  const formik = useFormik({
    initialValues: {
      "group-name": "",
      "group-description": "",
      "student-class-group-code": "",
      grade: 0,
    },
    validationSchema: updateClassGroupSchema,
    validate: (values) => {
      const errors: { [key: string]: string } = {};
      if (
        existClassGroup.some((c) => c["group-name"] === values["group-name"] && c.id !== classGroupId)
      ) {
        errors["group-name"] = "Tên nhóm lớp đã tồn tại";
      }
      if (
        existClassGroup.some((c) => c["student-class-group-code"] === values["student-class-group-code"] && c.id !== classGroupId)
      ) {
        errors["student-class-group-code"] = "Mã nhóm lớp đã tồn tại";
      }
      return errors;
    },
    onSubmit: async (values) => {
      const success = await editClassGroup(classGroupId, values);
      if (success) {
        useNotify({
          message: "Cập nhật nhóm lớp thành công.",
          type: "success",
        });
        handleClose();
        mutate();
      } else {
        useNotify({
          message: "Cập nhật nhóm lớp thất bại.",
          type: "error",
        });
      }
    },
  });

  useEffect(() => {
    const loadClassGroup = async () => {
      if (!classGroupId) return;

      try {
        const data = await getClassGroupById(
          classGroupId,
          schoolId,
          selectedSchoolYearId,
          sessionToken
        );

        setClassGroupData(data);
        formik.setValues({
          "group-name": data["group-name"],
          "group-description": data["group-description"],
          "student-class-group-code": data["student-class-group-code"],
          grade: data.grade,
        });
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading class group:", error);
        setIsLoading(false);
      }
    };

    const loadExistClassGroup = async () => {
      try {
        const response = await getExistingClassGroup (
          schoolId,
          selectedSchoolYearId,
          sessionToken
        );
        if (response.status === 200) {
          setExistClassGroup(response.result.items);
        }
      } catch (error) {
        console.error("Failed to load existing class group:", error);
      }
    }

    if (open) {
      loadClassGroup();
      loadExistClassGroup();
    }
  }, [open, classGroupId, schoolId, selectedSchoolYearId, sessionToken]);

  const handleClose = () => {
    formik.resetForm();
    onClose(false);
  };

  return (
    <Dialog open={open} onClose={() => onClose(false)} maxWidth="sm" fullWidth>
      <div className="w-full h-fit flex flex-row justify-between items-center bg-primary-50 p-3">
        <Typography
          variant="h6"
          className="text-title-medium-strong font-normal opacity-60"
        >
          Cập nhật nhóm lớp
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
                    Tên nhóm lớp
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <TextField
                    variant="standard"
                    fullWidth
                    placeholder="Nhập tên nhóm lớp"
                    name="group-name"
                    type="text"
                    value={formik.values["group-name"]}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched["group-name"] &&
                      Boolean(formik.errors["group-name"])
                    }
                    helperText={
                      formik.touched["group-name"] &&
                      formik.errors["group-name"]
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
                    Mô tả
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <TextField
                    variant="standard"
                    fullWidth
                    placeholder="Nhập mô tả"
                    name="group-description"
                    type="text"
                    value={formik.values["group-description"]}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched["group-description"] &&
                      Boolean(formik.errors["group-description"])
                    }
                    helperText={
                      formik.touched["group-description"] &&
                      formik.errors["group-description"]
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
                    Mã nhóm lớp
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <TextField
                    variant="standard"
                    fullWidth
                    placeholder="Nhập mã nhóm lớp"
                    name="student-class-group-code"
                    type="text"
                    value={formik.values["student-class-group-code"]}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched["student-class-group-code"] &&
                      Boolean(formik.errors["student-class-group-code"])
                    }
                    helperText={
                      formik.touched["student-class-group-code"] &&
                      formik.errors["student-class-group-code"]
                    }
                    disabled={hasClasses}
                  />
                  {hasClasses && (
                    <FormHelperText sx={{ margin: 0 }} error>
                      Không thể thay đổi mã nhóm lớp khi đã có lớp học.
                    </FormHelperText>
                  )}
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
                      disabled={hasClasses}
                      sx={{ width: "100%" }}
                    >
                      {CLASSGROUP_STRING_TYPE.map((item) => (
                        <MenuItem key={item.key} value={item.value}>
                          {item.key}
                        </MenuItem>
                      ))}
                    </Select>
                    {hasClasses && (
                      <FormHelperText sx={{ margin: 0 }} error>
                        Không thể thay đổi khối khi đã có lớp học.
                      </FormHelperText>
                    )}
                    {formik.touched.grade && formik.errors.grade && (
                      <FormHelperText error variant="standard">
                        {formik.errors.grade}
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
            title="Cập nhật"
            type="submit"
            disabled={ !formik.isValid || isUpdating}
            styles="bg-primary-300 text-white !py-1 px-4"
          />
          <ContainedButton
            title="Huỷ"
            onClick={() => onClose(false)}
            styles="!bg-basic-gray-active !text-basic-gray !py-1 px-4"
          />
        </div>
      </form>
    </Dialog>
  );
};
export default UpdateClassGroupModal;
