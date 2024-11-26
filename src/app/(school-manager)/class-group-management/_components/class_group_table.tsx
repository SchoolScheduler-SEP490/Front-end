import * as React from "react";
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Paper,
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
import Image from "next/image";
import { visuallyHidden } from "@mui/utils";
import FilterListIcon from "@mui/icons-material/FilterList";
import AddIcon from "@mui/icons-material/Add";
import { KeyedMutator } from "swr";
import { IClassGroupTableData } from "../_libs/constants";
import { ICommonOption } from "@/utils/constants";
import AddClassGroupModal from "./add_class_group";
import DeleteClassGroupModal from "./delete_class_group";
import AssignClassModal from "./assign_class";
import AssignCurriculumModal from "./assign_curriculum";
import UpdateClassGroupModal from "./update_class_group";

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
    centered: false,
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

interface EnhancedTableProps {
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof IClassGroupTableData
  ) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { order, orderBy, rowCount, onRequestSort } = props;
  const createSortHandler =
    (property: keyof IClassGroupTableData) =>
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
            {headCell.id === "groupName" ? (
              <span>{headCell.label}</span>
            ) : (
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : "asc"}
                onClick={createSortHandler(
                  headCell.id as keyof IClassGroupTableData
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

interface IClassGroupTableProps {
  classGroupTableData: IClassGroupTableData[];
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  rowsPerPage: number;
  setRowsPerPage: React.Dispatch<React.SetStateAction<number>>;
  totalRows?: number;
  mutate: KeyedMutator<any>;
  isFilterable: boolean;
  setIsFilterable: React.Dispatch<React.SetStateAction<boolean>>;
  selectedGrade: number | null; 
  selectedClassGroupId: number;
  setSelectedClassGroupId: React.Dispatch<React.SetStateAction<number>>;
  isDetailsShown: boolean;
	setIsDetailsShown: React.Dispatch<React.SetStateAction<boolean>>;
}

const dropdownOptions: ICommonOption[] = [
  { img: "/images/icons/desk.png", title: "Thêm lớp áp dụng" },
  { img: "/images/icons/stack.png", title: "Thêm khung chương trình" },
  { img: "/images/icons/compose.png", title: "Chỉnh sửa thông tin" },
  { img: "/images/icons/delete.png", title: "Xóa nhóm lớp" },
];

const ClassGroupTable = (props: IClassGroupTableProps) => {
  const {
    classGroupTableData,
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
    totalRows,
    mutate,
    isFilterable,
		setIsFilterable,
    selectedGrade, 
    selectedClassGroupId,
    setSelectedClassGroupId,
    isDetailsShown,
    setIsDetailsShown
  } = props;
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] =
    React.useState<keyof IClassGroupTableData>("groupName");
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [openAddForm, setOpenAddForm] = React.useState<boolean>(false);
  const [openDeleteModal, setOpenDeleteModal] = React.useState<boolean>(false);
  const [openUpdateModal, setOpenUpdateModal] = React.useState<boolean>(false);
  const [selectedRow, setSelectedRow] = React.useState<
    IClassGroupTableData | undefined
  >();
  const open = Boolean(anchorEl);
  const [openAssignModal, setOpenAssignModal] = React.useState<boolean>(false);
  const [openCurriculumModal, setOpenCurriculumModal] =
    React.useState<boolean>(false);

  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    row: IClassGroupTableData
  ) => {
    event.preventDefault();
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };

  const handleFilterable = () => {
    setIsFilterable(!isFilterable);
    setIsDetailsShown(false);
    // mutate();
  };

  const handleSelectClassGroup = (row: IClassGroupTableData) => {
    setSelectedClassGroupId(row.id);
    setIsDetailsShown(true);
    setIsFilterable(false);
  }

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof IClassGroupTableData
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
        setOpenAssignModal(true);
        break;
      case 1:
        setOpenCurriculumModal(true);
        break;
      case 2:
        setOpenUpdateModal(true);
        break;
      case 3:
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
    () =>
      [...classGroupTableData].sort(
        (a, b) =>
          getComparator(order, orderBy)(
            { ...a, classes: a.classes.length.toString() },
            { ...b, classes: b.classes.length.toString() }
          ) as number
      ),
    [order, orderBy, page, rowsPerPage, classGroupTableData]
  );

  const emptyRows =
    classGroupTableData.length < rowsPerPage && rowsPerPage < 10
      ? rowsPerPage - classGroupTableData.length + 1
      : 0;

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleOpenAddForm = () => setOpenAddForm(true);

  return (
    <div className="w-[79%] h-fit flex flex-row justify-center items-center gap-6 pt-[2vh]">
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
              <IconButton onClick={handleOpenAddForm}>
                <AddIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Lọc danh sách">
              <IconButton onClick={handleFilterable} >
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
              <EnhancedTableHead
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
                rowCount={classGroupTableData.length}
              />
              <TableBody>
                {visibleRows.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      <h1 className="text-body-large-strong italic text-basic-gray">
                      {selectedGrade !== null 
                      ? `Nhóm lớp chưa có dữ liệu khối ${selectedGrade}`
                      : "Nhóm lớp chưa có dữ liệu"}
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
                        sx={[
                          { cursor: 'pointer' },
                          selectedClassGroupId === row.id &&
                            isDetailsShown && {
                              backgroundColor: '#f5f5f5',
                            },
                        ]}
                        onClick={() => handleSelectClassGroup(row)}
                      >
                        <TableCell
                          component="th"
                          id={labelId}
                          scope="row"
                          align="left"
                        >
                          {index + 1 + page * rowsPerPage}
                        </TableCell>

                        <TableCell>
                            {row.groupName}
                        </TableCell>
                        <TableCell align="left">
                          {row.studentClassGroupCode}
                        </TableCell>
                        <TableCell align="left">{`Khối ${row.grade}`}</TableCell>
                        <TableCell align="left">{row.curriculum}</TableCell>
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
                                  unoptimized={true}
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
            count={totalRows ?? classGroupTableData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
          <AddClassGroupModal
            open={openAddForm}
            onClose={setOpenAddForm}
            mutate={mutate}
          />
          <DeleteClassGroupModal
            open={openDeleteModal}
            onClose={setOpenDeleteModal}
            classGroupName={selectedRow?.groupName ?? "Không xác định"}
            classGroupId={selectedRow?.id ?? 0}
            mutate={mutate}
          />
          <AssignClassModal
            open={openAssignModal}
            onClose={() => setOpenAssignModal(false)}
            classGroupId={selectedRow?.id || 0}
            mutate={mutate}
          />
          <AssignCurriculumModal
            open={openCurriculumModal}
            onClose={() => setOpenCurriculumModal(false)}
            classGroupId={selectedRow?.id || 0}
            mutate={mutate}
          />
          <UpdateClassGroupModal
            open={openUpdateModal}
            onClose={setOpenUpdateModal}
            classGroupId={selectedRow?.id ?? 0}
            mutate={mutate}
          />
        </Paper>
      </Box>
    </div>
  );
};
export default ClassGroupTable;
