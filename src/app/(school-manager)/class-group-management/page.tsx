"use client";

import React from "react";
import SMHeader from "@/commons/school_manager/header";
import ClassGroupTable from "./_components/class_group_table";
import { IClassGroupTableData, IClassGroup, ICurriculum } from "./_libs/constants";
import useNotify from "@/hooks/useNotify";
import { useAppContext } from "@/context/app_provider";
import { useSelector } from "react-redux";
import useClassGroupData from "./_hooks/useClassGroupData";
import { TRANSLATOR } from "@/utils/dictionary";
import ClassGroupTableSkeleton from "./_components/table_skeleton";
import { getCurriculum } from "./_libs/apiClassGroup";

export default function SMClassGroup() {
  const isMenuOpen: boolean = useSelector(
    (state: any) => state.schoolManager.isMenuOpen
  );

  const [page, setPage] = React.useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(5);
  const { schoolId, sessionToken, selectedSchoolYearId } = useAppContext();
  const [isErrorShown, setIsErrorShown] = React.useState<boolean>(false);
  const [curriculums, setCurriculums] = React.useState<ICurriculum[]>([]);
  const [totalRows, setTotalRows] = React.useState<number | undefined>(
    undefined
  );
  const [classGroupTableData, setClassGroupTableData] = React.useState<
    IClassGroupTableData[]
  >([]);
  const { data, error, isValidating, mutate } = useClassGroupData({
    sessionToken,
    schoolId,
    pageSize: rowsPerPage,
    pageIndex: page + 1,
    schoolYearId: selectedSchoolYearId,
  });
  const getMaxPage = () => {
    if (totalRows === 0) return 1;
    return totalRows ? Math.ceil(totalRows / rowsPerPage) : 1;
  };

  React.useEffect(() => {
    mutate({ schoolYearId: selectedSchoolYearId });
  }, [selectedSchoolYearId]);

  React.useEffect(() => {
    setPage((prev) => Math.min(prev, getMaxPage() - 1));
    if (page <= getMaxPage()) {
      mutate({
        pageSize: rowsPerPage,
        pageIndex: page,
      });
    }
  }, [page, rowsPerPage]);

  React.useEffect(() => {
    if (error && !isErrorShown) {
      setIsErrorShown(true);
      useNotify({
        message: TRANSLATOR[error?.message] ?? "Nhóm lớp chưa có dữ liệu.",
        type: "error",
      });
    }
  }, [isValidating]);

  React.useEffect(() => {
    const fetchCurriculums = async () => {
      try {
        const response = await getCurriculum(sessionToken, schoolId, selectedSchoolYearId)
        if (response.status === 200) {
          setCurriculums(response.result.items);
        }
      } catch (error) {
        console.error('Failed to fetch curriculums:', error);
      }
    }
    fetchCurriculums();
  }, [sessionToken, schoolId, selectedSchoolYearId] )

  React.useEffect(() => {
    mutate();
    setIsErrorShown(false);
    if (data?.status === 200) {
      setTotalRows(data.result["total-item-count"]);
      const classGroupData: IClassGroupTableData[] = data.result.items.map(
        (item: IClassGroup) => ({
          id: item.id,
          groupName: item["group-name"],
          studentClassGroupCode: item["student-class-group-code"],
          grade: Number(item.grade),
          curriculum: curriculums.find(c => c.id === item["curriculum-id"])?.["curriculum-name"] || item["curriculum-id"],
          createDate: item["create-date"],
          classes: item.classes || []
        })
      );
      setClassGroupTableData(classGroupData);
    }
  }, [data]);

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
              Nhóm lớp
            </h3>
          </div>
        </SMHeader>
        <ClassGroupTableSkeleton />
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
            Nhóm lớp
          </h3>
        </div>
      </SMHeader>
      
      <ClassGroupTable
        classGroupTableData={classGroupTableData}
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
