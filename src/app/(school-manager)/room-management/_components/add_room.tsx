import React from "react";
import {
  Dialog,
  DialogContent,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Grid,
  Typography,
  Select,
  MenuItem,
  IconButton,
  Checkbox,
  FormHelperText,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ContainedButton from "@/commons/button-contained";
import { useFormik } from "formik";
import { KeyedMutator } from "swr";
import { useAppContext } from "@/context/app_provider";
import { roomSchema } from "../_libs/room_schema";
import {
  IAddRoomData,
  IBuilding,
  IExistingRoom,
  IRoom,
  ISubject,
} from "../_libs/constants";
import useAddRoom from "../_hooks/useAddRoom";
import {
  fetchBuildingName,
  getExistingRoom,
  getSubjectName,
} from "../_libs/apiRoom";
import { ERoomType, ROOM_TYPE_TRANSLATOR } from "@/utils/constants";

interface AddRoomFormProps {
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

const AddRoomModal = (props: AddRoomFormProps) => {
  const { open, onClose, mutate } = props;
  const { schoolId, sessionToken, selectedSchoolYearId } = useAppContext();
  const [buildings, setBuildings] = React.useState<IBuilding[]>([]);
  const [subjects, setSubjects] = React.useState<ISubject[]>([]);
  const { addNewRoom } = useAddRoom();
  const [existRoom, setExistRoom] = React.useState<IExistingRoom[]>([]);

  React.useEffect(() => {
    const loadBuildingName = async () => {
      try {
        const data = await fetchBuildingName(sessionToken, schoolId);

        if (data.result?.items) {
          setBuildings(data.result.items);
        }
      } catch (error) {
        console.error("Error fetching buildings:", error);
      }
    };
    loadBuildingName();
  }, [sessionToken, schoolId]);

  React.useEffect(() => {
    const loadSubjects = async () => {
      const data = await getSubjectName(sessionToken, selectedSchoolYearId);
      if (data.result?.items) {
        setSubjects(data.result.items);
      }
    };
    loadSubjects();
  }, [sessionToken, selectedSchoolYearId]);

  React.useEffect(() => {
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
    loadExistRoom();
  }, [schoolId, sessionToken]);

  const handleFormSubmit = async (formData: IAddRoomData) => {
    const success = await addNewRoom(formData);
    handleClose();
    if (success) {
      mutate();
    }
  };

  const handleClose = () => {
    formik.handleReset(formik.initialValues);
    onClose(false);
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      "room-code": "",
      "max-class-per-time": "",
      "building-code": "",
      "room-type": "",
      "subjects-abreviation": [],
    },
    validationSchema: roomSchema(existRoom),
    onSubmit: async (formData) => {
      handleFormSubmit({
        ...formData,
        "room-type": formData["room-type"],
        "subjects-abreviation": Array.isArray(formData["subjects-abreviation"])
          ? formData["subjects-abreviation"]
          : [formData["subjects-abreviation"]],
        "max-class-per-time": parseInt(formData["max-class-per-time"]),
      });
    },
  });

  console.log("Value:", formik.values);
  console.log("isValid:", formik.isValid);
  console.log("errors:", formik.errors);

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
          Thêm phòng học
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
                    placeholder="Nhập tên phòng học"
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
                      formik.touched["building-code"] &&
                      Boolean(formik.errors["building-code"])
                    }
                  >
                    <Select
                      variant="standard"
                      name="building-code"
                      value={formik.values["building-code"]}
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
                      <MenuItem value="">--Chọn tòa nhà--</MenuItem>
                      {buildings.map((building) => (
                        <MenuItem
                          key={building["building-code"]}
                          value={building["building-code"]}
                        >
                          {`${building.name} - ${building["building-code"]}`}
                        </MenuItem>
                      ))}
                    </Select>
                    {formik.touched["building-code"] &&
                      formik.errors["building-code"] && (
                        <FormHelperText className="m-0">
                          {formik.errors["building-code"]}
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
                      labelId="room-type"
                      id="room-type"
                      variant="standard"
                      value={formik.values["room-type"]}
                      onChange={(event) =>
                        formik.setFieldValue("room-type", event.target.value)
                      }
                      onBlur={formik.handleBlur("room-type")}
                      error={
                        formik.touched["room-type"] &&
                        Boolean(formik.errors["room-type"])
                      }
                      MenuProps={MenuProps}
                      sx={{ width: "100%" }}
                    >
                      <MenuItem value="">--Chọn loại phòng--</MenuItem>
                      {Object.entries(ROOM_TYPE_TRANSLATOR).map(
                        ([key, value]) => (
                          <MenuItem key={key} value={key}>
                            {value}
                          </MenuItem>
                        )
                      )}
                    </Select>
                    {formik.touched["room-type"] &&
                      formik.errors["room-type"] && (
                        <FormHelperText error variant="standard">
                          {formik.errors["room-type"]}
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
                      Môn học áp dụng
                    </Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <FormControl
                      fullWidth
                      error={
                        formik.touched["subjects-abreviation"] &&
                        Boolean(formik.errors["subjects-abreviation"])
                      }
                    >
                      <Select
                        variant="standard"
                        multiple
                        name="subjects-abreviation"
                        value={
                          Array.isArray(formik.values["subjects-abreviation"])
                            ? formik.values["subjects-abreviation"]
                            : [formik.values["subjects-abreviation"]]
                        }
                        onChange={(event) => {
                          const value = event.target.value;
                          formik.setFieldValue(
                            "subjects-abreviation",
                            Array.isArray(value) ? value : [value]
                          );
                        }}
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
                          <MenuItem
                            key={subject.id}
                            value={subject.abbreviation}
                          >
                            {`${subject["subject-name"]} - ${subject.abbreviation}`}
                          </MenuItem>
                        ))}
                      </Select>
                      {formik.touched["subjects-abreviation"] &&
                        formik.errors["subjects-abreviation"] && (
                          <FormHelperText className="m-0">
                            {formik.errors["subjects-abreviation"]}
                          </FormHelperText>
                        )}
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
            )}
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
            title="Thêm phòng học"
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
export default AddRoomModal;
