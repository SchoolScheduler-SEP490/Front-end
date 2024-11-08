import useNotify from '@/hooks/useNotify';
import { deleteTeacherById } from '../_libs/apiTeacher';

interface IDeleteTeacherProps {
  teacherId: number;
  sessionToken: string;
  schoolId: string;
}

const useDeleteTeacher = async ({ teacherId, sessionToken, schoolId }: IDeleteTeacherProps) => {
  const api = process.env.NEXT_PUBLIC_API_URL || 'Unknown';

  try {
    await deleteTeacherById(teacherId, schoolId, sessionToken);
    console.log(`Successfully deleted teacher with ID: ${teacherId}`);
    useNotify({
      message: 'Xóa giáo viên thành công',
      type: 'success',
    });
    return true;
  } catch (err) {
    console.error(`Failed to delete teacher with ID: ${teacherId}`, err);
    useNotify({
      message: 'Xóa giáo viên thất bại. Vui lòng thử lại.',
      type: 'error',
    });
    return false;
  }
};

export default useDeleteTeacher;
