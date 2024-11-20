import useNotify from "@/hooks/useNotify";
import { deleteClassGroup } from "../_libs/apiClassGroup";
import { useAppContext } from "@/context/app_provider";

const useDeleteClassGroup = () => {
  const { sessionToken, schoolId, selectedSchoolYearId } = useAppContext();

  const handleDeleteClassGroup = async (classGroupId: number) => {
    try {
      await deleteClassGroup(
        classGroupId,
        sessionToken,
        schoolId,
        selectedSchoolYearId
      );
      useNotify({
        message: "Xóa nhóm lớp thành công!",
        type: "success",
      });
      return true;
    } catch (error) {
      console.error(`Failed to delete class with ID: ${classGroupId}`, error);
      useNotify({
        message: "Xóa nhóm lớp thất bại. Vui lòng thử lại!",
        type: "error",
      });
      return false;
    }
  };

  return { handleDeleteClassGroup };
};
export default useDeleteClassGroup;
