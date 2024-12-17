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
import {
  CLASSGROUP_TRANSLATOR,
  CLASSGROUP_TRANSLATOR_REVERSED,
} from "@/utils/constants";
import ClassFilterable from "./_components/class_filterable";
import { TRANSLATOR } from "@/utils/dictionary";
import { useSelector } from "react-redux";

export default function SMClass() {
  const isMenuOpen: boolean = useSelector(
    (state: any) => state.schoolManager.isMenuOpen
  );

  const [page, setPage] = React.useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(5);
  const { schoolId, sessionToken, selectedSchoolYearId } = useAppContext();
  const [currentSchoolYear, setCurrentSchoolYear] = React.useState<string>("");
  const [isFilterable, setIsFilterable] = React.useState<boolean>(true);
  const [isErrorShown, setIsErrorShown] = React.useState<boolean>(false);
  const [selectedYearId, setSelectedYearId] =
    React.useState(selectedSchoolYearId);
  const [selectedGrade, setSelectedGrade] = React.useState<number | null>(null);

  const { data, error, isValidating, mutate } = useClassData({
    sessionToken,
    schoolId,
    pageSize: rowsPerPage,
    pageIndex: page + 1,
    schoolYearId: selectedSchoolYearId,
    grade:
      selectedGrade !== null
        ? CLASSGROUP_TRANSLATOR_REVERSED[selectedGrade]
        : undefined,
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
          setCurrentSchoolYear(
            `${data.result[0]["start-year"]} - ${data.result[0]["end-year"]}`
          );
        }
      } catch (error) {
        console.error("Error fetching school year:", error);
      }
    };
    getSchoolYear();
  }, [sessionToken, selectedSchoolYearId]);

  React.useEffect(() => {
    mutate();
    setIsErrorShown(false);
    if (data?.status === 200) {
      setTotalRows(data.result["total-item-count"]);
      const classData: IClassTableData[] = data.result.items.map(
        (item: IClass) => ({
          id: item.id,
          className: item.name,
          grade: CLASSGROUP_TRANSLATOR[item.grade],
          homeroomTeacherName: item["homeroom-teacher-name"],
          schoolYear: currentSchoolYear,
          mainSession: item["main-session"],
          room: item["room-name"],
        })
      );
      setClassTableData(classData);
    }
  }, [data, selectedSchoolYearId]);

  React.useEffect(() => {
    setPage((prev) => Math.min(prev, getMaxPage() - 1));
    if (page <= getMaxPage()) {
      mutate({
        pageSize: rowsPerPage,
        pageIndex: page,
      });
    }
  }, [page, rowsPerPage]);

  // React.useEffect(() => {
  //   if (error && !isErrorShown) {
  //     setIsErrorShown(true);
  //     useNotify({
  //       message: TRANSLATOR[error?.message] ?? "Lớp học chưa có dữ liệu.",
  //       type: "error",
  //     });
  //   }
  // }, [isValidating]);

  if (isValidating) {
    return (
      <div
        className={`w-[${
          !isMenuOpen ? "84" : "100"
        }%] h-screen flex flex-col justify-start items-start overflow-y-scroll no-scrollbar`}
      >
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

  return (
    <div
      className={`w-[${
        !isMenuOpen ? "84" : "100"
      }%] h-screen flex flex-col justify-start items-start overflow-y-scroll no-scrollbar`}
    >
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
        } pl-[1.5vw] pt-5 gap-[1vw]`}
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
          selectedGrade={selectedGrade}
        />
        <ClassFilterable
          open={isFilterable}
          setOpen={setIsFilterable}
          selectedGrade={selectedGrade}
          setSelectedGrade={setSelectedGrade}
          setPage={setPage}
          mutate={mutate}
        />
      </div>
    </div>
  );
}
