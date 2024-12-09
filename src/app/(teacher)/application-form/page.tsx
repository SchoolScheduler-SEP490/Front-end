"use client";

import React, { useState } from "react";
import { useAppContext } from "@/context/app_provider";
import { useSendApplication } from "./_hooks/useSendApplication";
import {
  REQUEST_TYPE,
  ISendApplication,
  REQUEST_TYPE_TRANSLATOR,
} from "./_libs/constants";
import {
  FormControl,
  TextField,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import TeacherHeader from "@/commons/teacher/header";

export default function ApplicationFormPage() {
  const { schoolId, sessionToken, selectedSchoolYearId } = useAppContext();
  const { loading, submitApplication } = useSendApplication();
  const [formData, setFormData] = useState<ISendApplication>({
    "teacher-id": 0,
    "school-year-id": selectedSchoolYearId,
    "request-type": "",
    "request-description": "",
    "attached-file": "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await submitApplication(schoolId, sessionToken, formData);
      // Reset form after successful submission
      setFormData({
        "teacher-id": 0,
        "school-year-id": selectedSchoolYearId,
        "request-type": "",
        "request-description": "",
        "attached-file": "",
      });
    } catch (error) {
      console.error("Submit error:", error);
    }
  };

  return (
    <div className="w-[84%] h-screen flex flex-col justify-start items-start overflow-y-scroll no-scrollbar">
      <TeacherHeader>
        <h3 className="text-title-small text-white font-semibold tracking-wider">
          Gửi đơn cho Phòng đào tạo
        </h3>
      </TeacherHeader>

      <div className="w-full max-w-2xl mx-auto p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormControl fullWidth>
            <Select
              value={formData["request-type"]}
              onChange={(e) =>
                setFormData({
                  ...formData,
                })
              }
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
            rows={4}
            label="Mô tả chi tiết"
            value={formData["request-description"]}
            onChange={(e) =>
              setFormData({
                ...formData,
                "request-description": e.target.value,
              })
            }
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            fullWidth
          >
            {loading ? "Đang gửi..." : "Gửi đơn"}
          </Button>
        </form>
      </div>
    </div>
  );
}
