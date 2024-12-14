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
} from "@mui/material";
import * as XLSX from "xlsx";
import CloseIcon from "@mui/icons-material/Close";
import ContainedButton from "@/commons/button-contained";
import { IAddClassData, IExistingClass, ITeacher } from "../_libs/constants";
import { useAppContext } from "@/context/app_provider";
import { getExistingClasses, getTeacherName } from "../_libs/apiClass";
import useAddClass from "../_hooks/useAddClass";
import DownloadIcon from "@mui/icons-material/Download";
import Image from "next/image";
import useNotify from "@/hooks/useNotify";
import { CLASSGROUP_TRANSLATOR_REVERSED } from "@/utils/constants";

interface IClassTableData {
  className: string;
  grade: number;
  roomCode: string;
  homeroomTeacherCode: string;
  mainSession: string;
  isFullDay: boolean;
}

interface HeadCell {
  id: keyof IClassTableData;
  label: string;
  centered: boolean;
}

const sampleData = [
  {
    Ten_Lop: "10A1",
    Khoi: 10,
    Ma_Phong: "P101",
    Ma_GVCN: "GV001",
    Buoi_Chinh_Khoa: "Buổi sáng",
    Hoc_Ca_Ngay: "Có",
  },
  {
    Ten_Lop: "10A2",
    Khoi: 10,
    Ma_Phong: "P102",
    Ma_GVCN: "GV002",
    Buoi_Chinh_Khoa: "Buổi chiều",
    Hoc_Ca_Ngay: "Không",
  },
];

const headCells: readonly HeadCell[] = [
  { id: "className", label: "Tên lớp", centered: false },
  { id: "grade", label: "Tên khối", centered: true },
  { id: "roomCode", label: "Mã Phòng học", centered: false },
  { id: "homeroomTeacherCode", label: "Mã GVCN", centered: false },
  { id: "mainSession", label: "Buổi chính khóa", centered: true },
  { id: "isFullDay", label: "Học cả ngày", centered: true },
];

const columnMapping: Record<keyof IClassTableData, string> = {
  className: "Ten_Lop",
  grade: "Khoi",
  roomCode: "Ma_Phong",
  homeroomTeacherCode: "Ma_GVCN",
  mainSession: "Buoi_Chinh_Khoa",
  isFullDay: "Hoc_Ca_Ngay",
};

interface ImportClassSelectModalProps {
  open: boolean;
  onClose: (close: boolean) => void;
  mutate: any;
}

