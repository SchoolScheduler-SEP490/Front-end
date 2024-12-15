import React, { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Typography,
  IconButton,
  Button,
  Tooltip,
} from "@mui/material";
import * as XLSX from "xlsx";
import CloseIcon from "@mui/icons-material/Close";
import ContainedButton from "@/commons/button-contained";
import { useAppContext } from "@/context/app_provider";
import DownloadIcon from "@mui/icons-material/Download";
import Image from "next/image";
import useNotify from "@/hooks/useNotify";
import {
  TEACHER_GENDER_REVERSED,
  TEACHER_GENDER_TRANSLATOR_REVERSED,
  TEACHER_ROLE_REVERSED,
  TEACHER_ROLE_TRANSLATOR,
  TEACHER_ROLE_TRANSLATOR_REVERSED,
  TEACHER_STATUS_REVERSED,
  TEACHER_STATUS_TRANSLATOR,
  TEACHER_STATUS_TRANSLATOR_REVERSED,
} from "@/utils/constants";
import useAddTeacher from "../_hooks/useAddTeacher";
import {
  IAddTeacherData,
  IDepartment,
  ITeacherTableData as ITeachers,
} from "../_libs/constants";
import dayjs from "dayjs";
import { getDepartmentName } from "../_libs/apiTeacher";

interface ITeacherTableData {
  "full-name": string;
  abbreviation: string;
  email: string;
  gender: string;
  "department-code": string;
  "date-of-birth": string;
  "teacher-role": string;
  status: number;
  phone: string;
}

interface HeadCell {
  id: keyof ITeacherTableData;
  label: string;
  centered: boolean;
}

interface ValidateCell {
  id: keyof ITeacherTableData;
  error: string;
}

const sampleData = [
  {
    Ho_Va_Ten: "Nguyễn Văn A",
    Ma_GV: "GV001",
    Email: "vana@gmail.com",
    Gioi_Tinh: "Nam",
    Ma_TBM: "TBM001",
    Ngay_Sinh: "23/11/1995",
    Vai_Tro: TEACHER_ROLE_TRANSLATOR[1],
    Trang_Thai: TEACHER_STATUS_TRANSLATOR[1],
    SDT: "0389142666",
  },
  {
    Ho_Va_Ten: "Nguyễn Thị B",
    Ma_GV: "GV002",
    Email: "thib@gmail.com",
    Gioi_Tinh: "Nữ",
    Ma_TBM: "TBM002",
    Ngay_Sinh: "23/11/1995",
    Vai_Tro: TEACHER_ROLE_TRANSLATOR[2],
    Trang_Thai: TEACHER_STATUS_TRANSLATOR[2],
    SDT: "0389142367",
  },
];

const headCells: readonly HeadCell[] = [
  { id: "full-name", label: "Họ Và Tên", centered: false },
  { id: "email", label: "Email", centered: false },
  { id: "abbreviation", label: "Mã Giáo Viên", centered: false },
  { id: "gender", label: "Giới Tính", centered: false },
  { id: "department-code", label: "Mã TBM", centered: false },
  { id: "date-of-birth", label: "Ngày Sinh", centered: false },
  { id: "teacher-role", label: "Vai Trò", centered: false },
  { id: "status", label: "Trạng Thái", centered: false },
  { id: "phone", label: "SDT", centered: false },
];

const columnMapping: Record<keyof ITeacherTableData, string> = {
  "full-name": "Ho_Va_Ten",
  abbreviation: "Ma_GV",
  email: "Email",
  gender: "Gioi_Tinh",
  "department-code": "Ma_TBM",
  "date-of-birth": "Ngay_Sinh",
  "teacher-role": "Vai_Tro",
  status: "Trang_Thai",
  phone: "SDT",
};

interface ImportTeacherSelectModalProps {
  open: boolean;
  onClose: (close: boolean) => void;
  mutate: any;
  existedTeachers: ITeachers[];
}

