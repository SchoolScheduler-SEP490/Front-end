"use client";

import * as React from "react";
import SMHeader from "@/commons/school_manager/header";
import useClassData from "./_hooks/useClassData";
import ClassTable from "./_components/class_table";
import ClassTableSkeleton from "./_components/table_skeleton";
import { useAppContext } from "@/context/app_provider";
import { IClass, IClassTableData } from "./_libs/constants";
import useNotify from "@/hooks/useNotify";
import { fetchSchoolYear } from "./_libs/apiClass";
import { CLASSGROUP_TRANSLATOR } from "@/utils/constants";
import ClassFilterable from "./_components/class_filterable";
import { TRANSLATOR } from "@/utils/dictionary";

export default function SMClass() {
  const [page, setPage] = React.useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(5);
  const { schoolId, sessionToken, selectedSchoolYearId } = useAppContext();
  const [currentSchoolYear, setCurrentSchoolYear] = React.useState<string>("");
  const [isFilterable, setIsFilterable] = React.useState<boolean>(false);
  const [isErrorShown, setIsErrorShown] = React.useState<boolean>(false);

  const { data, error, isValidating, mutate } = useClassData({
    sessionToken,
    schoolId,
    pageSize: rowsPerPage,
    pageIndex: page + 1,
    schoolYearId: selectedSchoolYearId,
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
		mutate({ schoolYearId: selectedSchoolYearId });
	}, [selectedSchoolYearId]);

  React.useEffect(() => {
    const getSchoolYear = async () => {
      try {
        const data = await fetchSchoolYear(sessionToken);
        if (data.result && data.result.length > 0) {
          setCurrentSchoolYear(`${data.result[0]["start-year"]} - ${data.result[0]["end-year"]}`);
        }
      } catch (error) {
        console.error("Error fetching school year:", error);
      }
    };
    getSchoolYear();
  }, [sessionToken, selectedSchoolYearId]);

  React.useEffect(() => {
    mutate();
    if (data?.status === 200 && currentSchoolYear) {
      setTotalRows(data.result["total-item-count"]);
      const classData: IClassTableData[] = data.result.items.map(
        (item: IClass) => ({
          id: item.id,
          className: item.name,
          grade: CLASSGROUP_TRANSLATOR[item.grade],
          homeroomTeacherName: item["homeroom-teacher-name"],
          subjectGroup: item["subject-group-name"],
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

  React.useEffect(() => {
		if (error && !isErrorShown) {
			setIsErrorShown(true);
			useNotify({
				message: TRANSLATOR[error?.message] ?? 'Lớp học chưa có dữ liệu.',
				type: 'error',
			});
		}
	}, [isValidating]);

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
      <div
        className={`w-full h-auto flex flex-row ${
          isFilterable
            ? "justify-start items-start"
            : "justify-center items-center"
        } pt-5 px-[1.5vw] gap-[1vw]`}
      >
        <ClassTable
          classTableData={classTableData}
          page={page}
          setPage={setPage}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          totalRows={totalRows}
          isFilterable={isFilterable}
          setIsFilterable={setIsFilterable}
          mutate={mutate}
        />
        <ClassFilterable
          open={isFilterable}
          setOpen={setIsFilterable}
          selectedYearId={selectedSchoolYearId}
          setSelectedYearId={(value: number) => selectedSchoolYearId}
        />
      </div>
    </div>
  );
}
