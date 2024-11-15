import React, { useEffect, useState } from "react";
import { ITeacherAssignment } from "../_libs/constants";
import { useAppContext } from "@/context/app_provider";
import { getTeacherAssignment } from "../_libs/apiTeacher";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

interface TeacherAssignmentProps {
  teacherId: string | null;
}

const TeacherAssignment = ({ teacherId }: TeacherAssignmentProps) => {
  const { sessionToken, schoolId, selectedSchoolYearId } = useAppContext();
  const [assignment, setAssignment] = React.useState<ITeacherAssignment>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAssignments = async () => {
      const data = await getTeacherAssignment(
        schoolId,
        Number(teacherId),
        selectedSchoolYearId,
        sessionToken
      );
      if (data.status === 200) {
        setAssignment(data.result[0]);
      }
    };
    if (teacherId) {
      fetchAssignments();
    }
  }, [teacherId, sessionToken, schoolId, selectedSchoolYearId]);

  return (
    <div className="p-6">
      {isLoading && assignment && (
        <TableContainer
          component={Paper}
          sx={{
            width: "100%",
            maxHeight: 440,
            border: "1px solid rgba(224, 224, 224, 1)",
            boxShadow: "none",
          }}
          className="overflow-y-scroll no-scrollbar"
        >
          <Table
            sx={{ minWidth: "100%" }}
            stickyHeader
            aria-label="teacher assignments table"
          >
            <TableHead
              sx={{
                "& .MuiTableCell-head": {
                  fontWeight: "bold",
                },
              }}
            >
              <TableRow>
                <TableCell>Môn học</TableCell>
                <TableCell>Lớp</TableCell>
                <TableCell>Tuần bắt đầu</TableCell>
                <TableCell>Tuần kết thúc</TableCell>
                <TableCell>Số tiết</TableCell>
                <TableCell>Tổng số tiết trong năm</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {assignment["assignment-details"].map((detail, index) => (
                <TableRow key={index}>
                  <TableCell>{detail["subject-name"]}</TableCell>
                  <TableCell>{detail["class-name"]}</TableCell>
                  <TableCell className="text-center">
                    {detail["start-week"]}
                  </TableCell>
                  <TableCell className="text-center">
                    {detail["end-week"]}
                  </TableCell>
                  <TableCell className="text-center">
                    {detail["total-period"]}
                  </TableCell>
                  <TableCell className="text-center">
                    {assignment["total-slot-in-year"]}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};
export default TeacherAssignment;
