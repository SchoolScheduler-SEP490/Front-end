import useNotify from '@/hooks/useNotify';
import { deleteTeacherById } from '../_libs/apiTeacher';

interface IDeleteTeacherProps {
  teacherId: number;
  sessionToken: string;
}

const useDeleteTeacher = async (props: IDeleteTeacherProps) => {
  const api = process.env.NEXT_PUBLIC_API_URL || 'Unknown';
  const { teacherId, sessionToken } = props;

  try {
    const response = await deleteTeacherById(api, teacherId, sessionToken);
    console.log(`Successfully deleted teacher with ID: ${teacherId}`);
    useNotify({
      message: 'Xóa giáo viên thành công',
      type: 'success',
    });
    return response;
  } catch (err) {
    console.error(`Failed to delete teacher with ID: ${teacherId}`, err);
    useNotify({
      message: 'Xóa giáo viên thất bại. Vui lòng thử lại.',
      type: 'error',
    });
  }
};

export default useDeleteTeacher;
