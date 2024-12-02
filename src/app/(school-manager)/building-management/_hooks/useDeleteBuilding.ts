import useNotify from "@/hooks/useNotify";
import { deleteBuildingById } from "../_libs/apiBuilding";
import { useAppContext } from "@/context/app_provider";

const useDeleteBuilding = () => {
    const { sessionToken, schoolId } = useAppContext();

    const deleteBuilding = async (buildingId: number) => {
        try {
           await deleteBuildingById(buildingId, schoolId, sessionToken);
            useNotify({
                message: "Xóa tòa nhà thành công!",
                type: "success",
            });
            return true; 
        } catch (error) {
            console.error(`Failed to delete class with ID: ${buildingId}`, error);
            useNotify({
              message: "Xóa tòa nhà thất bại. Vui lòng thử lại!",
              type: "error",
            });
            return false;
            
        }
    }
    return { deleteBuilding };
}
export default useDeleteBuilding;