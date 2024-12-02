import useNotify from "@/hooks/useNotify";
import { IAddBuilding } from "../_libs/constants";
import { addBuilding } from "../_libs/apiBuilding";

interface IAddBuildingProps {
  schoolId: string;
  sessionToken: string;
  formData: IAddBuilding[];
}

const useAddBuilding = async (props: IAddBuildingProps) => {
  const { schoolId, formData, sessionToken } = props;
  try {
    const response = await addBuilding(schoolId, sessionToken, formData[0]);
    useNotify({
      message: "Thêm tòa nhà thành công",
      type: "success",
    });
    return response;
  } catch (error) {
    useNotify({
      message: "Thêm tòa nhà thất bại. Vui lòng thử lại.",
      type: "error",
    });
  }
};

export default useAddBuilding;