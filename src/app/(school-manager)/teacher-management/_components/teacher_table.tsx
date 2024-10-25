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
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import { visuallyHidden } from "@mui/utils";
import { IAddTeacherData, ITeacherTableData } from "../_libs/apiTeacher";
import { useDeleteTeacher } from "../_hooks/useDeleteTeacher";
import DeleteConfirmationModal from "./delete_teacher";
import AddTeacherForm, { TeacherFormData } from "./add_teacher";
import { useAddTeacher } from "../_hooks/useAddTeacher";
import useNotify from "@/hooks/useNotify";
import Image from "next/image";
import AddIcon from "@mui/icons-material/Add";
import { ICommonOption } from "@/utils/constants";
import UpdateTeacherModal from "./update_teacher";
import { mutate } from "swr";

//Teacher's data table
interface TeacherTableProps {
  teachers: ITeacherTableData[];
  fetchTeachers: () => void;
}

const dropdownOptions: ICommonOption[] = [
  { img: "/images/icons/compose.png", title: "Chỉnh sửa thông tin" },
  { img: "/images/icons/delete.png", title: "Xóa giáo viên" },
];

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

const headCells = [
  { id: "id", label: "STT", centered: false },
  { id: "teacherName", label: "Họ và tên", centered: false },
  { id: "nameAbbreviation", label: "Tên viết tắt", centered: false },
  { id: "subjectDepartment", label: "Chuyên môn", centered: false },
  { id: "email", label: "Email", centered: false },
  { id: "phoneNumber", label: "Số điện thoại", centered: false },
  { id: "status", label: "Trạng thái", centered: false },
];

