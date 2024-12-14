import useNotify from '@/hooks/useNotify';
import { IAddTeacherData } from '../_libs/constants';
import { addTeacher } from '../_libs/apiTeacher';

interface IAddTeacherProps {
  schoolId: string;
  sessionToken: string;
  formData: IAddTeacherData[];
}

const useAddTeacher = async (props: IAddTeacherProps) => {
  const { schoolId, formData, sessionToken } = props;
  const api = process.env.NEXT_PUBLIC_API_URL || 'Unknown';

  try {
    const response = await addTeacher(api, schoolId, sessionToken, formData);
    useNotify({
      message: 'Thêm giáo viên thành công',
      type: response ? 'success' : 'error',
    });
    return response;
  } catch (err: any) {
    useNotify({
      message: 'Thêm giáo viên thất bại. Vui lòng thử lại.',
      type: 'error',
    });
  }
};

export default useAddTeacher;
