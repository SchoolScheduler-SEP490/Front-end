import { useAppContext } from "@/context/app_provider";
import {
  IClassCombinationScheduleObject,
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
import Image from "next/image";
import useTeacherHeadData from "../_hooks/useTeacherHeadData";
import { getTerms } from "../_libs/apiTeacherHead";
import { useRouter } from "next/navigation";

interface TeacherHeadTimetableTableProps {
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
  maxWidth: 110,
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

export default function TeacherHeadTimetableTable({
  schoolId,
  schoolYearId,
  sessionToken,
}: TeacherHeadTimetableTableProps) {
  const [selectedTerm, setSelectedTerm] = useState<number>(1);
  const [terms, setTerms] = useState<ITermResponse[]>([]);
  const { selectedSchoolYearId } = useAppContext();
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const [selectedTeacher, setSelectedTeacher] = useState("all");
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
  } = useTeacherHeadData({
    schoolId,
    schoolYearId,
    termId: selectedTerm,
    sessionToken,
    date: selectedDate.toDate(),
  });

  const teacherNames = useMemo(() => {
    if (!scheduleData) return [];
    const teachers = new Set<string>();

    scheduleData["class-schedules"].forEach((schedule: IClassSchedule) => {
      schedule["class-periods"].forEach((period: IClassPeriod) => {
        teachers.add(period["teacher-abbreviation"]);
      });
    });

    return Array.from(teachers) as string[];
  }, [scheduleData]);

  return (
    <div className="w-full flex flex-col gap-4">
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
              Thời khóa biểu chưa có dữ liệu!
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
        <div className="w-full h-[90vh] flex flex-col justify-start items-center pb-[2vh]">
          <TableContainer
            sx={{ mb: 10, maxHeight: "100%" }}
            className="!no-scrollbar"
          >
            <Table size="small" stickyHeader sx={{ position: "relative" }}>
              <TableHead
                sx={{
                  position: "sticky",
                  top: 0,
                  left: 0,
                  zIndex: 100,
                }}
              >
                <TableRow>
                  <TableCell sx={headerCellStyle}>Thứ</TableCell>
                  <TableCell sx={headerCellStyle}>Tiết</TableCell>
                  {scheduleData?.["class-schedules"].map(
                    (classSchedule: IClassSchedule) => (
                      <TableCell
                        key={classSchedule["student-class-id"]}
                        sx={headerCellStyle}
                      >
                        {classSchedule["student-class-name"]}
                      </TableCell>
                    )
                  )}
                </TableRow>
              </TableHead>

              <TableBody>
                {WEEK_DAYS_FULL.map((day, dayIndex) => (
                  <>
                    {TIMETABLE_SLOTS.map((session, sessionIndex) =>
                      session.slots.map((slot, slotIndex) => (
                        <TableRow key={`${day}-${session.period}-${slotIndex}`}>
                          {slotIndex === 0 && sessionIndex === 0 && (
                            <TableCell
                              rowSpan={TIMETABLE_SLOTS.reduce(
                                (acc, s) => acc + s.slots.length,
                                0
                              )}
                              sx={cellStyle}
                            >
                              {day}
                            </TableCell>
                          )}
                          <TableCell
                            sx={cellStyle}
                            className={`${
                              sessionIndex < 2
                                ? "!text-primary-400"
                                : "!text-tertiary-normal"
                            }`}
                          >
                            {sessionIndex * 5 + slotIndex + 1}
                          </TableCell>

                          {scheduleData?.["class-schedules"].map(
                            (classSchedule: IClassSchedule) => {
                              const currentSlotIndex =
                                dayIndex * 10 +
                                sessionIndex * 5 +
                                slotIndex +
                                1;
                              const period = classSchedule[
                                "class-periods"
                              ].find(
                                (p) =>
                                  p["start-at"] === currentSlotIndex &&
                                  !p["is-deleted"] &&
                                  (selectedTeacher === "all" ||
                                    p["teacher-abbreviation"] ===
                                      selectedTeacher)
                              );
                              return (
                                <TableCell
                                  key={`${classSchedule["student-class-id"]}-${currentSlotIndex}`}
                                  sx={periodCellStyle(Boolean(period))}
                                >
                                  {period && (
                                    <div className="flex flex-col justify-center items-center h-full p-1 gap-1 relative">
                                      {scheduleData?.[
                                        "class-combinations"
                                      ]?.some(
                                        (
                                          combination: IClassCombinationScheduleObject
                                        ) =>
                                          combination[
                                            "subject-abbreviation"
                                          ] ===
                                            period["subject-abbreviation"] &&
                                          combination["start-at"].includes(
                                            currentSlotIndex
                                          ) &&
                                          combination.classes.some(
                                            (classItem) =>
                                              classItem.id ===
                                              classSchedule["student-class-id"]
                                          )
                                      ) && (
                                        <div className="absolute top-0 right-0 bg-warning-100 text-warning-500 text-[10px] px-1 rounded-bl">
                                          Lớp ghép
                                        </div>
                                      )}

                                      <strong className="tracking-wider text-ellipsis text-nowrap overflow-hidden text-primary-500 text-sm font-semibold">
                                        {period["subject-abbreviation"]}
                                      </strong>
                                      <div className="flex justify-center gap-2 mt-1">
                                        <p className="text-ellipsis text-nowrap overflow-hidden text-gray-600 text-xs">
                                          {period["room-code"]}
                                        </p>
                                        <p className="text-ellipsis text-nowrap overflow-hidden text-gray-600 text-xs">
                                          {period["teacher-abbreviation"]}
                                        </p>
                                      </div>
                                    </div>
                                  )}
                                </TableCell>
                              );
                            }
                          )}
                        </TableRow>
                      ))
                    )}
                    <TableRow>
                      <TableCell
                        sx={{ width: "100%", height: 1 }}
                        colSpan={scheduleData?.["class-schedules"].length + 2}
                      />
                    </TableRow>
                  </>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      )}
    </div>
  );
}
