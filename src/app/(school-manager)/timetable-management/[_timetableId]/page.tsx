"use client";

import SMHeader from "@/commons/school_manager/header";
import { useParams, useRouter } from "next/navigation";
import {
  WEEKDAYS,
  TIME_SLOTS,
  SAMPLE_CLASSES,
  ITimetableTableData,
} from "../_libs/constants";
import {
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useEffect, useMemo, useRef, useState } from "react";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { firestore } from "@/utils/firebaseConfig";
import {
  IScheduleResponse,
  TIMETABLE_SLOTS,
  WEEK_DAYS_FULL,
} from "@/utils/constants";

export default function TimetableDetail() {
  const params = useParams();
  const timetableId = params._timetableId;
  const router = useRouter();
  const [selectedGrade, setSelectedGrade] = useState("all");
  const [displayCount, setDisplayCount] = useState(5);
  const [startIndex, setStartIndex] = useState(0);
  const [scheduleData, setScheduleData] = useState<IScheduleResponse | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  const handleBack = () => {
    router.push("/timetable-management");
  };

  const grades = Array.from(new Set(SAMPLE_CLASSES.map((c) => c.grade)));
  const filteredClasses =
    selectedGrade === "all"
      ? SAMPLE_CLASSES
      : SAMPLE_CLASSES.filter((c) => c.grade === selectedGrade);

  const visibleClasses = filteredClasses.slice(
    startIndex,
    startIndex + displayCount
  );

  const handleScrollLeft = () => {
    if (startIndex > 0) {
      setStartIndex((prev) => prev - 1);
    }
  };

  const handleScrollRight = () => {
    if (startIndex + displayCount < filteredClasses.length) {
      setStartIndex((prev) => prev + 1);
    }
  };

  useEffect(() => {
    const fetchScheduleData = async () => {
      setIsLoading(true);
      try {
        const scheduleRef = doc(firestore, 'schedule-responses', 'OA4tFt6lktBrS8XUVtUH');
        const scheduleSnap = await getDoc(scheduleRef);
        
        if (scheduleSnap.exists()) {
          const data = scheduleSnap.data() as IScheduleResponse;
          setScheduleData(data);
        }
      } catch (error) {
        console.error('Error fetching schedule:', error);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchScheduleData();
  }, []);

  const classNames = useMemo(() => {
    if (!scheduleData) return [];
    return Array.from(
      new Set(
        scheduleData["class-schedules"].map(
          (schedule) => schedule["student-class-name"]
        )
      )
    );
  }, [scheduleData]);

  return (
    <div className="w-[84%] h-screen flex flex-col justify-start items-start overflow-y-scroll no-scrollbar">
      <SMHeader>
        <div className="flex items-center gap-4">
          <IconButton onClick={handleBack} sx={{ color: "white" }}>
            <ArrowBackIcon />
          </IconButton>
          <h3 className="text-title-small text-white font-semibold tracking-wider">
            Chi tiết Thời khóa biểu
          </h3>
        </div>
      </SMHeader>
      {(!isLoading && scheduleData) && (
      <div className="w-full h-fit flex flex-col justify-center items-center px-[8vw] pt-[3vh]">
        <div className="w-full mb-4 flex justify-center">
          <FormControl sx={{ minWidth: 170 }}>
            <InputLabel>Khối</InputLabel>
            <Select
              value={selectedGrade}
              label="Khối"
              onChange={(e) => setSelectedGrade(e.target.value)}
            >
              <MenuItem value="all">Tất cả</MenuItem>
              {grades.map((grade) => (
                <MenuItem key={grade} value={grade}>
                  Khối {grade}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 750 }} aria-label="timetable">
            <TableHead>
              <TableRow>
                <TableCell className="font-semibold">Thứ</TableCell>
                <TableCell className="font-semibold">Tiết/Lớp</TableCell>
                <TableCell colSpan={visibleClasses.length + 2}>
                  <div className="flex items-center justify-center gap-2 ">
                    {classNames.map((className) => (
                      <div
                        key={className}
                        className="font-semibold w-full text-center"
                      >
                        {className}
                      </div>
                    ))}
                  </div>
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {WEEK_DAYS_FULL.map((day, dayIndex) =>
                TIMETABLE_SLOTS.map((session, sessionIndex) =>
                  session.slots.map((slot, slotIndex) => (
                    <TableRow key={`${day}-${session.period}-${slotIndex}`}>
                      {slotIndex === 0 && sessionIndex === 0 && (
                        <TableCell
                          rowSpan={TIMETABLE_SLOTS.reduce(
                            (acc, s) => acc + s.slots.length,
                            0
                          )}
                          className="font-semibold"
                          sx={{
                            borderRight: "1px solid #e5e7eb",
                            textAlign: "center",
                          }}
                        >
                          {day}
                        </TableCell>
                      )}
                      <TableCell component="th" scope="row">
                        {slot}
                      </TableCell>
                      <TableCell
                        colSpan={
                          (scheduleData?.["class-schedules"]?.length ?? 0) + 2
                        }
                      >
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-[40px]" />
                          {scheduleData?.["class-schedules"].map(
                            (classSchedule) => {
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
                                  !p["is-deleted"]
                              );

                              return (
                                <div
                                  key={`${classSchedule["student-class-id"]}-${currentSlotIndex}`}
                                  className="w-full"
                                >
                                  <div className="min-h-[60px] p-2 border border-dashed border-gray-200 rounded flex flex-col justify-between">
                                    <div className="text-sm font-medium text-center">
                                      {period?.["subject-abbreviation"]}
                                    </div>
                                    <div className="flex justify-center text-xs text-gray-500">
                                      <span>
                                        {period?.["teacher-abbreviation"]}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              );
                            }
                          )}
                          <div className="w-[40px]" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      )}
    </div>
  );
}
