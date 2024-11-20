import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  TextField,
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
import { classGroupSchema } from "../_libs/class_group_schema";
import { KeyedMutator } from "swr";
import { useAppContext } from "@/context/app_provider";
import { IAddClassGroup, IExistingClassGroup } from "../_libs/constants";
import useAddClassGroup from "../_hooks/useAddClassGroup";
import { CLASSGROUP_STRING_TYPE, CLASSGROUP_TRANSLATOR } from "@/utils/constants";
import { getExistingClassGroup } from "../_libs/apiClassGroup";

interface AddClassGroupFormProps {
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

const AddClassGroupModal = (props: AddClassGroupFormProps) => {
  const { open, onClose, mutate } = props;
  const { schoolId, sessionToken, selectedSchoolYearId } = useAppContext();
  const [existClassGroup, setExistClassGroup] = React.useState<IExistingClassGroup[]>([]);

  const handleFormSubmit = async (body: IAddClassGroup) => {
    await useAddClassGroup({
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

  useEffect(() => {
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
    loadExistClassGroup();
  }, [schoolId, selectedSchoolYearId, sessionToken])

  const formik = useFormik({
    initialValues: {
      "group-name": "",
      "group-description": "",
      "student-class-group-code": "",
      grade: "",
    },
    validationSchema: classGroupSchema(existClassGroup),
    onSubmit: async (values) => {
      const formData: IAddClassGroup = {
        "group-name": values["group-name"],
        "group-description": values["group-description"],
        "student-class-group-code": values["student-class-group-code"],
        grade: `GRADE_${values.grade}`,
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
          Thêm nhóm lớp
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
                    Tên tổ hợp
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <TextField
                    variant="standard"
                    fullWidth
                    placeholder="Nhập tên lớp"
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
                    placeholder="Nhập mô tả tổ hợp"
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
          </Grid>
        </DialogContent>
        <div className="w-full flex flex-row justify-end items-center gap-2 bg-basic-gray-hover p-3">
          <ContainedButton
            title="Thêm nhóm lớp"
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
export default AddClassGroupModal;
