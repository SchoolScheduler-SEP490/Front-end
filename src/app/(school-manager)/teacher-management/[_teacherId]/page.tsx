"use client";

import { useAppContext } from "@/context/app_provider";
import React, { useEffect, useState } from "react";
import { ITeacherDetail } from "../_libs/constants";
import SMHeader from "@/commons/school_manager/header";
import { useRouter, useSearchParams } from "next/navigation";
import { Avatar, Grid, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  TEACHER_GENDER,
  TEACHER_GENDER_TRANSLATOR,
  TEACHER_ROLE,
  TEACHER_ROLE_TRANSLATOR,
  TEACHER_STATUS_TRANSLATOR,
} from "@/utils/constants";
import dayjs from "dayjs";
import UpdateTeacherModal from "../_components/update_teacher";
import ContainedButton from "@/commons/button-contained";
import { Card, CardContent, Typography, Divider } from "@mui/material";
import TeacherSidenav from "./sidenav";

export default function TeacherDetails() {
  const [teacherData, setTeacherData] = useState<ITeacherDetail>();
  const { sessionToken, schoolId } = useAppContext();
  const api = process.env.NEXT_PUBLIC_API_URL;
  const searchParams = useSearchParams();
  const teacherId = searchParams.get("id");
  const router = useRouter();
  const [openUpdateModal, setOpenUpdateModal] = React.useState<boolean>(false);
  const [activeTab, setActiveTab] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTeacherDetails = React.useCallback(async () => {
    setIsLoading(true);
    const response = await fetch(
      `${api}/api/schools/${schoolId}/teachers/${teacherId}`,
      {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      }
    );
    const data = await response.json();
    if (data.status === 200) {
      setTeacherData(data.result);
    }
  }, [api, schoolId, teacherId, sessionToken]);

  useEffect(() => {
    if (sessionToken && teacherId) {
      fetchTeacherDetails();
    }
  }, [teacherId, sessionToken, fetchTeacherDetails]);

  const handleBack = () => {
    router.push("/teacher-management");
  };
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };
  return (
    <div className="w-[84%] h-screen flex flex-col justify-start items-start overflow-y-scroll no-scrollbar">
      <SMHeader>
        <div className="flex items-center gap-4">
          <IconButton onClick={handleBack} sx={{ color: "white" }}>
            <ArrowBackIcon />
          </IconButton>
          <h3 className="text-title-small text-white font-semibold tracking-wider">
            Thông tin giáo viên
          </h3>
        </div>
      </SMHeader>

      {isLoading && teacherData && (
      <div className="flex h-full">
      <TeacherSidenav activeTab={activeTab} handleTabChange={handleTabChange} />
      <div className="flex-1 p-6 overflow-auto">

      <div className="w-full p-7">
        <div className="flex justify-end">
          <ContainedButton
            onClick={() => setOpenUpdateModal(true)}
            title="Chỉnh sửa thông tin"
            styles="bg-primary-300 text-white !py-1 px-4"
          />
        </div>
        <UpdateTeacherModal
          open={openUpdateModal}
          onClose={setOpenUpdateModal}
          teacherId={Number(teacherId)}
          mutate={fetchTeacherDetails}
        />
        {teacherData && (
          <Grid
            container
            spacing={2}
            className="flex justify-evenly mx-auto my-auto"
          >
            <Grid item xs={12} md={5}>
              <Card className="w-fit shadow-md border border-gray-200 rounded-lg">
                <CardContent>
                  <div className="flex items-center mb-6">
                    <Avatar
                      alt={`${teacherData["first-name"]} ${teacherData["last-name"]}`}
                      className="w-16 h-16 mr-4"
                    />
                    <div>
                      <Typography
                        variant="h6"
                        className="text-gray-800 font-semibold"
                      >
                        {teacherData["first-name"]} {teacherData["last-name"]}
                      </Typography>
                      <Typography variant="body2" className="text-gray-500">
                        {
                          TEACHER_ROLE_TRANSLATOR[
                            TEACHER_ROLE.find(
                              (role) => role.key === teacherData["teacher-role"]
                            )?.value || 1
                          ]
                        }
                      </Typography>
                      <Typography variant="body2" className="text-gray-500">
                       Ho Chi Minh City
                      </Typography>
                    </div>
                  </div>

                  <Divider className="my-4" />

                  {/* Personal Information Section */}
                  <Typography
                    variant="h6"
                    className="text-gray-800 font-semibold mb-4"
                  >
                    Thông tin cá nhân
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography
                        variant="body2"
                        className="text-gray-500 mb-4"
                      >
                        <strong className="text-gray-800">Họ:</strong>{" "}
                        {teacherData["first-name"]}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography
                        variant="body2"
                        className="text-gray-500 mb-4"
                      >
                        <strong className="text-gray-800">Tên:</strong>{" "}
                        {teacherData["last-name"]}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography
                        variant="body2"
                        className="text-gray-500 mb-4"
                      >
                        <strong className="text-gray-800">Email:</strong>{" "}
                        {teacherData.email}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography
                        variant="body2"
                        className="text-gray-500 mb-4"
                      >
                        <strong className="text-gray-800">
                          Số điện thoại:
                        </strong>{" "}
                        {teacherData.phone}
                      </Typography>
                    </Grid>

                    <Grid item xs={6}>
                      <Typography
                        variant="body2"
                        className="text-gray-500 mb-4"
                      >
                        <strong className="text-gray-800">
                          Ngày sinh:
                        </strong>{" "}
                        {dayjs(teacherData["date-of-birth"]).format("DD-MM-YYYY")}
                      </Typography>
                    </Grid>

                    <Grid item xs={6}>
                      <Typography
                        variant="body2"
                        className="text-gray-500 mb-4"
                      >
                        <strong className="text-gray-800">Giới tính:</strong>{" "}
                        {
                          TEACHER_GENDER_TRANSLATOR[
                            TEACHER_GENDER.find(
                              (role) => role.key === teacherData.gender
                            )?.value || 1
                          ]
                        }
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography
                        variant="body2"
                        className="text-gray-500 mb-4"
                      >
                        <strong className="text-gray-800">Tên viết tắt:</strong>{" "}
                        {teacherData.abbreviation}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography
                        variant="body2"
                        className="text-gray-500 mb-4"
                      >
                        <strong className="text-gray-800">Trạng thái:</strong>{" "}
                        {
                          TEACHER_STATUS_TRANSLATOR[
                            teacherData.status as keyof typeof TEACHER_STATUS_TRANSLATOR
                          ]
                        }
                      </Typography>
                    </Grid>
                  </Grid>

                  <Divider className="my-4" />

                  <Typography
                    variant="h6"
                    className="text-gray-800 font-semibold mb-4"
                  >
                    Thông tin giảng dạy
                  </Typography>
                  <Grid container spacing={2}>

                  <Grid item xs={6}>
                      <Typography
                        variant="body2"
                        className="text-gray-500 mb-4"
                      >
                        <strong className="text-gray-800">Dạy môn:</strong>{" "}
                        {teacherData["teachable-subjects"]
                    .map((subject) => subject["subject-name"])
                    .join(" - ")}
                      </Typography>
                    </Grid>

                    <Grid item xs={6}>
                      <Typography
                        variant="body2"
                        className="text-gray-500 mb-4"
                      >
                        <strong className="text-gray-800">Tổ bộ môn:</strong>{" "}
                        {teacherData["department-name"]}
                      </Typography>
                    </Grid>

                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </div>
      </div>
      </div>
      )}     
    </div>
  );
}
