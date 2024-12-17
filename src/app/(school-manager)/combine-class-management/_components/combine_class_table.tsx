import {
  Box,
  IconButton,
  Menu,
  MenuItem,
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
import { ICombineClassData } from "../_libs/constants";
import { KeyedMutator } from "swr";
import { ICommonOption } from "@/utils/constants";
import React from "react";
import AddCombineClassModal from "./add_combine_class";
import DeleteCombineClassModal from "./delete_combine_class";
import UpdateCombineClassModal from "./update_combine_class";

function descendingComparator<T>(a: T, b: T, orderBy: keyof T): number {
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
  return 0;
}
type Order = "asc" | "desc";

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string }
) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

interface HeadCell {
  id: keyof ICombineClassData;
  label: string;
  centered: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: "id" as keyof ICombineClassData,
    label: "STT",
    centered: false,
  },
  {
    id: "subjectId" as keyof ICombineClassData,
    label: "Tên môn học",
    centered: false,
  },
  {
    id: "roomId" as keyof ICombineClassData,
    label: "Phòng học",
    centered: false,
  },
  {
    id: "roomSubjectCode" as keyof ICombineClassData,
    label: "Mã lớp ghép",
    centered: false,
  },
  {
    id: "studentClass" as keyof ICombineClassData,
    label: "Lớp học",
    centered: false,
  },
  {
    id: "termId" as keyof ICombineClassData,
    label: "Học kỳ",
    centered: false,
  },
  {
    id: "teacherAbbreviation" as keyof ICombineClassData,
    label: "Mã giáo viên",
    centered: false,
  },
];

interface EnhancedTableProps {
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof ICombineClassData
  ) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { order, orderBy, rowCount, onRequestSort } = props;
  const createSortHandler =
    (property: keyof ICombineClassData) =>
    (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.centered ? "center" : "left"}
            sortDirection={orderBy === headCell.id ? order : false}
            sx={{
              fontWeight: "bold",
              whiteSpace: "nowrap",
              overflow: "hidden",
            }}
          >
            {headCell.id === "subjectId" ? (
              <span>{headCell.label}</span>
            ) : (
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : "asc"}
                onClick={createSortHandler(
                  headCell.id as keyof ICombineClassData
                )}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === "desc"
                      ? "sorted descending"
                      : "sorted ascending"}
                  </Box>
                ) : null}
              </TableSortLabel>
            )}
          </TableCell>
        ))}
        <TableCell>
          <h2 className="font-semibold text-white"></h2>
        </TableCell>
      </TableRow>
    </TableHead>
  );
}

interface ICombineClassProps {
  combineClassData: ICombineClassData[];
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  rowsPerPage: number;
  setRowsPerPage: React.Dispatch<React.SetStateAction<number>>;
  totalRows?: number;
  mutate: KeyedMutator<any>;
  selectedCombineClassId: number;
  setSelectedCombineClassId: React.Dispatch<React.SetStateAction<number>>;
  isDetailsShown: boolean;
  setIsDetailsShown: React.Dispatch<React.SetStateAction<boolean>>;
}

const dropdownOptions: ICommonOption[] = [
  { img: "/images/icons/compose.png", title: "Chỉnh sửa thông tin" },
  { img: "/images/icons/delete.png", title: "Xóa lớp ghép" },
];

