import * as yup from "yup";
import { IExistingRoom } from "./constants";

export const roomSchema = (existingRooms: IExistingRoom[]) =>
  yup.object().shape({
    name: yup
      .string()
      .required("Tên phòng là bắt buộc")
      .test("unique-name", "Tên phòng học đã tồn tại", function (value) {
        if (!value) return true;
        return !existingRooms.some(
          (room) => room.name.toLowerCase() === value.toLowerCase()
        );
      }),

    "room-code": yup
      .string()
      .required("Mã phòng là bắt buộc")
      .test("unique-room", "Mã phòng học đã tồn tại", function (value) {
        if (!value) return true;
        return !existingRooms.some(
          (room) => room["room-code"].toLowerCase() === value.toLowerCase()
        );
      }),

    "max-class-per-time": yup
      .number()
      .required("Số lớp tối đa là bắt buộc")
      .min(1, "Số lớp tối thiểu phải lớn hơn 0")
      .max(1, "Số lớp học trong một thời gian tối đa phải 1"),

    "building-code": yup.string().required("Tòa nhà là bắt buộc"),

    "room-type": yup.string().required("Loại phòng là bắt buộc"),

    "subjects-abreviation": yup.array().when("room-type", {
      is: "PRACTICE_ROOM",
      then: (schema) =>
        schema.of(yup.string()).min(1, "Phải chọn ít nhất một môn học"),
      otherwise: (schema) => schema.nullable(),
    }),
  });

export const updateRoomSchema = yup.object().shape({
  name: yup.string().required("Tên phòng là bắt buộc"),

  "room-code": yup.string().required("Mã phòng là bắt buộc"),

  "max-class-per-time": yup
    .number()
    .required("Số lớp tối đa là bắt buộc")
    .min(1, "Số lớp tối đa phải lớn hơn 0"),

  "building-id": yup.number().required("Tòa nhà là bắt buộc"),

  "room-type": yup.string().required("Loại phòng là bắt buộc"),

  "subjects-ids": yup.array().when("room-type", {
    is: "PRACTICE_ROOM",
    then: (schema) =>
      schema.of(yup.string()).min(1, "Phải chọn ít nhất một môn học"),
    otherwise: (schema) => schema.nullable(),
  }),

  "availabilitye-status": yup.string().required("Trạng thái là bắt buộc"),
});
