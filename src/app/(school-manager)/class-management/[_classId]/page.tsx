"use client";

import { useAppContext } from "@/context/app_provider";
import { useEffect, useState } from "react";
import SMHeader from "@/commons/school_manager/header";
import { useRouter, useSearchParams } from "next/navigation";
import { IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { IClassDetail, ISchoolYear } from "../_libs/constants";
import { CLASSGROUP_TRANSLATOR } from "@/utils/constants";

export default function ClassDetails() {
  const [classData, setClassData] = useState<IClassDetail>();
  const [schoolYear, setSchoolYear] = useState<ISchoolYear>();
  const { sessionToken, selectedSchoolYearId, schoolId } = useAppContext();
  const api = process.env.NEXT_PUBLIC_API_URL;
  const searchParams = useSearchParams();
  const classId = searchParams.get("id")
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
      }
    };

    if (sessionToken && classId) {
      fetchData();
    }
  }, [classId, sessionToken, api]);
  

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
            <h2 className="text-title-medium font-semibold tracking-wider leading-loose">
              Thông tin chung
            </h2>

            <div className="grid grid-cols-2 gap-6 mb-6 leading-loose">
              <div>
                <p><strong>Tên lớp:</strong> {classData.name}</p>
                <p><strong>Khối:</strong> {CLASSGROUP_TRANSLATOR[classData.grade]}</p>
                <p><strong>Số tiết học:</strong> {classData["period-count"]}</p>
              </div>
              <div>
                <p><strong>GVCN:</strong> {classData["homeroom-teacher-name"]}</p>
                <p><strong>Mã GVCN:</strong> {classData["homeroom-teacher-abbreviation"]}</p>
                <p><strong>Ca học:</strong> {classData["main-session-text"]}</p>
              </div>
            </div>

            <h2 className="text-title-medium font-semibold tracking-wider leading-loose">
              Thông tin học tập
            </h2>

            <div className="grid grid-cols-2 gap-6 mb-6 leading-loose">
              <div>
                <p><strong>Tổ bộ môn:</strong> {classData["subject-group-name"]}</p>
                <p><strong>Học cả ngày:</strong> {classData["is-full-day"] ? "Có" : "Không"}</p>
                <p><strong>Năm học:</strong> {schoolYear ? `${schoolYear["start-year"]} - ${schoolYear["end-year"]}` : ''}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}