import React from "react";
import { Box, IconButton, Modal, Typography } from "@mui/material";
import ContainedButton from "@/commons/button-contained";
import { KeyedMutator } from "swr";
import CloseIcon from "@mui/icons-material/Close";
import useDeleteTeachableSubject from "../_hooks/useDeleteTeachableSubject";

const style = {
  position: "absolute",
  top: "40%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "40vw",
  height: "fit-content",
  bgcolor: "background.paper",
};

interface DeleteConfirmationModalProps {
  open: boolean;
  onClose: (close: boolean) => void;
  subjectName: string;
  subjectId: number;
  mutate: KeyedMutator<any>;
}

const DeleteTeachableSubjectModal = (props: DeleteConfirmationModalProps) => {
  const { open, onClose, subjectName, subjectId, mutate } = props;
  const { handleDeleteTeachableSubject } = useDeleteTeachableSubject();

  const handleClose = () => {
    onClose(false);
  };

  const deleteTeachableSubject = async () => {
    await handleDeleteTeachableSubject(subjectId);
    mutate();
    handleClose();
  };
  return (
    <Modal
      keepMounted
      open={open}
      onClose={handleClose}
      aria-labelledby="keep-mounted-modal-title"
      aria-describedby="keep-mounted-modal-description"
      disableEnforceFocus
      disableAutoFocus
      disableRestoreFocus
    >
      <Box sx={style}>
        <div
          id="modal-header"
          className="w-full h-fit flex flex-row justify-between items-center p-2 pl-5"
        >
          <Typography
            variant="h6"
            component="h2"
            className="text-title-large-strong font-semibold"
          >
            Xóa chuyên môn
          </Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </div>
        <div className="p-4 pl-5">
          <Typography className="text-title-small-strong">
            Bạn có chắc muốn xóa chuyên môn <strong>{subjectName}</strong>{" "}
            không? Thao tác này không thể hoàn tác.
          </Typography>
        </div>
        <div className="w-full flex flex-row justify-end items-center gap-2 bg-basic-gray-hover p-3">
          <ContainedButton
            title="Xóa chuyên môn"
            disableRipple
            onClick={deleteTeachableSubject}
            styles="bg-red-200 text-basic-negative text-normal !py-1 px-4"
          />
          <ContainedButton
            title="Huỷ"
            onClick={handleClose}
            disableRipple
            styles="!bg-basic-gray-active !text-basic-gray !py-1 px-4"
          />
        </div>
      </Box>
    </Modal>
  );
};
export default DeleteTeachableSubjectModal;
