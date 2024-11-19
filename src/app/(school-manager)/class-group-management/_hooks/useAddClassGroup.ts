import useNotify from "@/hooks/useNotify";
import { IAddClassGroup } from "../_libs/constants";
import { addClassGroup } from "../_libs/apiClassGroup";

interface IAddClassGroupProps {
    schoolId: string;
    sessionToken: string;
    formData: IAddClassGroup[];
    schoolYearId: number;
  }

  const useAddClassGroup = async (props: IAddClassGroupProps) => {
    const { schoolId, formData, sessionToken, schoolYearId } = props;
    try {
        const response = await addClassGroup(sessionToken, schoolId, formData[0], schoolYearId);
        useNotify({
          message: 'Thêm nhóm lớp thành công',
          type: 'success',
        });
        return response;
      } catch (err: any) {
        useNotify({
          message: 'Thêm nhóm lớp thất bại. Vui lòng thử lại.',
          type: 'error',
        });
      }
  }
  export default useAddClassGroup;