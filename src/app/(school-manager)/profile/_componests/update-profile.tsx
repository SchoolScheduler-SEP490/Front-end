"use client";

import React, { useState } from "react";
import { useFormik } from "formik";
import {
  Dialog,
  DialogContent,
  Grid,
  TextField,
  Typography,
  IconButton,
  Avatar,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ContainedButton from "@/commons/button-contained";
import AvatarUploader from "./avatar-uploader";
import * as Yup from "yup";
import { useAppContext } from "@/context/app_provider";
import { KeyedMutator } from "swr";
import { IUpdateAccountRequest } from "../_libs/constants";
import { uploadImageToFirebase } from "../_libs/uploadImageToFirebase";
import useNotify from "@/hooks/useNotify";

interface UpdateProfileProps {
  open: boolean;
  onClose: (close: boolean) => void;
  mutate: KeyedMutator<any>;
  accountData: IUpdateAccountRequest;
  accountId: number;
}

const UpdateProfileModel = (props: UpdateProfileProps) => {
  const { open, onClose, mutate, accountData, accountId } = props;
  const { sessionToken } = useAppContext();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    accountData["avatar-url"]
  );
  const baseURl = process.env.NEXT_PUBLIC_API_URL;
  const [isUploaderOpen, setUploaderOpen] = useState(false);
  const [localAvatarFile, setLocalAvatarFile] = useState<File | null>(null);

  const validationSchema = Yup.object({
    "first-name": Yup.string().required("Họ là bắt buộc"),
    "last-name": Yup.string().required("Tên là bắt buộc"),
    phone: Yup.string()
      .required("Số điện thoại là bắt buộc")
      .matches(/^[0-9]{10}$/, "Số điện thoại không hợp lệ"),
  });

  const formik = useFormik<IUpdateAccountRequest>({
    initialValues: {
      "first-name": accountData["first-name"] || "",
      "last-name": accountData["last-name"] || "",
      phone: accountData.phone || "",
      "avatar-url": accountData["avatar-url"] || "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        // Nếu có ảnh mới, upload lên Firebase
        if (localAvatarFile) {
          const firebaseURL = await uploadImageToFirebase(localAvatarFile);
          values["avatar-url"] = firebaseURL; // Cập nhật URL ảnh vào values
          console.log(firebaseURL);
        }

        // Gửi dữ liệu lên API
        const response = await fetch(`${baseURl}/api/accounts/${accountId}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${sessionToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });

        if (!response.ok) {
          useNotify({
            message: "Cập nhật thất bại.",
            type: "error",
          });
        }

        await mutate();
        onClose(false);
        useNotify({
          message: "Cập nhật thành công.",
          type: "success",
        });
      } catch (error) {
        console.error("Error updating account:", error);
        useNotify({
          message: "Cập nhật thất bại.",
          type: "error",
        });
      }
    },
  });

  const handleAvatarSave = (file: File | null) => {
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarPreview(url); // Hiển thị preview ảnh
      setLocalAvatarFile(file);
    }
  };

  const handleClose = () => {
    formik.resetForm();
    onClose(false);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <div
        id="modal-header"
        className="w-full h-fit flex flex-row justify-between items-center bg-primary-50 p-3"
      >
        <Typography
          variant="h6"
          component="h2"
          className="text-title-medium-strong font-normal opacity-60"
        >
          Cập nhật thông tin tài khoản
        </Typography>
        <IconButton onClick={handleClose}>
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
          <Grid container spacing={2}>
            {/* First Name */}
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid
                  item
                  xs={3}
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    Họ
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <TextField
                    fullWidth
                    variant="standard"
                    placeholder="Nhập họ"
                    name="first-name"
                    value={formik.values["first-name"]}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched["first-name"] &&
                      Boolean(formik.errors["first-name"])
                    }
                    helperText={
                      formik.touched["first-name"] &&
                      formik.errors["first-name"]
                    }
                  />
                </Grid>
              </Grid>
            </Grid>

            {/* Last Name */}
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid
                  item
                  xs={3}
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    Tên
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <TextField
                    fullWidth
                    variant="standard"
                    placeholder="Nhập tên"
                    name="last-name"
                    value={formik.values["last-name"]}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched["last-name"] &&
                      Boolean(formik.errors["last-name"])
                    }
                    helperText={
                      formik.touched["last-name"] && formik.errors["last-name"]
                    }
                  />
                </Grid>
              </Grid>
            </Grid>

            {/* Phone */}
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid
                  item
                  xs={3}
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    Số điện thoại
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <TextField
                    fullWidth
                    variant="standard"
                    placeholder="Nhập số điện thoại"
                    name="phone"
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.phone && Boolean(formik.errors.phone)}
                    helperText={formik.touched.phone && formik.errors.phone}
                  />
                </Grid>
              </Grid>
            </Grid>

            {/* Avatar */}
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid
                  item
                  xs={3}
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    Avatar
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <div
                    style={{
                      position: "relative",
                      width: "100px",
                      height: "100px",
                      borderRadius: "50%",
                      border: "1px solid #888",
                      overflow: "hidden",
                      cursor: "pointer",
                    }}
                    onClick={() => setUploaderOpen(true)}
                  >
                    <Avatar
                      src={avatarPreview || ""}
                      alt="Avatar"
                      sx={{
                        width: "100%",
                        height: "100%",
                        transition: "opacity 0.3s ease",
                        opacity: "1",
                        "&:hover": {
                          opacity: "0.5",
                        },
                      }}
                    />
                  </div>
                  {/* Modal AvatarUploader */}
                  <AvatarUploader
                    open={isUploaderOpen}
                    onClose={() => setUploaderOpen(false)}
                    onSave={handleAvatarSave}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <div className="w-full flex flex-row justify-end items-center gap-2 bg-basic-gray-hover p-3">
          <ContainedButton
            title="Cập nhật"
            disableRipple
            type="submit"
            disabled={!formik.isValid || formik.isSubmitting}
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

export default UpdateProfileModel;
