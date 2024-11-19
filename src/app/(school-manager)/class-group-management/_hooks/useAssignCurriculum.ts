import { useAppContext } from "@/context/app_provider";
import useNotify from "@/hooks/useNotify";
import { assignCurriculum } from "../_libs/apiClassGroup";

const useAssignCurriculum = () => {
    const { schoolId, sessionToken, selectedSchoolYearId } = useAppContext();
  
    const handleAssignCurriculum = async (classGroupId: number, curriculumId: number) => {
      try {
        await assignCurriculum(
          schoolId,
          selectedSchoolYearId,
          classGroupId,
          curriculumId,
          sessionToken
        );
        useNotify({
          message: "Chương trình giảng dạy đã được phân công thành công",
          type: "success",
        });
        return true;
      } catch (error: any) {
        useNotify({
          message: error.message || "Phân công chương trình giảng dạy thất bại. Vui long thử lại!",
          type: "error",
        });
        return false;
      }
    };
  
    return { handleAssignCurriculum };
  };
  
  export default useAssignCurriculum;