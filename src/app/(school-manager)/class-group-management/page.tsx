"use client";

import React, { useState } from "react";
import SMHeader from "@/commons/school_manager/header";
import ClassGroupTable from "./_components/class_group_table";
import {
  IClassGroupTableData,
  IClassGroup,
  ICurriculum,
} from "./_libs/constants";
import useNotify from "@/hooks/useNotify";
import { useAppContext } from "@/context/app_provider";
import { useSelector } from "react-redux";
import useClassGroupData from "./_hooks/useClassGroupData";
import { TRANSLATOR } from "@/utils/dictionary";
import ClassGroupTableSkeleton from "./_components/table_skeleton";
import { getCurriculum } from "./_libs/apiClassGroup";
import ClassGroupFilterable from "./_components/class_group_filterable";
import { CLASSGROUP_STRING_TYPE } from "@/utils/constants";
import ClassGroupDetails from "./_components/class_group_details";

export default function SMClassGroup() {
  const isMenuOpen: boolean = useSelector(
    (state: any) => state.schoolManager.isMenuOpen
  );

  const [page, setPage] = React.useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(5);
  const { schoolId, sessionToken, selectedSchoolYearId } = useAppContext();
  const [isErrorShown, setIsErrorShown] = React.useState<boolean>(false);
  const [curriculums, setCurriculums] = React.useState<ICurriculum[]>([]);
  const [selectedGrade, setSelectedGrade] = React.useState<number | null>(null);
  const [isFilterable, setIsFilterable] = React.useState<boolean>(true);
  const [isDetailsShown, setIsDetailsShown] = useState<boolean>(false);
  const [selectedClassGroupId, setSelectedClassGroupId] = useState<number>(0);
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
    const fetchCurriculums = async () => {
      try {
        const response = await getCurriculum(
          sessionToken,
          schoolId,
          selectedSchoolYearId
        );
        if (response.status === 200) {
          setCurriculums(response.result.items);
        }
      } catch (error) {
        console.error("Failed to fetch curriculums:", error);
      }
    };
    fetchCurriculums();
  }, [sessionToken, schoolId, selectedSchoolYearId]);

  React.useEffect(() => {
    if (data?.status === 200) {
      let filteredItems = [...data.result.items];

      if (selectedGrade !== null) {
        filteredItems = filteredItems.filter(
          (item: IClassGroup) => item.grade === selectedGrade
        );
      }

      const classGroupData: IClassGroupTableData[] = filteredItems.map(
        (item: IClassGroup) => {
          const curriculumName =
            curriculums.find((c) => c.id === item["curriculum-id"])?.[
              "curriculum-name"
            ] || "Chưa có dữ liệu";
          return {
            id: item.id,
            groupName: item["group-name"],
            studentClassGroupCode: item["student-class-group-code"],
            grade: item.grade,
            curriculum: curriculumName,
            createDate: item["create-date"],
            classes: item.classes || [],
          };
        }
      );

      setClassGroupTableData(classGroupData);
      setTotalRows(filteredItems.length);
    }
  }, [data, selectedGrade, curriculums]);

  React.useEffect(() => {
    if (error && !isErrorShown) {
      setIsErrorShown(true);
      useNotify({
        message: TRANSLATOR[error?.message] ?? "Nhóm lớp chưa có dữ liệu.",
        type: "error",
      });
    }
  }, [isValidating]);

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
      <div
        className={`w-full h-full flex ${
          isFilterable
            ? "justify-start items-start"
            : isDetailsShown
            ? "justify-end"
            : "justify-center"
        } pl-[1.5vw] pt-5 gap-[1vw]`}
      >
        <ClassGroupTable
          classGroupTableData={classGroupTableData}
          page={page}
          setPage={setPage}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          totalRows={totalRows}
          mutate={mutate}
          isFilterable={isFilterable}
          setIsFilterable={setIsFilterable}
          selectedGrade={selectedGrade}
          selectedClassGroupId={selectedClassGroupId}
          setSelectedClassGroupId={setSelectedClassGroupId}
          isDetailsShown={isDetailsShown}
          setIsDetailsShown={setIsDetailsShown}
        />
        <ClassGroupFilterable
          open={isFilterable}
          setOpen={setIsFilterable}
          selectedGrade={selectedGrade}
          setSelectedGrade={setSelectedGrade}
          mutate={mutate}
        />
        <ClassGroupDetails
          open={isDetailsShown}
          setOpen={setIsDetailsShown}
          classGroupId={selectedClassGroupId}
        />
      </div>
    </div>
  );
}