function convertDateFormat(dateString: string) {
  const [day, month, year] = dateString.split(/[-/]/);

  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

const ImportTeacherSelectModal: React.FC<ImportTeacherSelectModalProps> = ({
  open,
  onClose,
  mutate,
  existedTeachers,
}) => {
  const { schoolId, sessionToken, selectedSchoolYearId } = useAppContext();
  const [data, setData] = useState<ITeacherTableData[]>([]);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [duplicateRows, setDuplicateRows] = useState<number[]>([]);
  const [errorRows, setErrorRows] = useState<number[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [departmentCodes, setDepartmentsCodes] = React.useState<string[]>([]);
  const [rowErrors, setRowErrors] = useState<Record<number, ValidateCell[]>>(
    {}
  );
  const [existedTeachersData, setExistedTeacher] = useState<ITeachers[]>([]);

  useEffect(() => {
    setExistedTeacher(existedTeachers);
  }, [existedTeachers]);

  React.useEffect(() => {
    const loadDepartments = async () => {
      const data = await getDepartmentName(schoolId, sessionToken);
      if (data.result?.items) {
        setDepartmentsCodes(
          data.result.items.map((d: IDepartment) =>
            d["department-code"].trim().toLowerCase()
          )
        );
      }
    };
    loadDepartments();
  }, []);

  useEffect(() => {
    validateTable(data);
  }, [data, departmentCodes]);

  const validateTable = (data: ITeacherTableData[]) => {
    const newRowErrors: Record<number, ValidateCell[]> = {};

    data.forEach((row, rowIndex) => {
      const errors = validateRow(row);
      if (errors.length > 0) {
        newRowErrors[rowIndex] = errors;
      }
    });

    setRowErrors(newRowErrors);
  };

  const validateRow = (row: ITeacherTableData): ValidateCell[] => {
    const errors: ValidateCell[] = [];
    if (!row["full-name"] || row["full-name"].trim() === "")
      errors.push({ id: "full-name", error: "Họ và tên không được để trống." });
    else if (row["full-name"].trim().split(" ").length < 2)
      errors.push({ id: "full-name", error: "Họ và tên không hợp lệ." });
    if (!row.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email))
      errors.push({ id: "email", error: "Email không hợp lệ." });
    else if (
      existedTeachersData
        .map((t) => t.email.toLowerCase())
        .includes(row.email.trim().toLowerCase())
    ) {
      errors.push({ id: "email", error: "Email đã tồn tại." });
    }
    if (!row.phone || !/^\d{10}$/.test(row.phone))
      errors.push({ id: "phone", error: "Số điện thoại phải 10 chữ số." });
    else if (
      existedTeachersData.map((t) => t.phoneNumber).includes(row.phone.trim())
    ) {
      errors.push({ id: "phone", error: "Số điện thoại đã tồn tại." });
    }
    if (
      !TEACHER_ROLE_TRANSLATOR_REVERSED[
        row["teacher-role"].trim().toLowerCase()
      ]
    )
      errors.push({ id: "teacher-role", error: "Vai trò không hợp lệ." });
    if (!TEACHER_STATUS_TRANSLATOR[row["status"]])
      errors.push({ id: "status", error: "Trạng thái không hợp lệ." });
    if (!row["department-code"] || row["department-code"].trim() === "")
      errors.push({
        id: "department-code",
        error: "Mã TBM không được để trống.",
      });
    else if (
      !departmentCodes.includes(row["department-code"].trim().toLowerCase())
    ) {
      errors.push({
        id: "department-code",
        error: "Mã TBM không tồn tại.",
      });
    }
    if (!TEACHER_GENDER_TRANSLATOR_REVERSED[row["gender"].trim().toLowerCase()])
      errors.push({
        id: "gender",
        error: "Giới tính không hợp lệ.",
      });
    return errors;
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setData([]);
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: "array" });
      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];
      const jsonData: any[][] = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
      });

      if (jsonData.length > 0) {
        const excelHeaders = jsonData[0];
        const dataRows = jsonData
          .slice(1)
          .filter((row) =>
            row.some((cell) => cell !== undefined && cell !== null)
          );

        const missingHeaders = Object.values(columnMapping).filter(
          (header) => !excelHeaders.includes(header)
        );
        if (missingHeaders.length > 0) {
          setError(`Dữ liệu không đúng định dạng mẫu. Vui lòng kiểm tra lại.`);
          return;
        }

        if (dataRows.length === 0) {
          setError("Dữ liệu không đúng định dạng mẫu. Vui lòng kiểm tra lại.");
          return;
        }

        const mappedData: ITeacherTableData[] = dataRows.map((row) => {
          const rowData: Partial<ITeacherTableData> = {};
          headCells.forEach((cell) => {
            const excelHeader = columnMapping[cell.id];
            const excelIndex = excelHeaders.indexOf(excelHeader);
            if (excelIndex !== -1) {
              let cellValue = row[excelIndex];

              rowData[cell.id] = cellValue;
              if (cell.id === "status") {
                rowData[cell.id] =
                  TEACHER_STATUS_TRANSLATOR_REVERSED[
                    cellValue.trim().toLowerCase()
                  ];
              }
            }
          });
          return rowData as ITeacherTableData;
        });

        const emails = mappedData.map((row) => row.email);

        const phones = mappedData.map((row) => row.phone);

        const emailsDuplicates = emails
          .map((code, index) => {
            return emails.indexOf(code) !== index ? index : -1;
          })
          .filter((index) => index !== -1);

        const phonesDuplicates = phones
          .map((code, index) => {
            return phones.indexOf(code) !== index ? index : -1;
          })
          .filter((index) => index !== -1);

        setDuplicateRows(
          Array.from(new Set([...emailsDuplicates, ...phonesDuplicates]))
        );
        setData(mappedData);
        setSelectedRows(mappedData.map((_, index) => index));
        if (emailsDuplicates.length > 0 || phonesDuplicates.length > 0) {
          useNotify({
            message:
              "Có trùng lặp email hoặc số điện thoại. Vui lòng kiểm tra lại.",
            type: "error",
          });
        }
        setError(null);
      }
    } catch (error) {
      setError("Dữ liệu không đúng định dạng mẫu. Vui lòng kiểm tra lại.");
      console.error("Error reading file:", error);
    }
  };

  const toggleRowSelection = (rowIndex: number) => {
    setSelectedRows((prev) =>
      prev.includes(rowIndex)
        ? prev.filter((index) => index !== rowIndex)
        : [...prev, rowIndex]
    );
  };

  const handleClose = () => {
    setData([]);
    setSelectedRows([]);
    setDuplicateRows([]);
    setErrorRows([]);
    setError(null);
    onClose(false);
  };

  const handleImport = async () => {
    const filteredData: IAddTeacherData[] = data
      .filter((_, index) => selectedRows.includes(index))
      .map((value) => ({
        "first-name": value["full-name"].split(" ")[0],
        "last-name": value["full-name"].substring(
          value["full-name"].indexOf(" ")
        ),
        abbreviation: value.abbreviation,
        email: value.email,
        gender:
          TEACHER_GENDER_REVERSED[
            TEACHER_GENDER_TRANSLATOR_REVERSED[
              value.gender.trim().toLowerCase()
            ]
          ],
        "department-code": value["department-code"],
        "date-of-birth": convertDateFormat(value["date-of-birth"]),
        "teacher-role":
          TEACHER_ROLE_REVERSED[
            TEACHER_ROLE_TRANSLATOR_REVERSED[
              value["teacher-role"].trim().toLowerCase()
            ]
          ],
        status: TEACHER_STATUS_REVERSED[value["status"]],
        phone: value.phone,
      }));

    const response = await useAddTeacher({
      schoolId: schoolId,
      sessionToken: sessionToken,
      formData: filteredData,
    });
    if (response.status != 200 && response.status != 201) {
      useNotify({
        message: response.message,
        type: "error",
      });
      console.log(response);
      if (response.result != null) {
        const failedNames = response.result.map((item: any) => item.email);
        const failedIndexes = data
          .map((row, index) => (failedNames.includes(row.email) ? index : null))
          .filter((index) => index !== null);

        setErrorRows((prevErrorRows: number[]) => {
          const combinedErrorRows = Array.from(
            new Set([...prevErrorRows, ...failedIndexes])
          );
          return combinedErrorRows;
        });
      }
    } else {
      onClose(false);
      mutate();
    }
  };

  const handleDownloadSample = () => {
    const worksheet = XLSX.utils.json_to_sheet(sampleData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Mẫu Dữ Liệu");
    XLSX.writeFile(workbook, "Mau_Du_Lieu_Giao_Vien.xlsx");
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <div
        id="modal-header"
        className="w-full h-fit flex flex-row justify-between items-center bg-primary-50 p-3"
      >
        <Typography
          variant="h6"
          component="h2"
          className="text-title-medium-strong font-normal opacity-60"
        >
          Nhập dữ liệu giáo viên
        </Typography>
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </div>
      <DialogContent>
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileUpload}
          ref={fileInputRef}
          hidden
        />
        {data.length === 0 && error == null && (
          <div className="h-[50vh] flex flex-col justify-center items-center gap-4">
            <Image
              src="/images/icons/Import.png"
              alt="import-timetable"
              width={100}
              height={100}
              unoptimized={true}
              className="!opacity-60"
            />
            <p className="text-body-small w-[35vw] text-justify opacity-70">
              Hãy tải lên tệp dữ liệu giáo viên từ thiết bị của bạn. Vui lòng
              đảm bảo tệp của bạn được định dạng chính xác theo mẫu chúng tôi
              cung cấp để đảm bảo nhập liệu thành công.
            </p>
            <Button
              variant="outlined"
              color="inherit"
              sx={{
                borderColor: "#175b8e",
                color: "#004e89",
                borderRadius: 0,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: "3px",
              }}
              onClick={handleDownloadSample}
            >
              Tải về tài liệu mẫu
              <DownloadIcon color="inherit" sx={{ fontSize: 17 }} />
            </Button>
          </div>
        )}
        {error && (
          <Typography color="error" variant="body2" className="mb-4">
            {error}
          </Typography>
        )}

        {data.length > 0 && (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  {headCells.map((headCell) => (
                    <TableCell
                      key={headCell.id}
                      align={headCell.centered ? "center" : "left"}
                      sx={{ fontWeight: "bold" }}
                    >
                      {headCell.label}
                    </TableCell>
                  ))}
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    Chọn
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((row, rowIndex) => {
                  const errors = rowErrors[rowIndex] || [];
                  console.log(errors.join(", "));
                  return (
                    <TableRow
                      key={rowIndex}
                      sx={{
                        backgroundColor:
                          duplicateRows.includes(rowIndex) ||
                          errorRows.includes(rowIndex) ||
                          rowErrors[rowIndex]?.length > 0
                            ? "rgba(255, 0, 0, 0.09)"
                            : "inherit",
                      }}
                    >
                      {headCells.map((headCell) => {
                        var error = errors.find((v) => v.id == headCell.id);
                        return (
                          <Tooltip
                            key={rowIndex}
                            title={error ? error.error : ""}
                            placement="top"
                            arrow
                          >
                            <TableCell
                              key={headCell.id}
                              align={headCell.centered ? "center" : "left"}
                              sx={{
                                cursor: error ? "pointer" : "default",
                                ...(error && { color: "red" }),
                              }}
                            >
                              {headCell.id === "status" ? (
                                <div
                                  className={`w-fit h-fit px-[6%] py-[2%] rounded-[5px] font-semibold text-inherit 
                                                    ${
                                                      row.status === 1
                                                        ? "bg-basic-positive-hover text-basic-positive"
                                                        : row.status === 4 ||
                                                          row.status === 5
                                                        ? "bg-basic-negative-hover text-basic-negative"
                                                        : "bg-basic-gray-hover text-basic-gray"
                                                    }`}
                                  style={{ whiteSpace: "nowrap" }}
                                >
                                  {TEACHER_STATUS_TRANSLATOR[row.status] ??
                                    "N/A"}
                                </div>
                              ) : (
                                row[headCell.id]?.toString() ?? ""
                              )}
                            </TableCell>
                          </Tooltip>
                        );
                      })}
                      <TableCell align="center">
                        <Checkbox
                          checked={selectedRows.includes(rowIndex)}
                          onChange={() => toggleRowSelection(rowIndex)}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>
      <div className="w-full flex flex-row justify-end items-center gap-2 bg-basic-gray-hover p-3">
        <ContainedButton
          title="tải lên tài liệu"
          disableRipple
          type="submit"
          styles="bg-primary-300 text-white !py-1 px-4"
          onClick={() => fileInputRef.current?.click()}
        />
        <ContainedButton
          title="Nhập Giáo Viên"
          disableRipple
          disabled={
            selectedRows.length === 0 ||
            selectedRows.some(
              (row) =>
                duplicateRows.includes(row) ||
                errorRows.includes(row) ||
                Object.keys(rowErrors)
                  .map(Number)
                  .filter((rowIndex) => rowErrors[rowIndex]?.length > 0)
                  .includes(row)
            )
          }
          type="submit"
          styles="bg-primary-300 text-white !py-1 px-4"
          onClick={handleImport}
        />
        <ContainedButton
          title="Huỷ"
          onClick={handleClose}
          disableRipple
          styles="!bg-basic-gray-active !text-basic-gray !py-1 px-4"
        />
      </div>
    </Dialog>
  );
};

export default ImportTeacherSelectModal;
