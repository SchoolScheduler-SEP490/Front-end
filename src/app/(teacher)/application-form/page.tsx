"use client";

import ContainedButton from "@/commons/button-contained";
import TeacherHeader from "@/commons/teacher/header";
import { useAppContext } from "@/context/app_provider";
import useNotify from "@/hooks/useNotify";
import { useTeacherSelector } from "@/hooks/useReduxStore";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  FormControl,
  FormHelperText,
  IconButton,
  Input,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useSendApplication } from "./_hooks/useSendApplication";
import { ISendApplication } from "./_libs/constants";
import { REQUEST_TYPE, REQUEST_TYPE_TRANSLATOR } from "../_utils/constants";

export default function ApplicationFormPage() {
  const { sessionToken, selectedSchoolYearId } = useAppContext();
  const { loading, submitApplication } = useSendApplication();
  const { teacherInfo } = useTeacherSelector((state) => state.teacher);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string>("");
  const [fileError, setFileError] = useState<string>("");
  const MAX_FILE_SIZE = 1 * 1024 * 1024;

  const [formData, setFormData] = useState<ISendApplication>({
    "teacher-id": teacherInfo?.id || 0,
    "school-year-id": selectedSchoolYearId,
    "request-type": "",
    "request-description": "",
    "attached-file": "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherInfo?.id) {
      useNotify({
        type: "error",
        message: "Teacher ID not found",
      });
      return;
    }

    try {
      await submitApplication(sessionToken, {
        ...formData,
        "teacher-id": teacherInfo.id,
      });

      setFormData({
        "teacher-id": teacherInfo.id,
        "school-year-id": selectedSchoolYearId,
        "request-type": "",
        "request-description": "",
        "attached-file": "",
      });
      setFileName("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Submit error:", error);
    }
  };

  useEffect(() => {
    if (teacherInfo?.id) {
      setFormData((prev) => ({
        ...prev,
        "teacher-id": teacherInfo.id,
      }));
    }
  }, [teacherInfo]);

  const validateFile = (file: File): boolean => {
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    
    if (file.size > MAX_FILE_SIZE) {
      setFileError("File không được vượt quá 1MB");
      return false;
    }
    
    if (fileExtension !== 'docx') {
      setFileError("Chỉ chấp nhận file định dạng .docx");
      return false;
    }
    
    setFileError("");
    return true;
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      if (fileExtension !== 'docx') {
        setFileError("Chỉ chấp nhận file định dạng .docx");
        setFileName(file.name);
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        setFileError("File không được vượt quá 1MB");
        setFileName(file.name);
        return;
      }
      setFileError("");
      const base64 = await convertFileToBase64(file);
      setFileName(file.name);
      setFormData({
        ...formData,
        "attached-file": base64,
      });
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  
    const file = e.dataTransfer.files[0];
    if (file) {
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      if (fileExtension !== 'docx') {
        setFileError("Chỉ chấp nhận file định dạng .docx. Vui lòng thử lại!");
        setFileName(file.name);
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        setFileError("File không được vượt quá 1MB");
        setFileName(file.name);
        return;
      }
      setFileError("");
      const base64 = await convertFileToBase64(file);
      setFileName(file.name);
      setFormData({
        ...formData,
        "attached-file": base64,
      });
    }
  };

  const handleRemoveFile = () => {
    setFileName("");
    setFileError("");
    setFormData({
      ...formData,
      "attached-file": "",
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-[84%] h-screen flex flex-col justify-start items-start overflow-y-scroll no-scrollbar">
      <TeacherHeader>
        <h3 className="text-title-small text-white font-semibold tracking-wider">
          Gửi đơn cho Quản lý trường
        </h3>
      </TeacherHeader>

      <div className="w-full max-w-2xl mx-auto p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormControl fullWidth>
            <InputLabel>Chọn loại đơn</InputLabel>
            <Select
              value={formData["request-type"]}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  "request-type": e.target.value,
                })
              }
              label="Chọn loại đơn"
            >
              {REQUEST_TYPE.map((type) => (
                <MenuItem key={type.key} value={type.key}>
                  {REQUEST_TYPE_TRANSLATOR[type.value]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            multiline
            rows={7}
            label="Lý do"
            value={formData["request-description"]}
            onChange={(e) =>
              setFormData({
                ...formData,
                "request-description": e.target.value,
              })
            }
            spellCheck="false"
            lang="vi"
          />

          <FormControl fullWidth>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Tệp đính kèm
            </Typography>
            <Box
              sx={{
                border: "1px dashed",
                borderColor: isDragging ? "primary.main" : "#ccc",
                borderRadius: 1,
                p: 2,
                cursor: "pointer",
                bgcolor: isDragging ? "rgba(0, 0, 0, 0.04)" : "transparent",
                "&:hover": {
                  borderColor: fileError ? "error.main" : "primary.main",
                  bgcolor: "rgba(0, 0, 0, 0.04)",
                },
              }}
              onClick={() => !fileName && fileInputRef.current?.click()}
              onDragEnter={handleDragEnter}
              onDragOver={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="flex items-center justify-center gap-2">
                <AttachFileIcon color="primary" />
                <Typography>
                  {fileName ? (
                    <div className="flex items-center gap-2">
                      <span>{fileName}</span>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFile();
                        }}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </div>
                  ) : (
                    "Chọn file hoặc kéo thả vào đây"
                  )}
                  {fileError && (
                    <div className="text-red-500 text-sm mt-1">{fileError}</div>
                  )}
                </Typography>
              </div>
              <Input
                type="file"
                inputRef={fileInputRef}
                onChange={handleFileChange}
                sx={{ display: "none" }}
                inputProps={{
                  accept: ".docx",
                }}
              />
            </Box>
            <FormHelperText>Định dạng hỗ trợ: docx (Tối đa 1MB)</FormHelperText>
          </FormControl>

          <div className="flex justify-end mt-6">
            <ContainedButton
              title="Gửi đơn"
              disableRipple
              type="submit"
              disabled={!!fileError}
              styles="bg-primary-300 text-white !py-1 px-4"
            />
          </div>
        </form>
      </div>
    </div>
  );
}
