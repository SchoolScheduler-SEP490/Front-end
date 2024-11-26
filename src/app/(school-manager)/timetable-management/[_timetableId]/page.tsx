"use client";

import SMHeader from "@/commons/school_manager/header";
import { useParams, useRouter } from "next/navigation";
import { WEEKDAYS, TIME_SLOTS, SAMPLE_CLASSES, ITimetableTableData } from "../_libs/constants";
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
import { useEffect, useRef, useState } from "react";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { collection, getDocs, query, where } from 'firebase/firestore';
import { firestore } from "@/utils/firebaseConfig";

export default function TimetableDetail() {
  const params = useParams();
  const timetableId = params._timetableId;
  const router = useRouter();
  const [selectedGrade, setSelectedGrade] = useState("all");
  const [displayCount, setDisplayCount] = useState(5);
  const [startIndex, setStartIndex] = useState(0);
  const [timetableCode, setTimetableCode] = useState('');

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
    const fetchTimetableCode = async () => {
        const timetablesRef = collection(firestore, 'timetables');
        const q = query(timetablesRef, where('id', '==', Number(timetableId)));
        const snapshot = await getDocs(q);
        
        if (!snapshot.empty) {
            const data = snapshot.docs[0].data();
            setTimetableCode(data['timetable-abbreviation']);
        }
    };

    fetchTimetableCode();
}, [timetableId]);


  return (
    <div className="w-[84%] h-screen flex flex-col justify-start items-start overflow-y-scroll no-scrollbar">
      <SMHeader>
        <div className="flex items-center gap-4">
          <IconButton onClick={handleBack} sx={{ color: "white" }}>
            <ArrowBackIcon />
          </IconButton>
          <h3 className="text-title-small text-white font-semibold tracking-wider">
            Chi tiết Thời khóa biểu {timetableCode}
          </h3>
        </div>
      </SMHeader>
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
                    <IconButton
                      onClick={handleScrollLeft}
                      disabled={startIndex === 0}
                      size="small"
                    >
                      <ChevronLeftIcon />
                    </IconButton>

                    {visibleClasses.map((class_) => (
                      <div
                        key={class_.id}
                        className="font-semibold w-full text-center"
                      >
                        {class_.name}
                      </div>
                    ))}
                    <IconButton
                      onClick={handleScrollRight}
                      disabled={
                        startIndex + displayCount >= filteredClasses.length
                      }
                      size="small"
                    >
                      <ChevronRightIcon />
                    </IconButton>
                  </div>
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {WEEKDAYS.map((day) =>
                TIME_SLOTS.map((slot, index) => (
                  <TableRow key={`${day.id}-${slot.id}`}>
                    {slot.id === 1 && (
                      <TableCell
                        rowSpan={TIME_SLOTS.length}
                        className="font-semibold"
                        sx={{
                          borderRight: "1px solid #e5e7eb",
                          textAlign: "center",
                        }}
                      >
                        {day.name}
                      </TableCell>
                    )}
                    <TableCell component="th" scope="row">
                      Tiết {slot.id}
                      <br />
                      <span className="text-xs text-gray-500">
                        {slot.startTime} - {slot.endTime}
                      </span>
                    </TableCell>
                    <TableCell colSpan={visibleClasses.length + 2}>
                      <div className="flex items-center justify-center gap-4">
                        <div className="w-[40px]" />
                        {visibleClasses.map((class_) => (
                          <div
                            key={`${class_.id}-${slot.id}-${day.id}`}
                            className="w-full"
                          >
                            <div className="min-h-[60px] p-2 border border-dashed border-gray-200 rounded flex flex-col justify-between">
                              <div className="text-sm font-medium text-center">
                                MTH
                              </div>
                              <div className="flex justify-between text-xs text-gray-500">
                                <span>P201</span>
                                <span>PhuongLHK</span>
                              </div>
                            </div>
                          </div>
                        ))}
                        <div className="w-[40px]" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}
