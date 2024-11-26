import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Box,
  Toolbar,
  IconButton,
  Tooltip,
} from "@mui/material";
import { ITeachableSubject } from "../_libs/constants";
import { getTeacherSubject } from "../_libs/apiTeacher";
import { CLASSGROUP_TRANSLATOR } from "@/utils/constants";
import AddIcon from "@mui/icons-material/Add";
import FilterListIcon from "@mui/icons-material/FilterList";
import AddTeachableSubjectModal from "./add_teachable_subject";
import { KeyedMutator } from "swr";

interface TeachableSubjectTableProps {
  teacherId: string | null;
  schoolId: string;
  sessionToken: string;
  mutate: KeyedMutator<any>;
}

export default function TeachableSubjectTable({
  teacherId,
  schoolId,
  sessionToken,
  mutate,
}: TeachableSubjectTableProps) {
  const [teachableSubjects, setTeachableSubjects] = useState<
    ITeachableSubject[]
  >([]);
  const [departmentName, setDepartmentName] = useState<string>("");
  const [openAddForm, setOpenAddForm] = React.useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      if (teacherId) {
        const response = await getTeacherSubject(
          schoolId,
          Number(teacherId),
          sessionToken
        );
        if (response.status === 200) {
          setTeachableSubjects(response.result["teachable-subjects"]);
          setDepartmentName(response.result["department-name"]);
        }
      }
    };
    fetchData();
  }, [teacherId, schoolId, sessionToken]);

  const handleOpenAddForm = () => setOpenAddForm(true);

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <Toolbar
          sx={{
            pl: { sm: 2 },
            pr: { xs: 1, sm: 1 },
            width: "100%",
          }}
        >
          <h2 className="text-title-medium-strong font-semibold w-full text-left">
            Danh sách môn học có thể dạy
          </h2>
          <Tooltip title="Thêm môn học">
            <IconButton onClick={handleOpenAddForm}>
              <AddIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Lọc danh sách">
            <IconButton>
              <FilterListIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>

        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size="medium"
          >
            <TableHead className="bg-gray-50">
              <TableRow>
                <TableCell className="font-semibold">Tổ bộ môn</TableCell>
                <TableCell className="font-semibold">Môn học</TableCell>
                <TableCell className="font-semibold">Mã môn học</TableCell>
                <TableCell className="font-semibold">Khối lớp</TableCell>
                <TableCell className="font-semibold text-center">
                  Môn chính
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {teachableSubjects.map((subject, index) => (
                <TableRow key={index} hover className="hover:bg-gray-50">
                  <TableCell
                    rowSpan={index === 0 ? teachableSubjects.length : 0}
                    style={{
                      display: index === 0 ? "table-cell" : "none",
                      borderRight: "1px solid #e0e0e0",
                    }}
                  >
                    {departmentName}
                  </TableCell>
                  <TableCell>{subject["subject-name"]}</TableCell>
                  <TableCell className="text-center">
                    {subject.abbreviation}
                  </TableCell>
                  <TableCell>
                    {subject["list-approriate-level-by-grades"].map(
                      (grade, idx) => (
                        <span key={idx}>
                          {`Khối ${CLASSGROUP_TRANSLATOR[grade.grade]}`}
                          {idx <
                          subject["list-approriate-level-by-grades"].length - 1
                            ? ", "
                            : ""}
                        </span>
                      )
                    )}
                  </TableCell>

                  <TableCell align="center">
                    <div className="w-full h-full flex justify-center items-center">
                      <div
                        className={`w-full h-fit px-[6%] py-[2%] rounded-[5px] font-semibold ${
                          subject["is-main"]
                            ? "bg-basic-positive-hover text-basic-positive"
                            : "bg-basic-gray-hover text-basic-gray"
                        }`}
                        style={{
                          whiteSpace: "nowrap",
                          margin: "0 auto",
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        {subject["is-main"] ? "Có" : "Không"}
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <AddTeachableSubjectModal
          open={openAddForm}
          onClose={setOpenAddForm}
          teacherId={teacherId}
          mutate={mutate}
        />
      </Paper>
    </Box>
  );
}
