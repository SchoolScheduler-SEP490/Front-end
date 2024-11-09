"use client";

import { useAppContext } from "@/context/app_provider";
import { useEffect, useState } from "react";
import SMHeader from "@/commons/school_manager/header";
import { useRouter, useSearchParams } from "next/navigation";
import { IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { IClassDetail, ISchoolYear, ISubjectAssignment } from "../_libs/constants";
import { CLASSGROUP_TRANSLATOR } from "@/utils/constants";
import { getTeacherAssignment } from "../_libs/apiClass";

export default function ClassDetails() {
  const [classData, setClassData] = useState<IClassDetail>();
  const [schoolYear, setSchoolYear] = useState<ISchoolYear>();
  const [subjectAssignments, setSubjectAssignments] = useState<ISubjectAssignment[]>([]);
  const { sessionToken, selectedSchoolYearId, schoolId } = useAppContext();
  const api = process.env.NEXT_PUBLIC_API_URL;
  const searchParams = useSearchParams();
  const classId = searchParams.get("id");
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const classResponse = await fetch(`${api}/api/schools/${schoolId}/academic-years/${selectedSchoolYearId}/classes/${classId}`, {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      });
      const classData = await classResponse.json();
      
      if (classData.status === 200) {
        setClassData(classData.result);
        const schoolYearsResponse = await fetch(`${api}/api/academic-years`, {
          headers: {
            Authorization: `Bearer ${sessionToken}`,
          },
        });
        const schoolYearsData = await schoolYearsResponse.json();
        
        if (schoolYearsData.status === 200) {
          const matchingSchoolYear = schoolYearsData.result.find(
            (year: ISchoolYear) => year.id === classData.result["school-year-id"]
          );
          if (matchingSchoolYear) {
            setSchoolYear(matchingSchoolYear);
          }
        }

        // Fetch teacher assignments
        const assignmentsData = await getTeacherAssignment(Number(classId), sessionToken, schoolId, selectedSchoolYearId);
        if (assignmentsData.status === 200) {
          setSubjectAssignments(assignmentsData.result);
        }
      }
    };

    if (sessionToken && classId) {
      fetchData();
    }
  }, [classId, sessionToken, api, schoolId, selectedSchoolYearId]);

  const handleBack = () => {
    router.push("/class-management");
  };

  return (
    <div className="w-[84%] h-screen flex flex-col justify-start items-start overflow-y-scroll no-scrollbar">
      <SMHeader>
        <div className="flex items-center gap-4">
          <IconButton onClick={handleBack} sx={{ color: "white" }}>
            <ArrowBackIcon />
          </IconButton>
          <h3 className="text-title-small text-white font-semibold tracking-wider">
            Thông tin lớp học
          </h3>
        </div>
      </SMHeader>

      <div className="w-full p-7">
        {classData && (
          <div>
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">
              Thông tin chung
            </h2>
  
            <div className="grid grid-cols-2 gap-6 mb-8 leading-loose">
              <div className="text-gray-700">
                <p><strong>Tên lớp:</strong> {classData.name}</p>
                <p><strong>Khối:</strong> {CLASSGROUP_TRANSLATOR[classData.grade]}</p>
                <p><strong>Số tiết học:</strong> {classData["period-count"]}</p>
              </div>
              <div className="text-gray-700">
                <p><strong>GVCN:</strong> {classData["homeroom-teacher-name"]}</p>
                <p><strong>Mã GVCN:</strong> {classData["homeroom-teacher-abbreviation"]}</p>
                <p><strong>Ca học:</strong> {classData["main-session-text"]}</p>
              </div>
            </div>
  
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">
              Thông tin học tập
            </h2>
  
            <div className="grid grid-cols-2 gap-6 mb-8 leading-loose">
              <div className="text-gray-700">
                <p><strong>Tổ bộ môn:</strong> {classData["subject-group-name"]}</p>
                <p><strong>Học cả ngày:</strong> {classData["is-full-day"] ? "Có" : "Không"}</p>
                <p><strong>Năm học:</strong> {schoolYear ? `${schoolYear["start-year"]} - ${schoolYear["end-year"]}` : ''}</p>
              </div>
            </div>
  
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">
              Phân công giáo viên
            </h2>
  
            <div className="grid grid-cols-2 gap-6 mb-8 leading-loose">
              {subjectAssignments.map((subject) => (
                <div key={subject["subject-id"]} className="bg-gray-50 p-4 rounded-lg border">
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">
                    Môn học: {subject["subject-name"]}
                  </h3>
                  {subject["assignment-details"].map((assignment) => (
                    <div key={assignment["term-id"]} className="mb-4 text-gray-700">
                      <p><strong>Kỳ học:</strong> {assignment["term-name"]}</p>
                      <p><strong>Giáo viên:</strong> {assignment["teacher-first-name"]} {assignment["teacher-last-name"]}</p>
                      <p><strong>Tổng số tiết:</strong> {assignment["total-period"]}</p>
                      <p><strong>Tuần bắt đầu:</strong> {assignment["start-week"]}</p>
                      <p><strong>Tuần kết thúc:</strong> {assignment["end-week"]}</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );  
}