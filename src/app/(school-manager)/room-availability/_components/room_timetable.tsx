import { useAppContext } from "@/context/app_provider";
import {
  CLASSGROUP_TRANSLATOR,
  IClassPeriod,
  IClassSchedule,
  ITermResponse,
  TIMETABLE_SLOTS,
  WEEK_DAYS_FULL,
} from "@/utils/constants";
import {
  Button,
  FormControl,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { useEffect, useMemo, useState } from "react";
import useRoomTimetable from "../_hooks/useRoomTimetable";
import { getTerms } from "../_libs/apiRoomTimetable";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface RoomTimetableTableProps {
  schoolId: string;
  schoolYearId: number;
  sessionToken: string;
}

const headerCellStyle = {
  border: "1px solid #e5e7eb",
  fontWeight: "bold",
  textAlign: "center",
  backgroundColor: "#f3f4f6",
};

const cellStyle = {
  border: "1px solid #e5e7eb",
  maxWidth: 10,
  textAlign: "center",
  fontWeight: "bold",
};

const periodCellStyle = (hasPeriod: boolean) => ({
  border: "1px solid #e5e7eb",
  maxWidth: 50,
  height: "70px",
  backgroundColor: hasPeriod ? "#f8faff" : "white",
  overflow: "hidden",
  cursor: "pointer",
  transition: "all 0.2s ease-in-out",
  "&:hover": {
    backgroundColor: "#e5e7eb",
    boxShadow: "inset 0 0 0 1px #fafafa",
  },
});

const ITEM_HEIGHT = 40;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
      scrollbars: "none",
    },
  },
};

