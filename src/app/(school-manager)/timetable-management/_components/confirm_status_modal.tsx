import React from "react";
import {
  Box,
  IconButton,
  Modal,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  keyframes,
  Menu,
  TextField,
} from "@mui/material";
import ContainedButton from "@/commons/button-contained";
import CloseIcon from "@mui/icons-material/Close";
import { ITerm, IWeekDate } from "../_libs/constants";
import { getTerms, getWeekDate } from "../_libs/apiTimetable";
import { useState, useEffect } from "react";
import { useAppContext } from "@/context/app_provider";
import { useRouter } from 'next/navigation';

const style = {
  position: "absolute",
  top: "40%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "40vw",
  height: "fit-content",
  bgcolor: "background.paper",
};

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 300,
      scrollbars: "none",
    },
  },
};

interface ConfirmStatusModalProps {
  open: boolean;
  onClose: (close: boolean) => void;
  onConfirm: (termId?: number, startWeek?: number, endWeek?: number) => void;
  status: number;
  timetableCode: string;
  timetableName: string;
  termId: number;
  termName: string;
  appliedWeek: string | null;
  endedWeek: string | null;
  generatedScheduleId: string
}

const ConfirmStatusModal = (props: ConfirmStatusModalProps) => {
  const {
    open,
    onClose,
    onConfirm,
    status,
    timetableCode,
    timetableName,
    termId,
    termName,
    appliedWeek,
    endedWeek,
    generatedScheduleId
  } = props;

  const { schoolId, selectedSchoolYearId, sessionToken } = useAppContext();
  const [terms, setTerms] = useState<ITerm[]>([]);
  const [selectedTermId, setSelectedTermId] = useState<number>(termId);
  const [weeks, setWeeks] = useState<IWeekDate[]>([]);
  const [selectedStartWeek, setSelectedStartWeek] = useState<number>(
    Number(appliedWeek) || 0
  );
  const [selectedEndWeek, setSelectedEndWeek] = useState<number>(
    Number(endedWeek) || 0
  );
	const router = useRouter();

  useEffect(() => {
    const loadInitialData = async () => {
      if ((open && status === 2) || status == 3) {
        const termsData = await getTerms(sessionToken, selectedSchoolYearId);
        setTerms(termsData.result.items);
        setSelectedTermId(termId);
      }
    };
    loadInitialData();
  }, [open, termId]);

  useEffect(() => {
    const loadWeeks = async () => {
      if (selectedTermId && (status === 3 || status === 2)) {
        const data = await getWeekDate(
          schoolId,
          selectedSchoolYearId,
          selectedTermId,
          sessionToken
        );
        setWeeks(data.result);
        setSelectedStartWeek(Number(appliedWeek) || 0);
        setSelectedEndWeek(Number(endedWeek) || 0);
      }
    };
    loadWeeks();
  }, [selectedTermId, status]);

  const getCurrentWeekNumber = () => {
    const currentDate = new Date();
    const currentDay = currentDate.getDay(); // 0 = Sunday, 6 = Saturday
    
    // Find current week
    const currentWeek = weeks.find((week) => {
      const startDate = new Date(week["start-date"]);
      const endDate = new Date(week["end-date"]);
      return currentDate >= startDate && currentDate <= endDate;
    });
  
    // If it's Friday(5), Saturday(6) or Sunday(0), add 1 to the minimum allowed week
    const isWeekend = currentDay === 5 || currentDay === 6 || currentDay === 0;
    const weekOffset = isWeekend ? 2 : 1;
  
    return (currentWeek?.["week-number"] || 0) + weekOffset;
  };

  const formatWeekDisplay = (weekNumber: string | null, weeks: IWeekDate[]) => {
    if (!weekNumber) return "";
    const week = weeks.find(w => w["week-number"].toString() === weekNumber);
    if (week) {
      return `Tuần ${week["week-number"]} (${week["start-date"]} - ${week["end-date"]})`;
    }
    return weekNumber;
  };
  
  
  const getStatusMessage = () => {
    switch (status) {
      case 2:
        return (
          <div className="flex flex-col gap-4">
            <span>
              Bạn có chắc chắn muốn công bố nội bộ thời khóa biểu{" "}
              <strong>{timetableCode}</strong>?
            </span>
            <div className="bg-gray-50 p-4 rounded">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 grid grid-cols-2 gap-2">
                  <span className="text-gray-600 font-semibold">
                    Mã thời khóa biểu:
                  </span>
                  <span>{timetableCode}</span>
                </div>

                <div className="col-span-2 grid grid-cols-2 gap-2">
                  <span className="text-gray-600 font-semibold">
                    Tên thời khóa biểu:
                  </span>
                  <span>{timetableName}</span>
                </div>

                <div className="col-span-2 grid grid-cols-2 gap-2">
                  <span className="text-gray-600 font-semibold">Học kỳ:</span>
                  <TextField
                    variant="standard"
                    fullWidth
                    value={termName}
                    sx={{ maxWidth: 200 }}
                    slotProps={{
                      input: {
                        readOnly: true,
                      },
                    }}
                  />
                </div>

                <div className="col-span-2 grid grid-cols-2 gap-2">
                  <span className="text-gray-600 font-semibold">
                    Tuần áp dụng:
                  </span>
                  <FormControl
                    variant="standard"
                    fullWidth
                    sx={{ maxWidth: 200 }}
                  >
                    <Select
                      value={selectedStartWeek || ""}
                      onChange={(e) =>
                        setSelectedStartWeek(Number(e.target.value))
                      }
                    >
                      {weeks.filter(week => {
                        const currentDay = new Date().getDay();
                        const adjustedDay = currentDay === 0 ? 7 : currentDay;
                        const minWeek = getCurrentWeekNumber();
                        return week["week-number"] >= minWeek;
                      })
                      .map((week) => (
                        <MenuItem key={week["week-number"]} value={week["week-number"]}>
                          Tuần {week["week-number"]} ({week["start-date"]} - {week["end-date"]})
                        </MenuItem>
                      ))
                      }
                    </Select>
                  </FormControl>
                </div>

                <div className="col-span-2 grid grid-cols-2 gap-2">
                  <span className="text-gray-600 font-semibold">
                    Tuần kết thúc:
                  </span>
                  <FormControl
                    variant="standard"
                    fullWidth
                    sx={{ maxWidth: 200 }}
                  >
                    <Select
                      value={selectedEndWeek}
                      onChange={(e) =>
                        setSelectedEndWeek(Number(e.target.value))
                      }
                      disabled={!selectedStartWeek}
                      MenuProps={MenuProps}
                    >
                      {Array.isArray(weeks) &&
                        weeks
                          .filter(
                            (week) => week["week-number"] >= selectedStartWeek
                          )
                          .map((week) => (
                            <MenuItem
                              key={week["week-number"]}
                              value={week["week-number"]}
                            >
                              Tuần {week["week-number"]} ({week["start-date"]} -{" "}
                              {week["end-date"]})
                            </MenuItem>
                          ))}
                    </Select>
                  </FormControl>
                </div>
              </div>
            </div>
          </div>
        );
      case 3:
        if (!generatedScheduleId) {
          return (
            <div className="flex flex-col gap-4">
              <span className="italic tracking-wide">
                Thời khóa biểu chưa có dữ liệu. Vui lòng tạo thời khóa biểu {" "}
                <span 
                  className="text-primary-300 underline italic cursor-pointer hover:underline"
                  onClick={() => router.push(`/timetable-generation/${timetableCode}/information`)}
                >
                  tại đây
                </span>
              </span>
            </div>
          );
        }
        return (
          <div className="flex flex-col gap-4">
            <span>
              Bạn có chắc chắn muốn công bố thời khóa biểu{" "}
              <strong>{timetableCode}</strong>?
            </span>
            <div className="bg-gray-50 p-4 rounded">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 grid grid-cols-2 gap-2">
                  <span className="text-gray-600 font-semibold">
                    Mã thời khóa biểu:
                  </span>
                  <span>{timetableCode}</span>
                </div>

                <div className="col-span-2 grid grid-cols-2 gap-2">
                  <span className="text-gray-600 font-semibold">
                    Tên thời khóa biểu:
                  </span>
                  <span>{timetableName}</span>
                </div>

                <div className="col-span-2 grid grid-cols-2 gap-2">
                  <span className="text-gray-600 font-semibold">Học kỳ:</span>
                  <TextField
                    variant="standard"
                    fullWidth
                    value={termName}
                    sx={{ maxWidth: 200 }}
                    slotProps={{
                      input: {
                        readOnly: true,
                      },
                    }}
                  />
                </div>

                <div className="col-span-2 grid grid-cols-2 gap-2">
                  <span className="text-gray-600 font-semibold">
                    Tuần áp dụng:
                  </span>
                  <TextField
                    variant="standard"
                    fullWidth
                    value={formatWeekDisplay(appliedWeek, weeks)}
                    sx={{ maxWidth: 200 }}
                    slotProps={{
                      input: {
                        readOnly: true,
                      },
                    }}
                  />
                </div>

                <div className="col-span-2 grid grid-cols-2 gap-2">
                  <span className="text-gray-600 font-semibold">
                    Tuần kết thúc:
                  </span>
                  <TextField
                    variant="standard"
                    fullWidth
                    value={formatWeekDisplay(endedWeek, weeks)}
                    sx={{ maxWidth: 200 }}
                    slotProps={{
                      input: {
                        readOnly: true,
                      },
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <span>
            Bạn có chắc chắn muốn đánh dấu hết hạn thời khóa biểu{" "}
            <strong>{timetableCode}</strong>?
          </span>
        );
      case 5:
        return (
          <span>
            Bạn có chắc chắn muốn thu hồi thời khóa biểu{" "}
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
    // setSelectedTermId(null);
    // setSelectedStartWeek(null);
    // setSelectedEndWeek(null);
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
            onClick={() =>
              onConfirm(selectedTermId, selectedStartWeek, selectedEndWeek)
            }
            styles="!bg-primary-300 text-white !py-1 px-4"
          />
        </div>
      </Box>
    </Modal>
  );
};
export default ConfirmStatusModal;