const ImportClassSelectModal: React.FC<ImportClassSelectModalProps> = ({
  open,
  onClose,
  mutate,
}) => {
  const { schoolId, sessionToken, selectedSchoolYearId } = useAppContext();
  const [data, setData] = useState<IClassTableData[]>([]);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [duplicateRows, setDuplicateRows] = useState<number[]>([]);
  const [errorRows, setErrorRows] = useState<number[]>([]);
  const [duplicateClassRows, setDuplicateClassRows] = useState<number[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState<string | null>(null);

  const parseBoolean = (value: string | number): boolean => {
    if (typeof value === "string") {
      return value.trim().toLowerCase() === "có";
    }
    if (typeof value === "number") {
      return value === 1;
    }
    return false;
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

        const mappedData: IClassTableData[] = dataRows.map((row) => {
          const rowData: Partial<IClassTableData> = {};
          headCells.forEach((cell) => {
            const excelHeader = columnMapping[cell.id];
            const excelIndex = excelHeaders.indexOf(excelHeader);
            if (excelIndex !== -1) {
              let cellValue = row[excelIndex];
              if (cell.id === "isFullDay") {
                cellValue = parseBoolean(cellValue);
              }
              if (cell.id === "mainSession") {
                if (
                  !["buổi sáng", "buổi chiều"].includes(
                    (cellValue as string).toLowerCase()
                  )
                ) {
                  setError(
                    "Dữ liệu cột Buoi_Chinh_Khoa chứa dữ liệu không hợp lệ. Vui lòng kiểm tra lại."
                  );
                  return;
                }
              }
              rowData[cell.id] = cellValue;
            }
          });
          return rowData as IClassTableData;
        });

        const homeroomTeacherCodes = mappedData.map(
          (row) => row.homeroomTeacherCode
        );
        const duplicates = homeroomTeacherCodes
          .map((code, index) => {
            return homeroomTeacherCodes.indexOf(code) !== index ? index : -1;
          })
          .filter((index) => index !== -1);

        const classNames = mappedData.map((row) => row.className);
        const classDuplicates = classNames
          .map((name, index) => {
            return classNames.indexOf(name) !== index ? index : -1;
          })
          .filter((index) => index !== -1);

        setDuplicateRows(duplicates);
        setDuplicateClassRows(classDuplicates);
        setData(mappedData);
        setSelectedRows(mappedData.map((_, index) => index));
        if (duplicates.length > 0 || classDuplicates.length > 0) {
          useNotify({
            message:
              "Có trùng lặp mã giáo viên chủ nhiệm hoặc tên lớp. Vui lòng kiểm tra lại.",
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
    setDuplicateClassRows([]);
    setErrorRows([]);
    setError(null);
    onClose(false);
  };

  const handleImport = async () => {
    const filteredData: IAddClassData[] = data
      .filter((_, index) => selectedRows.includes(index))
      .map((value) => ({
        name: value.className,
        "homeroom-teacher-abbreviation": value.homeroomTeacherCode,
        "main-session":
          value.mainSession.trim().toLowerCase() == "buổi sáng" ? 1 : 2,
        "is-full-day": value.isFullDay,
        grade: CLASSGROUP_TRANSLATOR_REVERSED[value.grade],
        "room-code": value.roomCode,
      }));
    console.log("Filtered Data:", filteredData);

    const response = await useAddClass({
      schoolId: schoolId,
      sessionToken: sessionToken,
      formData: filteredData,
      schoolYearId: selectedSchoolYearId,
    });
    if (response.status != 200 && response.status != 201) {
      useNotify({
        message: response.message,
        type: "error",
      });
      console.log(response);
      if (response.result != null) {
        const failedClassNames = response.result.map((item: any) => item.name);
        const failedIndexes = data
          .map((row, index) =>
            failedClassNames.includes(row.className) ? index : null
          )
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
    XLSX.writeFile(workbook, "Mau_Du_Lieu_Lop_Hoc.xlsx");
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
          Nhập dữ liệu lớp học
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
              Hãy tải lên tệp dữ liệu lớp học từ thiết bị của bạn. Vui lòng đảm
              bảo tệp của bạn được định dạng chính xác theo mẫu chúng tôi cung
              cấp để đảm bảo nhập liệu thành công.
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
                {data.map((row, rowIndex) => (
                  <TableRow
                    key={rowIndex}
                    sx={{
                      backgroundColor:
                        duplicateRows.includes(rowIndex) ||
                        duplicateClassRows.includes(rowIndex) ||
                        errorRows.includes(rowIndex)
                          ? "rgba(255, 0, 0, 0.2)"
                          : "inherit",
                    }}
                  >
                    {headCells.map((headCell) => (
                      <TableCell
                        key={headCell.id}
                        align={headCell.centered ? "center" : "left"}
                      >
                        {headCell.id === "isFullDay" ? (
                          <Checkbox
                            checked={row[headCell.id] as boolean}
                            disabled
                          />
                        ) : (
                          row[headCell.id]?.toString() ?? ""
                        )}
                      </TableCell>
                    ))}
                    <TableCell align="center">
                      <Checkbox
                        checked={selectedRows.includes(rowIndex)}
                        onChange={() => toggleRowSelection(rowIndex)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
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
          title="Nhập lớp học"
          disableRipple
          disabled={
            selectedRows.length === 0 ||
            selectedRows.some(
              (row) =>
                duplicateClassRows.includes(row) ||
                duplicateRows.includes(row) ||
                errorRows.includes(row)
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

export default ImportClassSelectModal;
