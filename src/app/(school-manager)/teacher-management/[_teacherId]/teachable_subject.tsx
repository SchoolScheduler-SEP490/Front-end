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
import {
  APPROPRIATE_LEVEL_TRANSLATOR,
  CLASSGROUP_TRANSLATOR,
} from "@/utils/constants";
import AddIcon from "@mui/icons-material/Add";
import FilterListIcon from "@mui/icons-material/FilterList";
import AddTeachableSubjectModal from "./add_teachable_subject";
import useSWR, { KeyedMutator } from "swr";
import Image from "next/image";
import DeleteTeachableSubjectModal from "./delete_teachable_subject";

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
  const [openDeleteModal, setOpenDeleteModal] = React.useState<boolean>(false);
  const [selectedRow, setSelectedRow] = React.useState<
    ITeachableSubject | undefined
  >();
  const [selectedSubject, setSelectedSubject] = useState<{
    name: string;
    id: number;
  } | null>(null);

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

  useEffect(() => {
    fetchData();
  }, [teacherId, schoolId, sessionToken]);

  const handleOpenAddForm = () => setOpenAddForm(true);

  const handleDeleteClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    subject: ITeachableSubject,
    appropriateLevelId: number
  ) => {
    event.stopPropagation();
    setSelectedSubject({
      name: subject["subject-name"],
      id: appropriateLevelId,
    });
    setOpenDeleteModal(true);
  };

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
                <TableCell className="font-semibold">Trình độ</TableCell>
                <TableCell className="font-semibold text-center">
                  Môn chính
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {teachableSubjects.flatMap((subject, index) =>
                subject["list-approriate-level-by-grades"].map(
                  (gradeLevel, gradeIndex) => (
                    <TableRow
                      key={`${index}-${gradeIndex}`}
                      hover
                      className="hover:bg-gray-50"
                    >
                      {index === 0 && gradeIndex === 0 && (
                        <TableCell
                          rowSpan={teachableSubjects.reduce(
                            (total, subj) =>
                              total +
                              subj["list-approriate-level-by-grades"].length,
                            0
                          )}
                          style={{
                            borderRight: "1px solid #e0e0e0",
                          }}
                        >
                          {departmentName}
                        </TableCell>
                      )}

                      {gradeIndex === 0 && (
                        <TableCell
                          rowSpan={
                            subject["list-approriate-level-by-grades"].length
                          }
                          sx={{
                            borderRight: "1px solid #e0e0e0",
                          }}
                        >
                          {subject["subject-name"]}
                        </TableCell>
                      )}
                      {gradeIndex === 0 && (
                        <TableCell
                          rowSpan={
                            subject["list-approriate-level-by-grades"].length
                          }
                          sx={{
                            borderRight: "1px solid #e0e0e0",
                          }}
                        >
                          {subject.abbreviation}
                        </TableCell>
                      )}
                      <TableCell>
                        {`Khối ${CLASSGROUP_TRANSLATOR[gradeLevel.grade]}`}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center items-center">
                          <span
                            className={`font-medium ${
                              APPROPRIATE_LEVEL_TRANSLATOR[
                                gradeLevel["appropriate-level"]
                              ] === 1
                                ? "text-red-500"
                                : APPROPRIATE_LEVEL_TRANSLATOR[
                                    gradeLevel["appropriate-level"]
                                  ] === 5
                                ? "text-green-600"
                                : "text-gray-700"
                            }`}
                          >
                            {
                              APPROPRIATE_LEVEL_TRANSLATOR[
                                gradeLevel["appropriate-level"]
                              ]
                            }
                          </span>
                        </div>
                      </TableCell>
                      <TableCell align="center">
                        <div className="w-full h-full flex justify-center items-center">
                          <div
                            className={`w-full h-fit px-[6%] py-[2%] rounded-[5px] font-semibold ${
                              gradeLevel["is-main"]
                                ? "bg-basic-positive-hover text-basic-positive"
                                : "bg-basic-gray-hover text-basic-gray"
                            }`}
                          >
                            {gradeLevel["is-main"] ? "Có" : "Không"}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell width={80}>
                        <IconButton
                          color="error"
                          sx={{ zIndex: 10 }}
                          onClick={(event) =>
                            handleDeleteClick(event, subject, gradeLevel.id)
                          }
                        >
                          <Image
                            src="/images/icons/delete.png"
                            alt="Xóa chuyên môn"
                            width={15}
                            height={15}
                          />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  )
                )
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <AddTeachableSubjectModal
          open={openAddForm}
          onClose={setOpenAddForm}
          teacherId={teacherId}
          mutate={fetchData}
        />
        <DeleteTeachableSubjectModal
          open={openDeleteModal}
          onClose={setOpenDeleteModal}
          subjectName={selectedSubject?.name || ""}
          subjectId={selectedSubject?.id || 0}
          mutate={fetchData}
        />
      </Paper>
    </Box>
  );
}
