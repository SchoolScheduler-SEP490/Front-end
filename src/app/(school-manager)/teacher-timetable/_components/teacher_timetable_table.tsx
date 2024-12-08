import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  Select,
  MenuItem,
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
import { TIMETABLE_SLOTS, WEEK_DAYS_FULL } from "@/utils/constants";

interface TeacherTimetableTableProps {
  schoolId: string;
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
  sessionToken,
}: TeacherTimetableTableProps) {
  const [publishedTimetable, setPublishedTimetable] = useState<any>(null);
  const [selectedTeacher, setSelectedTeacher] = useState<string>("");
  const [teachers, setTeachers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPublishedTimetable = async () => {
      try {
        setLoading(true);
        const timetablesRef = collection(firestore, "timetables");
        const q = query(
          timetablesRef,
          where("school-id", "==", Number(schoolId)),
          where("status", "==", "Published")
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
            const scheduleData = scheduleSnap.data();
            setPublishedTimetable(scheduleData);

            // Extract unique teacher abbreviations
            const teacherList = new Set<string>();
            scheduleData["class-schedules"].forEach((classSchedule: any) => {
              classSchedule["class-periods"].forEach((period: any) => {
                if (period["teacher-abbreviation"]) {
                  teacherList.add(period["teacher-abbreviation"]);
                }
              });
            });
            setTeachers(Array.from(teacherList));
          }
        }
      } catch (error) {
        console.error("Error fetching timetable:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPublishedTimetable();
  }, [schoolId]);

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="w-full mb-2 flex justify-between items-center">
        <FormControl sx={{ minWidth: 170 }}>
          <Select
            value={selectedTeacher}
            onChange={(e) => setSelectedTeacher(e.target.value)}
            displayEmpty
            MenuProps={MenuProps}
          >
            <MenuItem value="">Chọn giáo viên</MenuItem>
            {teachers.map((teacher) => (
              <MenuItem key={teacher} value={teacher}>
                {teacher}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      <div className="w-full h-[90vh] flex flex-col justify-start items-center pb-[2vh]">
        <TableContainer
          sx={{ mb: 10, maxHeight: "100%" }}
          className="!no-scrollbar"
        >
          <Table size="small" stickyHeader sx={{ position: "relative" }}>
            <TableHead
              sx={{ position: "sticky", top: 0, left: 0, zIndex: 100 }}
            >
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
                        .flatMap((cs: any) => cs["class-periods"])
                        .find(
                          (p: any) =>
                            p["start-at"] === currentSlotIndex &&
                            !p["is-deleted"] &&
                            p["teacher-abbreviation"] === selectedTeacher
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
    </div>
  );
}
