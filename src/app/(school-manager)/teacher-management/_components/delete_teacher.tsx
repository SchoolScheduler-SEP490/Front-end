import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import ContainedButton from '@/commons/button-contained';
import { KeyedMutator } from 'swr';
import useDeleteTeacher from '../_hooks/useDeleteTeacher';
import { useAppContext } from '@/context/app_provider';

interface DeleteConfirmationModalProps {
  open: boolean;
  onClose: (close: boolean) => void;
  teacherName: string;
  teacherId: number;
  mutate: KeyedMutator<any>;
}

const DeleteTeacherModal = (props: DeleteConfirmationModalProps) => {
  const { open, onClose, teacherName, teacherId, mutate } = props;
  const { sessionToken } = useAppContext();

  const handleClose = () => {
    onClose(false);
  };

  const handleDeleteTeacher = async () => {
    await useDeleteTeacher({teacherId, sessionToken});
    mutate();
    handleClose();
  };
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Xác nhận xóa giáo viên</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Bạn có chắc chắn muốn xóa giáo viên <strong>{teacherName}</strong> không? Thao tác này không thể hoàn tác.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
      <ContainedButton
            title="Huỷ"
            onClick={handleClose}
            disableRipple
            styles="!bg-basic-gray-active text-basic-gray !py-1 px-4"
          />
          <ContainedButton
            title="Xác nhận"
            disableRipple
            onClick={handleDeleteTeacher}
            styles="bg-primary-300 text-white !py-1 px-4"
          />
      </DialogActions>
    </Dialog>
  );
};


export default DeleteTeacherModal;