interface EnhancedTableProps {
  numSelected: number;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof ITeacherTableData
  ) => void;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler =
    (property: keyof ITeacherTableData) =>
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
            {headCell.id === "teacherName" ? (
              <span>{headCell.label}</span>
            ) : (
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : "asc"}
                onClick={createSortHandler(
                  headCell.id as keyof ITeacherTableData
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

interface EnhancedTableToolbarProps {
  numSelected: number;
  onDeleteClick: () => void;
  isDeleting: boolean;
  onAddClick: () => void;
}

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const { numSelected, onDeleteClick, isDeleting, onAddClick } = props;

  return (
    <Toolbar
      sx={[
        {
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
          display: "flex",
          justifyContent: "space-around",
        },
      ]}
    >
      <h2 className="text-title-medium-strong font-semibold w-full text-left flex justify-start items-center gap-1">
        Danh sách giáo viên
      </h2>
      <Tooltip title="Thêm giáo viên">
        <IconButton onClick={onAddClick}>
          <AddIcon />
        </IconButton>
      </Tooltip>
      <div>
        {numSelected > 0 ? (
          <Tooltip title="Delete">
            <IconButton onClick={onDeleteClick} disabled={isDeleting}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title="Filter list">
            <IconButton>
              <FilterListIcon />
            </IconButton>
          </Tooltip>
        )}
      </div>
    </Toolbar>
  );
}

const TeacherTable: React.FC<TeacherTableProps> = ({
  teachers,
  fetchTeachers,
}) => {
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] =
    React.useState<keyof ITeacherTableData>("teacherName");
  const [selected, setSelected] = React.useState<readonly number[]>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [openDeleteModal, setOpenDeleteModal] = React.useState(false);
  const { deleteTeacher, isDeleting } = useDeleteTeacher();
  const { addNewTeacher, isAdding, addError } = useAddTeacher();
  const [openAddForm, setOpenAddForm] = React.useState(false);
  const notify = useNotify;
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [selectedRow, setSelectedRow] = React.useState<number | null>(null);
  const [openUpdateModal, setOpenUpdateModal] = React.useState(false);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof ITeacherTableData
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = teachers.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    row: ITeacherTableData
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row.id);
    console.log("Selected row:", row.id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteTeacher = async () => {
    if (selectedRow !== null) {
      try {
        const isDeleted = await deleteTeacher(selectedRow);
        if (isDeleted) {
          fetchTeachers();
          notify({
            message: `Xóa thông tin giáo viên thành công.`,
            type: "success",
          });
          console.log(
            `Teacher with ID: ${selectedRow} has been deleted successfully.`
          );
        } else {
          notify({
            message: `Xóa thông tin giáo viên thất bại. Vui lòng thử lại!`,
            type: "error",
          });
          console.warn(`Failed to delete teacher with ID: ${selectedRow}.`);
        }
      } catch (error) {
        console.error(`Error deleting teacher with ID: ${selectedRow}`, error);
        notify({
          message: `Lỗi khi xóa giáo viên có ID: ${selectedRow}. Vui lòng thử lại.`,
          type: "error",
        });
      }
    }
    setSelectedRow(null);
    setOpenDeleteModal(false);
  };

  const handleAddTeacher = async (teacherData: TeacherFormData) => {
    const schoolId = 2555;
    const formattedTeacherData: IAddTeacherData = {
      "first-name": teacherData.firstName,
      "last-name": teacherData.lastName,
      abbreviation: teacherData.abbreviation,
      email: teacherData.email,
      gender: teacherData.gender,
      "department-code": teacherData.departmentCode,
      "date-of-birth": teacherData.dateOfBirth,
      "teacher-role": teacherData.teacherRole,
      status: teacherData.status,
      phone: teacherData.phone,
    };

    console.log("Formatted Teacher Data:", formattedTeacherData);

    try {
      const success = await addNewTeacher(schoolId, formattedTeacherData);
      if (success) {
        fetchTeachers();
        setOpenAddForm(false);
        useNotify({
          message: "Thêm giáo viên thành công!",
          type: "success",
        });
      } else {
        useNotify({
          message: "Thêm giáo viên thất bại. Vui lòng thử lại!",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error adding teacher:", error);
      useNotify({
        message: "An unexpected error occurred while adding the teacher.",
        type: "error",
      });
    }
  };

  const handleMenuItemClick = (index: number) => {
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

  const handleOpenDeleteModal = () => setOpenDeleteModal(true);

  const handleCloseDeleteModal = () => setOpenDeleteModal(false);

  const handleOpenAddForm = () => setOpenAddForm(true);

  const handleCloseAddForm = () => setOpenAddForm(false);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const visibleRows = React.useMemo(
    () =>
      [...teachers]
        .sort(getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage, teachers]
  );

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - teachers.length) : 0;

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <EnhancedTableToolbar
          numSelected={selected.length}
          onDeleteClick={handleOpenDeleteModal}
          isDeleting={isDeleting}
          onAddClick={handleOpenAddForm}
        />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size="medium"
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy as string}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={teachers.length}
            />
            <TableBody>
              {visibleRows.map((row, index) => {
                const isItemSelected = selected.includes(row.id);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={row.id}
                    sx={{ cursor: "pointer" }}
                  >
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      align="left"
                    >
                      {index + 1 + page * rowsPerPage}
                    </TableCell>
                    <TableCell align="left">{row.teacherName}</TableCell>
                    <TableCell align="left">{row.nameAbbreviation}</TableCell>
                    <TableCell align="left">{row.subjectDepartment}</TableCell>
                    <TableCell align="left">{row.email}</TableCell>
                    <TableCell align="left">{row.phoneNumber}</TableCell>
                    <TableCell align="left">
                      <div className="w-full h-full flex justify-start">
                        <div
                          className={`w-fit h-fit px-[6%] py-[2%] rounded-[5px] font-semibold 
                            ${
                              row.status === 1
                                ? "bg-basic-negative-hover text-basic-negative"
                                : "bg-basic-positive-hover text-basic-positive"
                            }`}
                          style={{ whiteSpace: "nowrap" }}
                        >
                          {row.status}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell width={80}>
                      <IconButton
                        color="success"
                        sx={{ zIndex: 10 }}
                        id="basic-button"
                        aria-controls={open ? `basic-menu${index}` : undefined}
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
                        open={Boolean(anchorEl) && selectedRow === row.id}
                        onClose={handleMenuClose}
                        MenuListProps={{
                          "aria-labelledby": "basic-button",
                        }}
                      >
                        {dropdownOptions.map((option, index) => (
                          <MenuItem
                            key={option.title}
                            onClick={() => handleMenuItemClick(index)}
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
                            <h2 className="text-body-medium">{option.title}</h2>
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
                    height: 53 * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={teachers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <DeleteConfirmationModal
        open={openDeleteModal}
        onClose={handleCloseDeleteModal}
        onConfirm={handleDeleteTeacher}
        selectedCount={selected.length}
      />
      <AddTeacherForm
        open={openAddForm}
        onClose={handleCloseAddForm}
        onSubmit={handleAddTeacher}
      />
      <UpdateTeacherModal
        open={openUpdateModal}
        onClose={setOpenUpdateModal}
        teacherId={selectedRow || 0}
        mutate={mutate}
      />
    </Box>
  );
};
export default TeacherTable;
