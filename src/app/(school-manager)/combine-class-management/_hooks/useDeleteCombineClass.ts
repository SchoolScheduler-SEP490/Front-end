import useNotify from "@/hooks/useNotify";
import { deleteCombineClass } from "../_libs/apiCombineClass";
import { useAppContext } from "@/context/app_provider";

const useDeleteCombineClass = () => {
  const { sessionToken, schoolId } = useAppContext();

  const handleDeleteById = async (combineClassId: number) => {
    try {
      await deleteCombineClass(combineClassId, schoolId, sessionToken);
      useNotify({
        message: "Xóa lớp ghép thành công!",
        type: "success",
      });
      return true;
    } catch (error) {
      console.error(`Failed to delete class with ID: ${combineClassId}`, error);
      useNotify({
        message: "Xóa lớp ghép thất bại. Vui lòng thử lại!",
        type: "error",
      });
      return false;
    }
  };
  return { handleDeleteById };
};
export default useDeleteCombineClass;
