import * as yup from "yup";
import { IExistingBuilding } from "./constants";

export const buildingSchema = (existingBuilding: IExistingBuilding[]) =>
  yup.object().shape({
    name: yup
      .string()
      .required("Vui lòng nhập tên tòa nhà")
      .test("unique-name", "Tên tòa nhà đã tồn tại", function (value) {
        if (!value) return true;
        return !existingBuilding.some(
          (exist) => exist.name.toLowerCase() === value.toLowerCase()
        );
      }),

    "building-code": yup.string().required("Vui lòng nhập mã tòa nhà")
    .test("unique-code", "Mã tòa nhà đã tồn tại", function (value) {
      if (!value) return true;
      return !existingBuilding.some(
        (exist) => exist["building-code"].toLowerCase() === value.toLowerCase()
      );
    }),

    description: yup.string().required("Vui lòng nhập mô tả"),

    floor: yup
      .number()
      .required("Vui lòng nhập số tầng")
      .min(1, "Số tầng phải lớn hơn 0"),
  });

export const updateBuildingSchema = yup.object().shape({
  name: yup.string().required("Vui lòng nhập tên tòa nhà"),

  "building-code": yup.string().required("Vui lòng nhập mã tòa nhà"),

  description: yup.string().required("Vui lòng nhập mô tả"),

  floor: yup
    .number()
    .required("Vui lòng nhập số tầng")
    .min(1, "Số tầng phải lớn hơn 0"),
});
