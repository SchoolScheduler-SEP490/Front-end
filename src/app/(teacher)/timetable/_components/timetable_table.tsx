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
  FormControl,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { useEffect, useMemo, useState } from "react";
import useTimetableData from "../_hooks/useTimetableData";
import { getTerms } from "../_libs/apiTimetableTeacher";

interface TeacherTimetableTableProps {
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

export default function TeacherTimetableTable({
  schoolId,
  schoolYearId,
  sessionToken,
}: TeacherTimetableTableProps) {
  const [selectedGrade, setSelectedGrade] = useState<string>("");
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedTerm, setSelectedTerm] = useState<number>(1);
  const [terms, setTerms] = useState<ITermResponse[]>([]);
  const { selectedSchoolYearId } = useAppContext();
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());

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
  } = useTimetableData({
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
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              variant="standard"
            >
              <MenuItem value="">Chọn khối</MenuItem>
              {Object.entries(CLASSGROUP_TRANSLATOR).map(([key, value]) => (
                <MenuItem key={key} value={key}>
                  {`Khối ${value}`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 170 }}>
            <Select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              variant="standard"
              MenuProps={MenuProps}
            >
              <MenuItem value="">Chọn lớp</MenuItem>
              {classNames.map((className: string) => (
                <MenuItem key={className} value={className}>
                  {className}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      </div>

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
              <TableCell sx={{ ...headerCellStyle }}>Tiết</TableCell>

              {WEEK_DAYS_FULL.map((day) => (
                <TableCell key={day} sx={{ ...headerCellStyle }}>
                  {day}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {TIMETABLE_SLOTS.map((session, sessionIndex) =>
              session.slots.map((slot, slotIndex) => (
                <TableRow key={`${session.period}-${slotIndex}`}>
                  <TableCell sx={{ ...cellStyle }}>
                    {sessionIndex * 5 + slotIndex + 1}
                  </TableCell>

                  {WEEK_DAYS_FULL.map((day, dayIndex) => {
                    const currentSlotIndex =
                      dayIndex * 10 + sessionIndex * 5 + slotIndex + 1;
                    const period = scheduleData?.["class-schedules"]
                      .filter((s: IClassSchedule) =>
                        s["student-class-name"].startsWith(
                          String(CLASSGROUP_TRANSLATOR[selectedGrade])
                        )
                      )
                      .find(
                        (s: IClassSchedule) =>
                          s["student-class-name"] === selectedClass
                      )
                      ?.["class-periods"].find(
                        (p: IClassPeriod) =>
                          p["start-at"] === currentSlotIndex && !p["is-deleted"]
                      );

                    return (
                      <TableCell
                        key={`${day}-${currentSlotIndex}`}
                        sx={periodCellStyle(Boolean(period))}
                      >
                        {period && (
                          <div className="flex flex-col justify-center items-center h-full p-1 gap-1">
                            <strong className="tracking-wider text-ellipsis text-nowrap overflow-hidden text-primary-500 text-sm font-semibold">
                              {period["subject-abbreviation"]}
                            </strong>
                            <div className="flex justify-between w-full">
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
                  })}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
