"use client";

import * as React from "react";
import SMHeader from "@/commons/school_manager/header";
import TeacherTable from "./_components/teacher_table";
import useTeacherData from "./_hooks/useTeacherData";
import TeacherTableSkeleton from "./_components/table_skeleton";
import { useAppContext } from "@/context/app_provider";
import { ITeacher, ITeacherTableData } from "./_libs/contants";
import useNotify from "@/hooks/useNotify";

export default function SMTeacher() {
  const [page, setPage] = React.useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(5);
  const { schoolId, sessionToken } = useAppContext();

  const { data, error, isValidating, mutate } = useTeacherData({
    sessionToken,
    schoolId,
    pageSize: rowsPerPage,
    pageIndex: page + 1,
  });

  const [totalRows, setTotalRows] = React.useState<number | undefined>(
    undefined
  );
  const [teacherTableData, setTeacherTableData] = React.useState<
    ITeacherTableData[]
  >([]);

  const getMaxPage = () => {
    if (totalRows === 0) return 1;
    return totalRows ? Math.ceil(totalRows / rowsPerPage) : 1;
  };

  React.useEffect(() => {
    mutate();
    if (data?.status === 200) {
      setTotalRows(data.result["total-item-count"]);
      const teacherData: ITeacherTableData[] = data.result.items.map(
        (item: ITeacher) => ({
          id: item.id,
          teacherName: `${item["first-name"]} ${item["last-name"]}`,
          nameAbbreviation: item.abbreviation,
          subjectDepartment: item["department-name"],
          email: item.email,
          phoneNumber: item.phone || "N/A",
          status: item.status === 1 ? "Hoạt động" : "Vô hiệu",
        })
      );
      setTeacherTableData(teacherData);
    }
  }, [data]);

  React.useEffect(() => {
    setPage((prev) => Math.min(prev, getMaxPage() - 1));
    if (page <= getMaxPage()) {
      mutate();
    }
  }, [page, rowsPerPage]);

  if (isValidating) {
    return (
      <div className="w-[84%] h-screen flex flex-col justify-start items-start overflow-y-scroll no-scrollbar">
        <SMHeader>
          <div>
            <h3 className="text-title-small text-white font-semibold tracking-wider">
              Môn học
            </h3>
          </div>
        </SMHeader>
        <div className="w-full h-fit flex flex-col justify-center items-center px-[1vw] pt-[5vh]">
          <TeacherTableSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    useNotify({
      type: "error",
      message: error.message ?? "Có lỗi xảy ra",
    });
  }

  return (
    <div className="w-[84%] h-screen flex flex-col justify-start items-start overflow-y-scroll no-scrollbar">
      <SMHeader>
        <div>
          <h3 className="text-title-small text-white font-semibold tracking-wider">
            Danh sách giáo viên
          </h3>
        </div>
      </SMHeader>
      <div className="w-full h-fit flex flex-col justify-center items-center px-[1vw] pt-[5vh]">
        <TeacherTable
          teacherTableData={teacherTableData}
          page={page}
          setPage={setPage}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          totalRows={totalRows}
          mutate={mutate}
        />
      </div>
    </div>
  );
}
