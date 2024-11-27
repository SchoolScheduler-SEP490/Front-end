import {
  Box,
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
} from "@mui/material";
import React from "react";
import { ITimetableTableData } from "../_libs/constants";
import { visuallyHidden } from "@mui/utils";

interface HeadCell {
  disablePadding: boolean;
  id: keyof ITimetableTableData;
  label: string;
  centered: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: "timetableCode",
    centered: true,
    disablePadding: false,
    label: "Mã TKB",
  },
  {
    id: "timetableName",
    centered: false,
    disablePadding: false,
    label: "Tên TKB",
  },
  {
    id: "termName",
    centered: true,
    disablePadding: false,
    label: "Học kỳ",
  },
  {
    id: "yearName",
    centered: true,
    disablePadding: false,
    label: "Năm học",
  },
  {
    id: "status",
    centered: true,
    disablePadding: false,
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

const TimetableTableSkeleton = () => {
  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size="medium"
          >
            <EnhancedTableHead />

            <TableBody>
              {[1, 2, 3, 4, 5].map((row, index) => {
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
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          labelRowsPerPage="Số hàng"
          labelDisplayedRows={({ from, to, count }) =>
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

export default TimetableTableSkeleton;
