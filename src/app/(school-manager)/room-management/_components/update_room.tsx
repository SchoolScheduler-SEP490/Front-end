"use client";

import ContainedButton from "@/commons/button-contained";
import { useAppContext } from "@/context/app_provider";
import useNotify from "@/hooks/useNotify";
import CloseIcon from "@mui/icons-material/Close";
import {
  Dialog,
  FormControl,
  IconButton,
  Select,
  MenuItem,
  TextField,
  Typography,
  DialogContent,
  Grid,
  FormHelperText,
} from "@mui/material";
import { useFormik } from "formik";
import {
  IBuilding,
  IExistingRoom,
  ISubject,
  IUpdateRoomData,
} from "../_libs/constants";
import { updateRoomSchema } from "../_libs/room_schema";
import React, { useEffect, useState } from "react";
import { KeyedMutator } from "swr";
import { useUpdateRoom } from "../_hooks/useUpdateRoom";
import {
  fetchBuildingName,
  getExistingRoom,
  getSubjectName,
} from "../_libs/apiRoom";

interface UpdateRoomFormProps {
  open: boolean;
  onClose: (close: boolean) => void;
  roomId: number;
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

const UpdateRoomModal = (props: UpdateRoomFormProps) => {
  const { open, onClose, roomId, mutate } = props;
  const { sessionToken, schoolId, selectedSchoolYearId } = useAppContext();
  const api = process.env.NEXT_PUBLIC_API_URL;
  const { editRoom, isUpdating } = useUpdateRoom(mutate);
  const [oldData, setOldData] = useState<IUpdateRoomData>(
    {} as IUpdateRoomData
  );
  const [buildings, setBuildings] = React.useState<IBuilding[]>([]);
  const [subjects, setSubjects] = React.useState<ISubject[]>([]);
  const [existRoom, setExistRoom] = React.useState<IExistingRoom[]>([]);

  const formik = useFormik({
    initialValues: {
      ...oldData,
      "building-id": oldData["building-id"] || "",
      "availabilitye-status": oldData["availabilitye-status"] || "",
      "subject-ids": oldData["subject-ids"] || [],
      "room-type": oldData["room-type"] || "",
    },
    validationSchema: updateRoomSchema,
    validate: (values) => {
      const errors: { [key: string]: string } = {};
      if (existRoom.some((c) => c.name === values.name && c.id !== roomId)) {
        errors.name = "Tên phòng học đã tồn tại";
      }
      if (
        existRoom.some(
          (c) => c["room-code"] === values["room-code"] && c.id !== roomId
        )
      ) {
        errors["room-code"] = "Mã phòng học đã tồn tại";
      }
      return errors;
    },
    onSubmit: async (values) => {
      const updatedRoomData: IUpdateRoomData = {
        name: values.name,
        "room-type": values["room-type"],
        "max-class-per-time": values["max-class-per-time"],
        "room-code": values["room-code"],
        "building-id": values["building-id"],
        "availabilitye-status": values["availabilitye-status"],
        "subject-ids": values["subject-ids"],
      };
      const success = await editRoom(roomId, updatedRoomData);
      if (success) {
        console.log("Room updated successfully");
        useNotify({
          message: "Cập nhật phòng học thành công.",
          type: "success",
        });
        handleClose();
      } else {
        console.log("Failed to update teacher");
        useNotify({
          message: "Cập nhật phòng học thất bại.",
          type: "error",
        });
      }
    },
    enableReinitialize: true,
  });

  useEffect(() => {
    const fetchRoomById = async () => {
      const response = await fetch(
        `${api}/api/schools/${schoolId}/rooms/${roomId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionToken}`,
          },
        }
      );
      const data = await response.json();
      if (data.status === 200) {
        console.log("Raw API response:", data.result);
        const roomData = {
          ...data.result,
          "building-id": data.result["building-id"],
          "subject-ids": data.result.subjects.map(
            (subject: any) => subject["subject-id"]
          ),
          "room-type": data.result["room-type"],
        };
        setOldData(roomData);
        console.log("Room data:", roomData);
      } else {
        useNotify({
          message: "Lỗi khi tải dữ liệu phòng học.",
          type: "error",
        });
      }
    };

    const getBuildings = async () => {
      const buildingData = await fetchBuildingName(sessionToken, schoolId);
      if (buildingData?.status === 200) {
        setBuildings(buildingData.result.items);
      }
    };
    const loadSubjects = async () => {
      const subjectData = await getSubjectName(
        sessionToken,
        selectedSchoolYearId
      );
      if (subjectData?.status === 200) {
        setSubjects(subjectData.result.items);
        console.log("Subjects loaded:", subjectData.result.items);
      }
    };

    const loadExistRoom = async () => {
      try {
        const response = await getExistingRoom(schoolId, sessionToken);
        if (response.status === 200) {
          setExistRoom(response.result.items);
        }
      } catch (error) {
        console.error("Failed to load existing rooms:", error);
      }
    };

    if (open) {
      fetchRoomById();
      getBuildings();
      loadSubjects();
      loadExistRoom();
    }
  }, [open, roomId, sessionToken, schoolId]);

  const handleClose = () => {
    formik.resetForm();
    onClose(false);
  };

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
          Cập nhật thông tin phòng học
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
                    Tên phòng học
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <TextField
                    variant="standard"
                    fullWidth
                    placeholder="Nhập tên lớp"
                    name="name"
                    type="text"
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
                    Mã phòng học
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <TextField
                    variant="standard"
                    fullWidth
                    placeholder="Nhập mã phòng học"
                    name="room-code"
                    type="text"
                    value={formik.values["room-code"]}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched["room-code"] &&
                      Boolean(formik.errors["room-code"])
                    }
                    helperText={
                      formik.touched["room-code"] && formik.errors["room-code"]
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
                    Tòa nhà
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <FormControl
                    fullWidth
                    error={
                      formik.touched["building-id"] &&
                      Boolean(formik.errors["building-id"])
                    }
                  >
                    <Select
                      variant="standard"
                      name="building-id"
                      value={formik.values["building-id"] || ""}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 150,
                            overflow: "auto",
                          },
                        },
                      }}
                    >
                      {buildings.map((building) => (
                        <MenuItem key={building.id} value={building.id}>
                          {`${building["building-code"]} - ${building.name}`}
                        </MenuItem>
                      ))}
                    </Select>
                    {formik.touched["building-id"] &&
                      formik.errors["building-id"] && (
                        <FormHelperText error>
                          {formik.errors["building-id"]}
                        </FormHelperText>
                      )}
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>

            {formik.values["room-type"] === "PRACTICE_ROOM" && (
              <Grid item xs={12}>
                <Grid container spacing={2}>
                  <Grid
                    item
                    xs={3}
                    sx={{ display: "flex", alignItems: "center" }}
                  >
                    <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                      Môn học
                    </Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <FormControl fullWidth>
                      <Select
                        variant="standard"
                        multiple
                        name="subject-ids"
                        value={formik.values["subject-ids"] || []}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        MenuProps={{
                          PaperProps: {
                            style: {
                              maxHeight: 150,
                              overflow: "auto",
                            },
                          },
                        }}
                      >
                        {subjects.map((subject) => (
                          <MenuItem key={subject.id} value={subject.id}>
                            {`${subject["subject-name"]} (${subject.abbreviation})`}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
            )}

            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid
                  item
                  xs={3}
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    Số lượng lớp
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <TextField
                    variant="standard"
                    fullWidth
                    placeholder="Nhập số lượng"
                    name="max-class-per-time"
                    type="number"
                    value={formik.values["max-class-per-time"]}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched["max-class-per-time"] &&
                      Boolean(formik.errors["max-class-per-time"])
                    }
                    helperText={
                      formik.touched["max-class-per-time"] &&
                      formik.errors["max-class-per-time"]
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
                    Loại phòng
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <FormControl
                    fullWidth
                    error={
                      formik.touched["room-type"] &&
                      Boolean(formik.errors["room-type"])
                    }
                  >
                    <Select
                      variant="standard"
                      name="room-type"
                      value={formik.values["room-type"] || ""}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    >
                      <MenuItem value="">--Chọn phòng học--</MenuItem>
                      <MenuItem value="PRACTICE_ROOM">Phòng thực hành</MenuItem>
                      <MenuItem value="LECTURE_ROOM">
                        Phòng học lý thuyết
                      </MenuItem>
                    </Select>

                    {formik.touched["room-type"] &&
                      formik.errors["room-type"] && (
                        <FormHelperText error>
                          {formik.errors["room-type"]}
                        </FormHelperText>
                      )}
                  </FormControl>
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
                    Trạng thái
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <FormControl fullWidth>
                    <Select
                      variant="standard"
                      name="availabilitye-status"
                      value={formik.values["availabilitye-status"]}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    >
                      <MenuItem value="Available">Hoạt động</MenuItem>
                      <MenuItem value="Unavailable">Vô hiệu</MenuItem>
                    </Select>
                  </FormControl>
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
            title="Cập nhật"
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
export default UpdateRoomModal;
