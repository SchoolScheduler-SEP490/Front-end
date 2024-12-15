"use client";

import { useAppContext } from "@/context/app_provider";
import useNotify from "@/hooks/useNotify";
import {
  IScheduleResponse,
  SCHEDULE_STATUS,
  SCHEDULE_STATUS_TRANSLATOR,
} from "@/utils/constants";
import { firestore } from "@/utils/firebaseConfig";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import { Chip, Menu, MenuItem } from "@mui/material";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import { alpha } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import { visuallyHidden } from "@mui/utils";
import dayjs from "dayjs";
import {
  doc,
  getDoc,
  updateDoc
} from "firebase/firestore";
import Image from "next/image";
import { useRouter } from "next/navigation";
import * as React from "react";
import { KeyedMutator } from "swr";
import {
  getTerms,
  publishTimetable,
  updateTimetableStatus,
} from "../_libs/apiTimetable";
import {
  ITerm,
  ITimetableTableData,
  IUpdateTimetableStatus,
} from "../_libs/constants";
import ConfirmStatusModal from "./confirm_status_modal";

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
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
    id: "generatedDate",
    centered: true,
    disablePadding: false,
    label: "Ngày tạo",
  },
  {
    id: "appliedWeek",
    centered: true,
    disablePadding: false,
    label: "Tuần áp dụng",
  },
  {
    id: "endedWeek",
    centered: true,
    disablePadding: false,
    label: "Tuần kết thúc",
  },
  {
    id: "status",
    centered: true,
    disablePadding: false,
    label: "Trạng thái",
  },
];

interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof ITimetableTableData
  ) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
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
    (property: keyof ITimetableTableData) =>
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
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
            sx={{ fontWeight: "bold", paddingLeft: "3%" }}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box
                  component="span"
                  sx={[visuallyHidden, { position: "absolute", zIndex: 10 }]}
                >
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
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

