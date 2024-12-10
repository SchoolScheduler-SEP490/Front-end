import React, { useEffect, useState } from "react";
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
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { firestore } from "@/utils/firebaseConfig";
import {
  CLASSGROUP_TRANSLATOR,
  TIMETABLE_SLOTS,
  WEEK_DAYS_FULL,
} from "@/utils/constants";

interface TeacherTimetableTableProps {
  schoolId: string;
  sessionToken: string;
  teacherAbbr: string;
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

export default function TeacherTimetableTable({
  schoolId,
  sessionToken,
  teacherAbbr,
}: TeacherTimetableTableProps) {
  const [publishedTimetable, setPublishedTimetable] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedGrade, setSelectedGrade] = useState<number>(0);
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [classes, setClasses] = useState<string[]>([]);

  useEffect(() => {
    const fetchPublishedTimetable = async () => {
      try {
        setLoading(true);
        const timetablesRef = collection(firestore, "timetables");
        const q = query(
          timetablesRef,
          where("school-id", "==", Number(schoolId)),
          where("status", "==", "Published") // This one shows Published timetable instead of PublishedInternal
        );

        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const timetableDoc = snapshot.docs[0];
          const scheduleRef = doc(
            firestore,
            "schedule-responses",
            timetableDoc.data()["generated-schedule-id"]
          );
          const scheduleSnap = await getDoc(scheduleRef);

          if (scheduleSnap.exists()) {
            setPublishedTimetable(scheduleSnap.data());
          }
        }
      } catch (error) {
        console.error("Error fetching timetable:", error);
      } finally {
        setLoading(false);
      }
    };

    if (schoolId && teacherAbbr) {
      fetchPublishedTimetable();
    }
  }, [schoolId, teacherAbbr]);

  useEffect(() => {
    if (publishedTimetable) {
      const allClasses = publishedTimetable["class-schedules"]
        .map((cs: any) => cs["student-class-name"])
        .filter((name: string) => {
          if (selectedGrade === 0) return true;
          return name.startsWith(selectedGrade.toString());
        });
      setClasses(Array.from(new Set(allClasses)));
    }
  }, [publishedTimetable, selectedGrade]);
  

  return (
    <div className="w-full h-[90vh] flex flex-col justify-start items-center pb-[2vh]">
      <div className="w-full mb-4 flex gap-4">
        <FormControl sx={{ minWidth: 120 }}>
          <Select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(Number(e.target.value))}
            displayEmpty
          >
            <MenuItem value={0}>Tất cả khối</MenuItem>
            {Object.entries(CLASSGROUP_TRANSLATOR).map(([key, value]) => (
              <MenuItem key={key} value={value}>
                Khối {value}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 120 }}>
          <Select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            displayEmpty
          >
            <MenuItem value="">Tất cả lớp</MenuItem>
            {classes.map((className) => (
              <MenuItem key={className} value={className}>
                {className}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      <TableContainer
        sx={{ mb: 10, maxHeight: "100%" }}
        className="!no-scrollbar"
      >
        <Table size="small" stickyHeader sx={{ position: "relative" }}>
          <TableHead sx={{ position: "sticky", top: 0, left: 0, zIndex: 100 }}>
            <TableRow>
              <TableCell sx={headerCellStyle}>Tiết</TableCell>
              {WEEK_DAYS_FULL.map((day) => (
                <TableCell key={day} sx={headerCellStyle}>
                  {day}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {TIMETABLE_SLOTS.map((session, sessionIndex) =>
              session.slots.map((slot, slotIndex) => (
                <TableRow key={`${session.period}-${slotIndex}`}>
                  <TableCell sx={cellStyle}>
                    {sessionIndex * 5 + slotIndex + 1}
                  </TableCell>

                  {WEEK_DAYS_FULL.map((day, dayIndex) => {
                    const currentSlotIndex =
                      dayIndex * 10 + sessionIndex * 5 + slotIndex + 1;
                      const period = publishedTimetable?.["class-schedules"]
                      .flatMap((cs: any) => {
                        // Filter by class if selected
                        if (selectedClass && cs["student-class-name"] !== selectedClass) {
                          return [];
                        }
                        // Filter by grade
                        if (selectedGrade !== 0 && !cs["student-class-name"].startsWith(selectedGrade.toString())) {
                          return [];
                        }
                        return cs["class-periods"];
                      })
                      .find(
                        (p: any) =>
                          p["start-at"] === currentSlotIndex &&
                          !p["is-deleted"] &&
                          p["teacher-abbreviation"] === teacherAbbr
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
                            <span className="text-xs text-gray-600">
                              {period["class-name"]}
                            </span>
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
