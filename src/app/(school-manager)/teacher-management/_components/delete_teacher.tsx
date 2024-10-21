import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

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
          Bạn có chắc chắn muốn xóa {selectedCount} giáo viên đã chọn không? Thao tác này không thể hoàn tác.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Hủy
        </Button>
        <Button onClick={onConfirm} color="secondary" variant="contained">
          Xác nhận
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmationModal;