interface EnhancedTableToolbarProps {
  numSelected: number;
}

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const { numSelected } = props;
  return (
    <Toolbar
      sx={[
        {
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
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
          Thời khóa biểu{" "}
          <p className="text-body-medium pt-[2px]">(đã chọn {numSelected})</p>
        </h2>
      ) : (
        <h2 className="text-title-medium-strong font-semibold w-full text-left">
          Thời khóa biểu
        </h2>
      )}
      {numSelected > 0 ? (
        <Tooltip title="Xóa">
          <IconButton color="error">
            <DeleteIcon color="error" />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Lọc">
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}

interface TimetableTableProps {
  data: ITimetableTableData[];
  mutate: KeyedMutator<any>;
}

const TimetableTable = (props: TimetableTableProps) => {
  const { data, mutate } = props;
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] =
    React.useState<keyof ITimetableTableData>("timetableCode");
  const [selected, setSelected] = React.useState<readonly number[]>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const router = useRouter();
  const [confirmModal, setConfirmModal] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedRow, setSelectedRow] =
    React.useState<ITimetableTableData | null>(null);
  const [selectedStatus, setSelectedStatus] = React.useState<number | null>(
    null
  );

  const { schoolId, selectedSchoolYearId, sessionToken } = useAppContext();
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof ITimetableTableData
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = data.map((n) => n.id);
      // setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

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
      [...data]
        // .sort(getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage, data]
  );

  const handleRowClick = (row: ITimetableTableData) => {
    router.push(`/timetable-management/${row.id}`);
  };

  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    row: ITimetableTableData
  ) => {
    event.stopPropagation();
    event.preventDefault();
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    // setSelectedRow(null);
  };

  const handleConfirmClose = () => {
    setConfirmModal(false);
  };

  // Handle initial status selection
  const handleStatusChange = (row: ITimetableTableData, newStatus: number) => {
    console.log("Status Change:", { row, newStatus });
    setSelectedRow(row);
    setSelectedStatus(newStatus);
    handleMenuClose();
    setConfirmModal(true);
  };

  const handleConfirmStatus = async (termId?: number, startWeek?: number, endWeek?: number) => {
    if (!selectedRow || selectedStatus === null) return;
  
    try {
      // For non-publish status updates
      if (selectedStatus !== 3) {
        const statusData: IUpdateTimetableStatus = {
          "term-id": selectedRow.termId,
          "start-week": Number(selectedRow.appliedWeek),
          "end-week": Number(selectedRow.endedWeek),
          "schedule-status": SCHEDULE_STATUS.find((s) => s.value === selectedStatus)?.key || ""
        };
  
        const result = await updateTimetableStatus(
          schoolId,
          selectedSchoolYearId,
          statusData,
          sessionToken
        );
  
        if (result) {
          const timetableRef = doc(firestore, "timetables", selectedRow.id);
          await updateDoc(timetableRef, {
            status: statusData["schedule-status"]
          });
  
          useNotify({
            message: "Cập nhật trạng thái thành công",
            type: "success"
          });
  
          handleConfirmClose();
          mutate();
        }
        return;
      }
  
      // For publish status (status === 3)
      const statusData: IUpdateTimetableStatus = {
        "term-id": termId || selectedRow.termId,
        "start-week": startWeek || Number(selectedRow.appliedWeek),
        "end-week": endWeek || Number(selectedRow.endedWeek),
        "schedule-status": SCHEDULE_STATUS.find((s) => s.value === selectedStatus)?.key || ""
      };
  
      const result = await updateTimetableStatus(
        schoolId,
        selectedSchoolYearId,
        statusData,
        sessionToken
      );
  
      if (result) {
        const scheduleRef = doc(firestore, "schedule-responses", selectedRow.generatedScheduleId);
        const scheduleSnap = await getDoc(scheduleRef);
  
        if (scheduleSnap.exists()) {
          const scheduleData = scheduleSnap.data() as IScheduleResponse;
          const updatedScheduleData = {
            ...scheduleData,
            "term-id": termId || scheduleData["term-id"],
            "start-week": startWeek || scheduleData["start-week"],
            "end-week": endWeek || scheduleData["end-week"]
          };
  
          await publishTimetable(
            schoolId,
            selectedSchoolYearId,
            updatedScheduleData,
            sessionToken
          );
        }
  
        const termsData = await getTerms(sessionToken, selectedSchoolYearId);
        const termsList = termsData.result.items;
        const newTermName = termsList.find((t: ITerm) => t.id === termId)?.name;
  
        const timetableRef = doc(firestore, "timetables", selectedRow.id);
        const updateData = {
          status: statusData["schedule-status"],
          "term-id": termId || selectedRow.termId,
          "applied-week": startWeek?.toString() || selectedRow.appliedWeek,
          "ended-week": endWeek?.toString() || selectedRow.endedWeek,
          "term-name": newTermName || selectedRow.termName
        };
  
        await updateDoc(timetableRef, updateData);
  
        useNotify({
          message: selectedStatus === 3
            ? `Công bố thời khóa biểu ${selectedRow.timetableCode} thành công`
            : "Cập nhật trạng thái thành công",
          type: "success"
        });
  
        handleConfirmClose();
        mutate();
      }
    } catch (error) {
      console.error("Update failed:", error);
    }
  };
  

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <EnhancedTableToolbar numSelected={selected.length} />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size="medium"
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={data.length}
            />
            <TableBody>
              {visibleRows.map((row, index) => {
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    onClick={() => handleRowClick(row)}
                    role="checkbox"
                    tabIndex={-1}
                    key={row.id}
                    sx={{ cursor: "pointer" }}
                  >
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                      align="center"
                    >
                      {row.timetableCode}
                    </TableCell>
                    <TableCell align="left">{row.timetableName}</TableCell>
                    <TableCell align="center">{row.termName}</TableCell>
                    <TableCell align="center">
                      {dayjs(row.generatedDate).format("DD-MM-YYYY HH:mm")}
                    </TableCell>
                    <TableCell align="center">
                      {row.appliedWeek ? `Tuần ${row.appliedWeek}` : "-"}
                    </TableCell>
                    <TableCell align="center">
                      {row.endedWeek ? `Tuần ${row.endedWeek}` : "-"}
                    </TableCell>

                    <TableCell align="center">
                      <Chip
                        label={SCHEDULE_STATUS_TRANSLATOR[row.status]}
                        variant="outlined"
                        color={
                          row.status === 1
                            ? "default"
                            : row.status === 2
                            ? "info"
                            : row.status === 3
                            ? "success"
                            : row.status === 5
                            ? "warning"
                            : "error"
                        }
                        sx={{ fontWeight: 500, minWidth: 100 }}
                      />
                    </TableCell>

                    <TableCell
                      align="center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <IconButton
                        onClick={(e) => handleMenuClick(e, row)}
                        size="small"
                      >
                        <Image
                          src="/images/icons/menu.png"
                          alt="menu"
                          width={20}
                          height={20}
                          unoptimized={true}
                        />
                      </IconButton>
                      <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl) && selectedRow?.id === row.id}
                        onClose={handleMenuClose}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {SCHEDULE_STATUS.map((status) => (
                          <MenuItem
                            key={status.key}
                            onClick={() => {
                              handleStatusChange(row, status.value);
                            }}
                            disabled={
                              (row.status === 3 &&
                                (status.value === 1 || status.value === 2 || status.value === 5)) ||
                              (row.status === 4 &&
                                (status.value === 2 || status.value === 3)) ||
                              (row.status == 1 &&
                                (status.value === 3 ||
                                  status.value === 4 ||
                                  status.value === 5)) ||
                              (row.status == 2 &&
                                (status.value === 1 || status.value === 4 )) ||
                                (row.status == 5 && 
                                  (status.value === 2 || status.value === 3 || status.value === 4))
                                
                            }
                          >
                            <Chip
                              label={SCHEDULE_STATUS_TRANSLATOR[status.value]}
                              variant="outlined"
                              color={
                                status.value === 1
                                  ? "default"
                                  : status.value === 2
                                  ? "info"
                                  : status.value === 3
                                  ? "success"
                                  : status.value === 5
                                  ? "warning"
                                  : "error"
                              }
                              size="small"
                            />
                          </MenuItem>
                        ))}
                      </Menu>
                    </TableCell>
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={6} />
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
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
        <ConfirmStatusModal
          open={confirmModal}
          onClose={handleConfirmClose}
          onConfirm={handleConfirmStatus}
          status={selectedStatus || 0}
          timetableCode={selectedRow?.timetableCode || ""}
          timetableName={selectedRow?.timetableName || ""}
          termId={selectedRow?.termId || 0}
          appliedWeek={selectedRow?.appliedWeek || null}
          endedWeek={selectedRow?.endedWeek || null}
        />
      </Paper>
    </Box>
  );
};

export default TimetableTable;
