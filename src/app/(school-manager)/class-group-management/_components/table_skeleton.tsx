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
import { visuallyHidden } from "@mui/utils";
import AddIcon from "@mui/icons-material/Add";
import FilterListIcon from "@mui/icons-material/FilterList";
import Image from "next/image";
import { IClassGroupTableData } from "../_libs/constants";

interface HeadCell {
  id: keyof IClassGroupTableData;
  label: string;
  centered: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: "id" as keyof IClassGroupTableData,
    label: "STT",
    centered: false,
  },
  {
    id: "groupName" as keyof IClassGroupTableData,
    label: "Tên nhóm lớp",
    centered: false,
  },
  {
    id: "studentClassGroupCode" as keyof IClassGroupTableData,
    label: "Mã nhóm lớp",
    centered: true,
  },
  {
    id: "grade" as keyof IClassGroupTableData,
    label: "Tên khối",
    centered: false,
  },
  {
    id: "curriculum" as keyof IClassGroupTableData,
    label: "Khung chương trình",
    centered: false,
  }
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

const ClassGroupTableSkeleton = () => {
  return (
    <div className="w-full h-fit flex flex-col justify-center items-center px-[10vw] pt-[5vh]">
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
              Nhóm lớp
            </h2>
            <Tooltip title="Thêm nhóm lớp">
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
                {[1, 2, 3, 4, 5, 6].map((row, index) => {
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
                      <TableCell width={80}>
                        <IconButton
                          color="success"
                          sx={{ zIndex: 10 }}
                          id={`basic-button${index}`}
                          aria-controls={`basic-menu${index}`}
                          aria-haspopup="true"
                        >
                          <Image
                            src="/images/icons/menu.png"
                            alt="notification-icon"
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
    </div>
  );
};
export default ClassGroupTableSkeleton;