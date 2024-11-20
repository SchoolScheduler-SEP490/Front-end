import { useAppContext } from "@/context/app_provider";
import { assignClass } from "../_libs/apiClassGroup";
import useNotify from "@/hooks/useNotify";

const useAssignClass = () => {
  const { schoolId, sessionToken, selectedSchoolYearId } = useAppContext();

  const handleAssignClass = async (
    classGroupId: number,
    classIds: number[]
  ) => {
    try {
      await assignClass(
        schoolId,
        selectedSchoolYearId,
        classGroupId,
        classIds,
        sessionToken,
      );
      useNotify({
        message: "Phân công lớp thành công",
        type: "success",
      });
      return true;
    } catch (error: any) {
      useNotify({
        message: error.message || "Phân công lớp thất bại",
        type: "error",
      });
      return false;
    }
  };

  return { handleAssignClass };
};

export default useAssignClass;
