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
} from "@mui/material";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { KeyedMutator } from "swr";
import { IBuildingDetail, IExistingBuilding } from "../_libs/constants";
import { useUpdateBuilding } from "../_hooks/useUpdateBuilding";
import { getBuildingById, getExistingBuilding } from "../_libs/apiBuilding";
import { updateBuildingSchema } from "../_libs/building_schema";

interface UpdateBuildingFormProps {
  open: boolean;
  onClose: (close: boolean) => void;
  buildingId: number;
  mutate: KeyedMutator<any>;
}

const UpdateBuildingModal = (props: UpdateBuildingFormProps) => {
  const { open, onClose, buildingId, mutate } = props;
  const { sessionToken, schoolId } = useAppContext();
  const { editBuilding, isUpdating } = useUpdateBuilding(mutate);
  const [isLoading, setIsLoading] = useState(true);
  const [buildingData, setBuildingData] = useState<IBuildingDetail | null>(null);
  const [existBuilding, setExistBuilding] = useState<IExistingBuilding[]>([]);

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      "building-code": "",
      floor: 0,
    },
    validationSchema: updateBuildingSchema,
    validate: (values) => {
      const errors: { [key: string]: string } = {};
      if (
        existBuilding.some((c) => c.name === values.name && c.id !== buildingId)
      ) {
        errors.name = "Tên tòa nhà đã tồn tại";
      }
      if (
        existBuilding.some((c) => c["building-code"] === values["building-code"] && c.id !== buildingId)
      ) {
        errors["building-code"] = "Mã tòa nhà đã tồn tại";
      }
      return errors;
    },
    onSubmit: async (values) => {
      const success = await editBuilding(buildingId, values);
      if (success) {
        useNotify({
          message: "Cập nhật tòa nhà thành công.",
          type: "success",
        });
        handleClose();
        mutate();
      } else {
        useNotify({
          message: "Cập nhật tòa nhà thất bại.",
          type: "error",
        });
      }
    },
  });

  useEffect(() => {
    const loadBuildingDetail = async () => {
      try {
        const data = await getBuildingById(buildingId, schoolId, sessionToken);
        setBuildingData(data);
        formik.setValues({
          name: data.name,
          description: data.description,
          "building-code": data["building-code"],
          floor: data.floor,
        });
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading building:", error);
        setIsLoading(false);
      }
    };

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

    if (open) {
      loadBuildingDetail();
      loadExistBuilding();
    }
  }, [open, buildingId, sessionToken, schoolId]);

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
          Cập nhật tòa nhà
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
                    error={
                      formik.touched["building-code"] &&
                      Boolean(formik.errors["building-code"])
                    }
                    helperText={
                      formik.touched["building-code"] &&
                      formik.errors["building-code"]
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
                    Tầng
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <TextField
                    variant="standard"
                    fullWidth
                    name="floor"
                    label="Nhập số tầng"
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
            title="Cập nhật"
            type="submit"
            disabled={!formik.isValid || isUpdating}
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
export default UpdateBuildingModal;
