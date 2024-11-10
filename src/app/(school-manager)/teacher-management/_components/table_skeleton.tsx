"use client";

import {
  Box,
  IconButton,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Toolbar,
  Tooltip,
} from "@mui/material";
import { ITeacherTableData } from "../_libs/constants";
import { visuallyHidden } from "@mui/utils";
import AddIcon from "@mui/icons-material/Add";
import FilterListIcon from "@mui/icons-material/FilterList";
import Image from "next/image";

interface HeadCell {
  id: keyof ITeacherTableData;
  label: string;
  centered: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: "id" as keyof ITeacherTableData,
    centered: false,
    label: "STT",
  },
  {
    id: "teacherName" as keyof ITeacherTableData,
    centered: false,
    label: "Tên giáo viên",
  },
  {
    id: "nameAbbreviation" as keyof ITeacherTableData,
    centered: false,
    label: "Tên viết tắt",
  },
  {
    id: "subjectDepartment" as keyof ITeacherTableData,
    centered: false,
    label: "Tên bộ môn",
  },
  {
    id: "email" as keyof ITeacherTableData,
    centered: false,
    label: "Email",
  },
  {
    id: "phoneNumber" as keyof ITeacherTableData,
    centered: false,
    label: "Số điện thoại",
  },
  {
    id: "status" as keyof ITeacherTableData,
    centered: false,
    label: "Trạng thái",
  },
];
function EnhancedTableHead() {
  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.centered ? "center" : "left"}
            sx={[
              { fontWeight: "bold" },
              headCell.centered ? { paddingLeft: "3%" } : {},
            ]}
          >
            <TableSortLabel active={true} direction={"desc"}>
              {headCell.label}
              <Box
                component="span"
                sx={[visuallyHidden, { position: "absolute", zIndex: 10 }]}
              >
                {"sorted descending"}
              </Box>
            </TableSortLabel>
          </TableCell>
        ))}
        <TableCell>
          <h2 className="font-semibold text-white"></h2>
        </TableCell>
      </TableRow>
    </TableHead>
  );
}
const TeacherTableSkeleton = () => {
  return (
      <Box sx={{ width: "100%" }}>
        <Paper sx={{ width: "100%", mb: 2 }}>
          <Toolbar
            sx={[
              {
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
                width: "100%",
              },
            ]}
          >
            <h2 className="text-title-medium-strong font-semibold w-full text-left">
              Danh sách giáo viên
            </h2>
            <Tooltip title="Thêm Môn học">
              <IconButton>
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
              <EnhancedTableHead />
              <TableBody>
                {[1, 2, 3, 4, 5, 6, 7].map((row, index) => {
                  const labelId = `enhanced-table-checkbox-${index}`;
                  return (
                    <TableRow
                      hover
                      tabIndex={-1}
                      key={index}
                      sx={{ cursor: "pointer" }}
                    >
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="normal"
                        align="left"
                      >
                        <Skeleton animation="wave" variant="text" />
                      </TableCell>
                      <TableCell align="left">
                        <Skeleton animation="wave" variant="text" />
                      </TableCell>
                      <TableCell align="left">
                        <Skeleton animation="wave" variant="text" />
                      </TableCell>
                      <TableCell align="left">
                        <Skeleton animation="wave" variant="text" />
                      </TableCell>
                      <TableCell align="left">
                        <Skeleton animation="wave" variant="text" />
                      </TableCell>
                      <TableCell align="left">
                        <Skeleton animation="wave" variant="text" />
                      </TableCell>
                      <TableCell align="left">
                        <Skeleton animation="wave" variant="text" />
                      </TableCell>
                      <TableCell width={80}>
												<IconButton
													color='success'
													sx={{ zIndex: 10 }}
													id={`basic-button${index}`}
													aria-controls={`basic-menu${index}`}
													aria-haspopup='true'
												>
													<Image
														src='/images/icons/menu.png'
														alt='notification-icon'
														unoptimized={true}
														width={20}
														height={20}
													/>
												</IconButton>
											</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            labelRowsPerPage='Số hàng'
            labelDisplayedRows={({from, to, count}) => 
                `${from} - ${to} của ${count !== -1 ? count : `hơn ${to}`}`
            }
            count={10}
            rowsPerPage={5}
            page={1}
            onPageChange={() => {}}
            onRowsPerPageChange={() => {}}
					/>
        </Paper>
      </Box>
  );
};
export default TeacherTableSkeleton;