export default function RoomTimetableTable({
  schoolId,
  schoolYearId,
  sessionToken,
}: RoomTimetableTableProps) {
  const [selectedTerm, setSelectedTerm] = useState<number>(1);
  const [terms, setTerms] = useState<ITermResponse[]>([]);
  const { selectedSchoolYearId } = useAppContext();
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const [selectedTeacher, setSelectedTeacher] = useState("all");
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedGrade, setSelectedGrade] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const fetchTerm = async () => {
      try {
        const response = await getTerms(sessionToken, selectedSchoolYearId);
        if (response.status === 200) {
          setTerms(response.result.items);
        }
      } catch (error) {
        console.error("Failed to fetch term name:", error);
      }
    };
    fetchTerm();
  }, [sessionToken, selectedSchoolYearId]);

  const {
    data: scheduleData,
    error,
    isValidating,
  } = useRoomTimetable({
    schoolId,
    schoolYearId,
    termId: selectedTerm,
    sessionToken,
    date: selectedDate.toDate(),
  });

  const classNames = useMemo(() => {
    if (!scheduleData?.["class-schedules"]) return [];

    const names =
      selectedGrade === "all"
        ? scheduleData["class-schedules"].map(
            (schedule: IClassSchedule) => schedule["student-class-name"]
          )
        : scheduleData["class-schedules"]
            .filter((schedule: IClassSchedule) =>
              schedule["student-class-name"].startsWith(
                String(CLASSGROUP_TRANSLATOR[selectedGrade])
              )
            )
            .map((schedule: IClassSchedule) => schedule["student-class-name"]);

    return Array.from(new Set(names)) as string[];
  }, [scheduleData, selectedGrade]);

  const teacherNames = useMemo(() => {
    if (!scheduleData) return [];
    const teachers = new Set<string>();

    scheduleData["class-schedules"].forEach((schedule: IClassSchedule) => {
      schedule["class-periods"].forEach((period: IClassPeriod) => {
        teachers.add(period["teacher-abbreviation"]);
      });
    });

    return Array.from(teachers);
  }, [scheduleData]);

  const roomCodes = useMemo(() => {
    if (!scheduleData?.["class-schedules"]) return [];
    const codes = scheduleData["class-schedules"].flatMap(
      (schedule: IClassSchedule) =>
        schedule["class-periods"].map((period) => period["room-code"])
    );
    return Array.from(codes) as string[];
  }, [scheduleData]);

  return (
    <div className="w-full h-[90vh] flex flex-col justify-start items-center pb-[2vh]">
      <div className="w-full mb-6 flex justify-between items-center gap-4">
        <div className="flex gap-4">
          <FormControl sx={{ minWidth: 170 }}>
            <Select
              value={selectedTerm}
              onChange={(e) => setSelectedTerm(Number(e.target.value))}
              variant="standard"
            >
              {terms.map((term) => (
                <MenuItem key={term.id} value={term.id}>
                  {term.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <DatePicker
            value={selectedDate}
            onChange={(newValue) => setSelectedDate(newValue || dayjs())}
            format="DD/MM/YYYY"
            slotProps={{ textField: { variant: "standard" } }}
          />
          <FormControl sx={{ minWidth: 170 }}>
            <Select
              value={selectedTeacher}
              onChange={(e) => setSelectedTeacher(e.target.value)}
              variant="standard"
              MenuProps={MenuProps}
            >
              <MenuItem value="all">Tất cả giáo viên</MenuItem>
              {teacherNames.map((teacher) => (
                <MenuItem key={teacher} value={teacher}>
                  {teacher}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      </div>
      {!scheduleData && !isValidating ? (
        <div className="flex flex-col justify-center items-center w-full h-full gap-8 p-12">
          <div className="flex justify-center transform transition-all duration-500 hover:scale-110">
            <Image
              src="/images/icons/empty-folder.png"
              alt="No schedule available"
              width={250}
              height={200}
              unoptimized={true}
              className="opacity-90 drop-shadow-lg"
            />
          </div>

          <div className="text-center space-y-2">
            <Typography
              variant="h5"
              className="text-gray-700 font-semibold tracking-wide"
            >
              Lịch sử dụng phòng chưa có dữ liệu!
            </Typography>
            <Typography variant="body1" className="text-gray-500">
              Bấm nút bên dưới để bắt đầu tạo thời khóa biểu mới
            </Typography>
          </div>

          <Button
            variant="contained"
            size="medium"
            className="!bg-primary-500 !hover:bg-primary-600 text-white px-8 py-3 rounded-s 
                     transform transition-all duration-300 hover:scale-105 hover:shadow-lg
                     flex items-center gap-2"
            onClick={() => router.push(`/timetable-generation`)}
          >
            Tạo thời khóa biểu
          </Button>
        </div>
      ) : (
        <TableContainer
          sx={{ mb: 10, maxHeight: "100%" }}
          className="!no-scrollbar"
        >
          <Table size="small" stickyHeader sx={{ position: "relative" }}>
            <TableHead
              sx={{ position: "sticky", top: 0, left: 0, zIndex: 100 }}
            >
              <TableRow>
                <TableCell sx={headerCellStyle}>Phòng</TableCell>
                {TIMETABLE_SLOTS.map((session, sessionIndex) =>
                  session.slots.map((_, slotIndex) => (
                    <TableCell
                      key={`slot-${sessionIndex}-${slotIndex}`}
                      sx={headerCellStyle}
                    >
                      Tiết {sessionIndex * 5 + slotIndex + 1}
                    </TableCell>
                  ))
                )}
              </TableRow>
            </TableHead>

            <TableBody>
              {Array.from(new Set(roomCodes)).map((roomCode) => (
                <TableRow key={roomCode}>
                  <TableCell sx={cellStyle}>{roomCode}</TableCell>
                  {TIMETABLE_SLOTS.map((session, sessionIndex) =>
                    session.slots.map((_, slotIndex) => {
                      const currentSlotIndex = sessionIndex * 5 + slotIndex + 1;
                      const classSchedule = scheduleData?.[
                        "class-schedules"
                      ]?.find((schedule: IClassSchedule) =>
                        schedule["class-periods"].some(
                          (p) =>
                            p["room-code"] === roomCode &&
                            p["start-at"] === currentSlotIndex &&
                            !p["is-deleted"]
                        )
                      );

                      const period = scheduleData?.["class-schedules"]
                        ?.flatMap(
                          (schedule: IClassSchedule) =>
                            schedule["class-periods"]
                        )
                        .find(
                          (p: IClassPeriod) =>
                            p["room-code"] === roomCode &&
                            p["start-at"] === currentSlotIndex &&
                            !p["is-deleted"] &&
                            (selectedTeacher === "all" ||
                              p["teacher-abbreviation"] === selectedTeacher)
                        );

                      return (
                        <TableCell
                          key={`${roomCode}-${currentSlotIndex}`}
                          sx={periodCellStyle(Boolean(period))}
                        >
                          {period && (
                            <div className="flex flex-col justify-center items-center h-full p-1 gap-1">
                              <strong className="tracking-wider text-ellipsis text-nowrap overflow-hidden text-primary-500 text-sm font-semibold">
                                {period["subject-abbreviation"]}
                              </strong>
                              <div className="flex justify-between gap-3">
                                <p className="text-ellipsis text-nowrap overflow-hidden text-gray-600 text-xs">
                                  {classSchedule?.["student-class-name"]}
                                </p>
                                <p className="text-ellipsis text-nowrap overflow-hidden text-gray-600 text-xs">
                                  {period["teacher-abbreviation"]}
                                </p>
                              </div>
                            </div>
                          )}
                        </TableCell>
                      );
                    })
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
}
