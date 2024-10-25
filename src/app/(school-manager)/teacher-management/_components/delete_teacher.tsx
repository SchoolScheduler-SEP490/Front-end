import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import ContainedButton from '@/commons/button-contained';

interface DeleteConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  selectedCount: number;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ open, onClose, onConfirm, selectedCount }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Xác nhận xóa giáo viên</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Bạn có chắc chắn muốn xóa giáo viên đã chọn không? Thao tác này không thể hoàn tác.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
      <ContainedButton
            title="Huỷ"
            onClick={onClose}
            disableRipple
            styles="!bg-basic-gray-active text-basic-gray !py-1 px-4"
          />
          <ContainedButton
            title="Xác nhận"
            disableRipple
            onClick={onConfirm}
            styles="bg-primary-300 text-white !py-1 px-4"
          />
      </DialogActions>
    </Dialog>
  );
};


export default DeleteConfirmationModal;
