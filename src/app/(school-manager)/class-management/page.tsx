"use client";

import * as React from "react";
import SMHeader from "@/commons/school_manager/header";
import useClassData from "./_hooks/useClassData";
import ClassTable from "./_components/class_table";
import ClassTableSkeleton from "./_components/table_skeleton";
import { useAppContext } from "@/context/app_provider";
import { IClass, IClassTableData} from "./_libs/constants";
import useNotify from "@/hooks/useNotify";
import { fetchSchoolYear } from "./_libs/apiClass";

export default function SMClass() {
  const [page, setPage] = React.useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(5);
  const { schoolId, sessionToken } = useAppContext();
  const [currentSchoolYear, setCurrentSchoolYear] = React.useState<string>("");

  const { data, error, isValidating, mutate } = useClassData({
    sessionToken,
    schoolId,
    pageSize: rowsPerPage,
    pageIndex: page + 1,
  });
  const [totalRows, setTotalRows] = React.useState<number | undefined>(
    undefined
  );
  const [classTableData, setClassTableData] = React.useState<IClassTableData[]>(
    []
  );

  const getMaxPage = () => {
    if (totalRows === 0) return 1;
    return totalRows ? Math.ceil(totalRows / rowsPerPage) : 1;
  };

  React.useEffect(() => {
    const getSchoolYear = async () => {
      try {
        const data = await fetchSchoolYear(sessionToken);
        if (data.result && data.result.length > 0) {
          setCurrentSchoolYear(data.result[0]["school-year-code"]);
        }
      } catch (error) {
        console.error('Error fetching school year:', error);
      }
    };
    getSchoolYear();
  }, [sessionToken]);

  React.useEffect(() => {
    mutate();
    if (data?.status === 200  && currentSchoolYear ) {
      setTotalRows(data.result["total-item-count"]);
      const classData: IClassTableData[] = data.result.items.map(
        (item: IClass) => ({
          id: item.id,
          className: item.name,
          grade: item.grade,
          homeroomTeacherName: item["homeroom-teacher-name"],
          schoolYear: currentSchoolYear,
          mainSession: item["main-session-text"],
        })
      );
      setClassTableData(classData);
    }
  }, [data, currentSchoolYear]);

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
              Lớp học
            </h3>
          </div>
        </SMHeader>
          <ClassTableSkeleton />
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
            Lớp học
          </h3>
        </div>
      </SMHeader>
        <ClassTable
          classTableData={classTableData}
          page={page}
          setPage={setPage}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          totalRows={totalRows}
          mutate={mutate}
        />
    </div>
  );
}
