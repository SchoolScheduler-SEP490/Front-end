import * as React from "react";
import {
  Box,
  Button,
  Checkbox,
  IconButton,
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
import { alpha } from "@mui/material/styles";
import { visuallyHidden } from "@mui/utils";
import {
  addTeacher,
  IAddTeacherData,
  ITeacherTableData,
} from "../_libs/apiTeacher";
import { useDeleteTeacher } from "../_hooks/useDeleteTeacher";
import DeleteConfirmationModal from "./delete_teacher";
import AddTeacherForm, { TeacherFormData } from "./add_teacher";
import { useAddTeacher } from "../_hooks/useAddTeacher";
import useNotify from "@/hooks/useNotify";
import Image from "next/image";

//Teacher's data table 
interface TeacherTableProps {
  teachers: ITeacherTableData[];
  fetchTeachers: () => void;
}

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
  { id: "teacherCode", label: "STT", centered: false },
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
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all teachers",
            }}
          />
        </TableCell>
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
        numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        },
      ]}
    >
      {numSelected > 0 ? (
        <h2 className="text-title-medium-strong font-semibold w-full text-left flex justify-start items-center gap-1">
          Danh sách giáo viên{" "}
          <p className="text-body-medium pt-[2px]">(đã chọn {numSelected})</p>
        </h2>
      ) : (
        <h2 className="text-title-medium-strong font-semibold w-full text-left">
          Danh sách giáo viên
        </h2>
      )}
      <Button
        variant="outlined"
        color="primary"
        sx={{ whiteSpace: "nowrap" }}
        onClick={onAddClick}
      >
        Thêm giáo viên
      </Button>
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

  const handleClick = (event: React.MouseEvent<unknown>, id: number) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: readonly number[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleDeleteTeacher = async () => {
    console.log(`Selected teachers to delete: ${selected.join(", ")}`);

    for (const id of selected) {
      const isDeleted = await deleteTeacher(id);
      if (isDeleted) {
        fetchTeachers();
        useNotify({
          message: "Xóa dữ liệu của giáo viên thành công!",
          type: "success",
        });
        console.log(`Teacher with ID: ${id} has been deleted successfully.`);
      } else {
        useNotify({
          message: "Xóa giáo viên thất bại. Vui lòng thử lại!",
          type: "error",
        });
        console.warn(`Failed to delete teacher with ID: ${id}.`);
      }
    }

    setSelected([]);
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
                    onClick={(event) => handleClick(event, row.id)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.id}
                    selected={isItemSelected}
                    sx={{ cursor: "pointer" }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        inputProps={{ "aria-labelledby": labelId }}
                      />
                    </TableCell>
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      align="left"
                    >
                      {row.teacherCode}
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
                              row.status === "Hoạt động"
                                ? "bg-basic-positive-hover text-basic-positive"
                                : "bg-basic-negative-hover text-basic-negative"
                            }`}
                          style={{ whiteSpace: "nowrap" }}
                        >
                          {row.status}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell width={80}>
                      <IconButton color="success" sx={{ zIndex: 10 }}>
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
    </Box>
  );
};

export default TeacherTable;