const CombineClassTable = (props: ICombineClassProps) => {
  const {
    combineClassData,
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
    totalRows,
    mutate,
    selectedCombineClassId,
    setSelectedCombineClassId,
    isDetailsShown,
    setIsDetailsShown,
  } = props;
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] =
    React.useState<keyof ICombineClassData>("subjectId");
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [openAddForm, setOpenAddForm] = React.useState<boolean>(false);
  const [openDeleteModal, setOpenDeleteModal] = React.useState<boolean>(false);
  const [openUpdateModal, setOpenUpdateModal] = React.useState<boolean>(false);
  const [selectedRow, setSelectedRow] = React.useState<
    ICombineClassData | undefined
  >();
  const open = Boolean(anchorEl);

  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    row: ICombineClassData
  ) => {
    event.preventDefault();
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof ICombineClassData
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleMenuItemClick = (index: number, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    switch (index) {
      case 0:
        setOpenUpdateModal(true);
        break;
      case 1:
        setOpenDeleteModal(true);
        break;
      default:
        break;
    }
    setAnchorEl(null);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value));
  };

  const visibleRows = React.useMemo(
    () => [...combineClassData].sort(getComparator(order, orderBy)),
    [order, orderBy, page, rowsPerPage, combineClassData]
  );

  const emptyRows =
    combineClassData.length < rowsPerPage && rowsPerPage < 10
      ? rowsPerPage - combineClassData.length + 1
      : 0;

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleOpenAddForm = () => setOpenAddForm(true);

  const handleSelectCombineClass = (row: ICombineClassData) => {
    setSelectedCombineClassId(row.id);
    setIsDetailsShown(true);
  };

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
              Lớp ghép
            </h2>
            <Tooltip title="Thêm lớp ghép">
              <IconButton onClick={handleOpenAddForm}>
                <AddIcon />
              </IconButton>
            </Tooltip>
          </Toolbar>

          <TableContainer>
            <Table
              sx={{ minWidth: 750 }}
              aria-labelledby="tableTitle"
              size="medium"
            >
              <EnhancedTableHead
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
                rowCount={combineClassData.length}
              />
              <TableBody>
                {visibleRows.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      <h1 className="text-body-large-strong italic text-basic-gray">
                        Lớp ghép chưa có dữ liệu
                      </h1>
                    </TableCell>
                  </TableRow>
                )}
                {visibleRows.map((row, index) => {
                  const labelId = `enhanced-table-checkbox-${index}`;
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.id}
                      sx={[
                        { cursor: "pointer" },
                        selectedCombineClassId === row.id &&
                          isDetailsShown && {
                            backgroundColor: "#f5f5f5",
                          },
                      ]}
                      onClick={() => handleSelectCombineClass(row)}
                    >
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        align="left"
                      >
                        {index + 1 + page * rowsPerPage}
                      </TableCell>
                      <TableCell align="left">{row.subjectId}</TableCell>
                      <TableCell align="left">{row.roomId}</TableCell>
                      <TableCell align="left">{row.roomSubjectCode}</TableCell>
                      <TableCell align="left">{row.studentClass}</TableCell>
                      <TableCell align="left">{row.termId}</TableCell>
                      <TableCell align="left">
                        {row.teacherAbbreviation}
                      </TableCell>
                      <TableCell
                        width={80}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <IconButton
                          color="success"
                          sx={{ zIndex: 10 }}
                          id="basic-button"
                          aria-controls={
                            open ? `basic-menu${index}` : undefined
                          }
                          aria-haspopup="true"
                          aria-expanded={open ? "true" : undefined}
                          onClick={(event) => handleClick(event, row)}
                        >
                          <Image
                            src="/images/icons/menu.png"
                            alt="notification-icon"
                            unoptimized={true}
                            width={20}
                            height={20}
                          />
                        </IconButton>

                        <Menu
                          id={`basic-menu${index}`}
                          anchorEl={anchorEl}
                          elevation={1}
                          open={Boolean(anchorEl) && selectedRow === row}
                          onClose={handleMenuClose}
                          MenuListProps={{
                            "aria-labelledby": "basic-button",
                          }}
                        >
                          {dropdownOptions.map((option, index) => (
                            <MenuItem
                              key={option.title}
                              onClick={(e) => handleMenuItemClick(index, e)}
                              className={`flex flex-row items-center ${
                                index === dropdownOptions.length - 1 &&
                                "hover:bg-basic-negative-hover hover:text-basic-negative"
                              }`}
                            >
                              <Image
                                className="mr-4"
                                src={option.img}
                                alt={option.title}
                                width={15}
                                height={15}
                              />
                              <h2 className="text-body-medium">
                                {option.title}
                              </h2>
                            </MenuItem>
                          ))}
                        </Menu>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {emptyRows > 0 && (
                  <TableRow
                    style={{
                      height: 50 * emptyRows,
                    }}
                  >
                    <TableCell colSpan={8} />
                  </TableRow>
                )}
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
            count={totalRows ?? combineClassData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
          <AddCombineClassModal
            open={openAddForm}
            onClose={setOpenAddForm}
            mutate={mutate}
          />
          <DeleteCombineClassModal
            open={openDeleteModal}
            onClose={setOpenDeleteModal}
            combineClassName={selectedRow?.roomSubjectCode ?? "Không xác định"}
            combineClassId={selectedRow?.id ?? 0}
            mutate={mutate}
          />
          <UpdateCombineClassModal
            open={openUpdateModal}
            onClose={setOpenUpdateModal}
            combineClassId={selectedRow?.id ?? 0}
            mutate={mutate}
          />
        </Paper>
      </Box>
    </div>
  );
};

export default CombineClassTable;
