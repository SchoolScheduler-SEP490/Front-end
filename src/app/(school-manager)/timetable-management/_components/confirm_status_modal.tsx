import React from "react";
import { Box, IconButton, Modal, Typography } from "@mui/material";
import ContainedButton from "@/commons/button-contained";
import CloseIcon from "@mui/icons-material/Close";

const style = {
  position: "absolute",
  top: "40%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "40vw",
  height: "fit-content",
  bgcolor: "background.paper",
};

interface ConfirmStatusModalProps {
  open: boolean;
  onClose: (close: boolean) => void;
  onConfirm: () => void;
  status: number;
  timetableCode: string;
  timetableName: string;
  termName: string;
  appliedWeek: string | null;
  endedWeek: string | null;
}

const ConfirmStatusModal = (props: ConfirmStatusModalProps) => {
  const { open, onClose, onConfirm, status, timetableCode, timetableName, termName, appliedWeek, endedWeek } = props;

  const getStatusMessage = () => {
    switch (status) {
      case 2:
        return (
            <div className="flex flex-col gap-2">
              <span>Bạn có chắc chắn muốn công bố thời khóa biểu <strong>"{timetableCode}"</strong>?</span>
              <div className="mt-4 p-4 bg-gray-50 rounded">
                <div className="grid grid-cols-2 gap-2">
                  <span className="text-gray-600 font-semibold">Mã thời khóa biểu:</span>
                  <span className="font-normal text-sm">{timetableCode}</span>
                  
                  <span className="text-gray-600 font-semibold">Tên thời khóa biểu:</span>
                  <span className="font-normal text-sm">{timetableName}</span>
                  
                  <span className="text-gray-600 font-semibold">Học kỳ:</span>
                  <span className="font-normal text-sm">{termName}</span>
                  
                  <span className="text-gray-600 font-semibold">Tuần áp dụng:</span>
                  <span className="ffont-normal text-sm">{appliedWeek || 'Chưa xác định'}</span>
                  
                  <span className="text-gray-600 font-semibold">Tuần kết thúc:</span>
                  <span className="font-normal text-sm">{endedWeek || 'Chưa xác định'}</span>
                </div>
              </div>
            </div>
          );

      case 3:
        return (
          <span>
            Bạn có chắc chắn muốn công bố nội bộ thời khóa biểu{" "}
            <strong>{timetableCode}</strong>?
          </span>
        );
        case 4:
            return (
              <span>
                Bạn có chắc chắn muốn đánh dấu hết hạn thời khóa biểu{" "}
                <strong>{timetableCode}</strong>?
              </span>
            );
      default:
        return (
          <span>
            Bạn có chắc chắn muốn chuyển thời khóa biểu{" "}
            <strong>{timetableCode}</strong> về bản nháp?
          </span>
        );
    }
  };

  const handleClose = () => {
    onClose(false);
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
            Xác nhận trạng thái
          </Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </div>
        <div className="p-4 pl-5">
          <Typography className="text-title-small-strong">
            <Typography>{getStatusMessage()}</Typography>
          </Typography>
        </div>
        <div className="w-full flex flex-row justify-end items-center gap-2 bg-basic-gray-hover p-3">
          <ContainedButton
            title="Huỷ"
            onClick={handleClose}
            disableRipple
            styles="!bg-basic-gray-active !text-basic-gray !py-1 px-4"
          />
          <ContainedButton
            title="Xác nhận"
            disableRipple
            onClick={onConfirm}
            styles="!bg-primary-300 text-white !py-1 px-4"
          />
        </div>
      </Box>
    </Modal>
  );
};
export default ConfirmStatusModal;
