'use client';

import { useAppContext } from "@/context/app_provider";
import { useEffect, useState } from "react";
import { ITeacherDetail } from "../_libs/constants";
import SMHeader from "@/commons/school_manager/header";
import { useRouter, useSearchParams } from "next/navigation";
import { IconButton } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function TeacherDetails() {
  const [teacherData, setTeacherData] = useState<ITeacherDetail>();
  const { sessionToken, schoolId } = useAppContext();
  const api = process.env.NEXT_PUBLIC_API_URL;
  const searchParams = useSearchParams();
  const teacherId = searchParams.get('id');
  const router = useRouter();

  useEffect(() => {
    const fetchTeacherDetails = async () => {      
      const response = await fetch(`${api}/api/schools/${schoolId}/teachers/${teacherId}`, {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      });
      const data = await response.json();      
      if (data.status === 200) {
        setTeacherData(data.result);
      }
    };
  
    if (sessionToken && teacherId) {
      fetchTeacherDetails();
    }
  }, [teacherId, sessionToken, api]);
  
  const handleBack = () => {
    router.push('/teacher-management');
  };

  return (
    <div className="w-[84%] h-screen flex flex-col justify-start items-start overflow-y-scroll no-scrollbar">
      <SMHeader>
        <div className="flex items-center gap-4">
          <IconButton onClick={handleBack} sx={{ color: 'white' }}>
            <ArrowBackIcon />
          </IconButton>
          <h3 className="text-title-small text-white font-semibold tracking-wider">
            Thông tin giáo viên
          </h3>
        </div>
      </SMHeader>
      
      <div className="w-full p-7">
        {teacherData && (
          <div>
            <h2 className="text-title-medium font-semibold tracking-wider leading-loose">
              Thông tin chung
            </h2>
            
            <div className="grid grid-cols-2 gap-6 mb-6 leading-loose">
              <div>
                <p><strong>Họ:</strong> {teacherData["first-name"]}</p>
                <p><strong>Giới tính:</strong> {teacherData.gender}</p>
                <p><strong>Email:</strong> {teacherData.email}</p>
              </div>
              <div>
                <p><strong>Tên:</strong> {teacherData["last-name"]}</p>
                <p><strong>Ngày sinh:</strong> {teacherData["date-of-birth"]}</p>
                <p><strong>Số điện thoại:</strong> {teacherData.phone}</p>
              </div>
            </div>

            <h2 className="text-title-medium font-semibold tracking-wider leading-loose">
              Thông tin giảng dạy
            </h2>
  
            <div className="grid grid-cols-2 gap-6 mb-6 leading-loose">
              <div>
                <p><strong>Tên viết tắt:</strong> {teacherData.abbreviation}</p>
                <p><strong>Dạy môn:</strong> {teacherData["teachable-subjects"].map(subject => subject["subject-name"]).join(" - ")}</p>
              </div>
              <div>
                <p><strong>Vai trò:</strong> {teacherData["teacher-role"] === "Role1" ? "Giáo viên" : "Trưởng bộ môn"}</p>
                <p><strong>Tổ bộ môn:</strong> {teacherData["department-name"]}</p>
                <p><strong>Trạng thái:</strong> {teacherData.status === 1 ? "Hoạt động" : "Vô hiệu"}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );  
}
