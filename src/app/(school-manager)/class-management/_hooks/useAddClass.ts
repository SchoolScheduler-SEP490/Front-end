import useNotify from "@/hooks/useNotify";
import { IAddClassData } from "../_libs/constants";
import { addClass } from "../_libs/apiClass";

interface IAddClassProps {
  schoolId: string;
  sessionToken: string;
  formData: IAddClassData[];
  schoolYearId: number;
}

const useAddClass = async (props: IAddClassProps) => {
  const { schoolId, formData, sessionToken, schoolYearId } = props;
  try {
      const response = await addClass(schoolId, sessionToken, formData, schoolYearId);
      if(response.status == 200 || response.status == 201){
        useNotify({
          message: 'Thêm lớp học thành công',
          type: 'success',
        });  
      }
      return response;
    } catch (err: any) {
      useNotify({
        message: 'Thêm lớp học thất bại. Vui lòng thử lại.',
        type: 'error',
      });
    }
}

export default useAddClass;