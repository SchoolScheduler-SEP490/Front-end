import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import {
  IScheduleResponse,
  TIMETABLE_SLOTS,
  WEEK_DAYS_FULL,
} from "@/utils/constants";

interface ClassTimetableTableProps {
  scheduleData: IScheduleResponse | null;
  selectedClass: string;
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


export default function ClassTimetableTable({
  scheduleData,
  selectedClass,
}: ClassTimetableTableProps) {
  return (
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
                      .find((s) => s["student-class-name"] === selectedClass)
                      ?.["class-periods"].find(
                        (p) =>
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
                            <p className="text-ellipsis text-nowrap overflow-hidden text-gray-600 text-xs">
                              {period["teacher-abbreviation"]}
                            </p>
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
