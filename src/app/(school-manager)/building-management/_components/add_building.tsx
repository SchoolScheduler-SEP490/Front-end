import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  TextField,
  Grid,
  Typography,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ContainedButton from "@/commons/button-contained";
import { useFormik } from "formik";
import { buildingSchema } from "../_libs/building_schema";
import { KeyedMutator } from "swr";
import { useAppContext } from "@/context/app_provider";
import { IAddBuilding, IExistingBuilding } from "../_libs/constants";
import useAddBuilding from "../_hooks/useAddBuilding";
import { addBuilding, getExistingBuilding } from "../_libs/apiBuilding";

interface AddBuildingFormProps {
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

const AddBuildingModal = (props: AddBuildingFormProps) => {
  const { open, onClose, mutate } = props;
  const { schoolId, sessionToken } = useAppContext();
  const [existBuilding, setExistBuilding] = useState<IExistingBuilding[]>([]);

  const handleFormSubmit = async (values: IAddBuilding) => {
    const result = await useAddBuilding({
      schoolId,
      sessionToken,
      formData: [values],
    });
    if (result) {
      mutate();
      handleClose();
    }
  };

  const handleClose = () => {
    formik.handleReset(formik.initialValues);
    onClose(false);
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      "building-code": "",
      floor: 0,
    },
    validationSchema: buildingSchema(existBuilding),
    onSubmit: async (values) => {
      const formData: IAddBuilding = {
        name: values.name,
        description: values.description,
        "building-code": values["building-code"],
        floor: values.floor,
      };
      await handleFormSubmit(formData);
    },
  });

  useEffect(() => {
    const loadExistBuilding = async () => {
      try {
        const response = await getExistingBuilding(schoolId, sessionToken);
        if (response.status === 200) {
          setExistBuilding(response.result.items);
        }          
      } catch (error) {
        console.error("Failed to load existing building:", error);
      }
    }
    loadExistBuilding();
  }, [schoolId, sessionToken])
  
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
          Thêm toà nhà
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
                    Tên tòa nhà
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <TextField
                    variant="standard"
                    fullWidth
                    name="name"
                    label="Tên tòa nhà"
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
                    Mã tòa nhà
                  </Typography>
                </Grid>

                <Grid item xs={9}>
                <TextField
                variant="standard"
                fullWidth
                name="building-code"
                label="Mã tòa nhà"
                value={formik.values["building-code"]}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched["building-code"] && Boolean(formik.errors["building-code"])}
                helperText={formik.touched["building-code"] && formik.errors["building-code"]}
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
                    name="description"
                    label="Nhập mô tả"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.description &&
                      Boolean(formik.errors.description)
                    }
                    helperText={
                      formik.touched.description && formik.errors.description
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
                    Số lượng tầng
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <TextField
                    variant="standard"
                    fullWidth
                    name="floor"
                    label="Nhập số lượng tầng"
                    type="number"
                    value={formik.values.floor}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.floor && Boolean(formik.errors.floor)}
                    helperText={formik.touched.floor && formik.errors.floor}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <div className="w-full flex flex-row justify-end items-center gap-2 bg-basic-gray-hover p-3">
          <ContainedButton
            title="Huỷ"
            onClick={handleClose}
            disableRipple
            styles="!bg-basic-gray-active !text-basic-gray !py-1 px-4"
          />
          <ContainedButton
            title="Thêm tòa nhà"
            disableRipple
            type="submit"
            disabled={!formik.isValid}
            styles="bg-primary-300 text-white !py-1 px-4"
          />
        </div>
      </form>
    </Dialog>
  );
};
export default AddBuildingModal;
