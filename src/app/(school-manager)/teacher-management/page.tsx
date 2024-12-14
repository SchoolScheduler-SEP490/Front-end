"use client";

import * as React from "react";
import SMHeader from "@/commons/school_manager/header";
import TeacherTable from "./_components/teacher_table";
import useTeacherData from "./_hooks/useTeacherData";
import TeacherTableSkeleton from "./_components/table_skeleton";
import { useAppContext } from "@/context/app_provider";
import { IDepartment, ITeacher, ITeacherTableData } from "./_libs/constants";
import useNotify from "@/hooks/useNotify";
import { TEACHER_STATUS } from "@/utils/constants";
import { TRANSLATOR } from "@/utils/dictionary";
import { useSelector } from "react-redux";
import { getDepartmentName } from "./_libs/apiTeacher";
import TeacherFilterable from "./_components/teacher_filterable";

export default function SMTeacher() {
  const [page, setPage] = React.useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(5);
  const { schoolId, sessionToken, selectedSchoolYearId } = useAppContext();
  const isMenuOpen: boolean = useSelector(
    (state: any) => state.schoolManager.isMenuOpen
  );
  const [isErrorShown, setIsErrorShown] = React.useState<boolean>(false);
  const [isFilterable, setIsFilterable] = React.useState<boolean>(true);
  const [selectedDepartment, setSelectedDepartment] = React.useState<
    number | null
  >(null);
  const [filteredRowsPerPage, setFilteredRowsPerPage] = React.useState(0);

  const { data, error, isValidating, mutate } = useTeacherData({
    sessionToken,
    schoolId,
    pageSize: rowsPerPage,
    pageIndex: page + 1,
    departmentId: selectedDepartment
  });

  const [totalRows, setTotalRows] = React.useState<number | undefined>(
    undefined
  );
  const [teacherTableData, setTeacherTableData] = React.useState<
    ITeacherTableData[]
  >([]);
  const [departments, setDepartments] = React.useState<IDepartment[]>([]);

  const getMaxPage = () => {
    if (totalRows === 0) return 1;
    return totalRows ? Math.ceil(totalRows / rowsPerPage) : 1;
  };

  React.useEffect(() => {
    mutate({ schoolYearId: selectedSchoolYearId });
  }, [selectedSchoolYearId]);

  React.useEffect(() => {
    const loadDepartments = async () => {
      const data = await getDepartmentName(schoolId, sessionToken);
      if (data.result?.items) {
        setDepartments(data.result.items);
      }
    };
    loadDepartments();
  }, [schoolId, sessionToken]);

  React.useEffect(() => {
    if (data?.status === 200) {
      setTotalRows(data.result["total-item-count"]);
      const teacherData: ITeacherTableData[] = data.result.items.map((item: ITeacher) => ({
        id: item.id,
        teacherName: `${item["first-name"]} ${item["last-name"]}`,
        nameAbbreviation: item.abbreviation,
        subjectDepartment:
          departments.find((d) => d.id === item["department-id"])?.name ||
          "N/A",
        email: item.email,
        phoneNumber: item.phone || "N/A",
        status: item.status,
        teachableSubjects: item["teachable-subjects"]
          .map((subject) => subject["subject-name"])
          .join(" - "),
      }));
      setTeacherTableData(teacherData);
    }
  }, [data, departments]);

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
        message: TRANSLATOR[error?.message] ?? "Không tìm thấy giáo viên.",
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
              Giáo viên
            </h3>
          </div>
        </SMHeader>
        <div className="w-full h-fit flex flex-col justify-center items-center px-[1vw] pt-[5vh]">
          <TeacherTableSkeleton />
        </div>
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
            Danh sách giáo viên
          </h3>
        </div>
      </SMHeader>
      <div className="w-full h-fit flex flex-col justify-center items-center px-[1vw] pt-[5vh]">
        <div className="w-full h-fit flex flex-row justify-center items-start gap-6">
          <div className={`${isFilterable ? "w-[79%]" : "w-full"}`}>
            <TeacherTable
              teacherTableData={teacherTableData}
              page={page}
              setPage={setPage}
              rowsPerPage={rowsPerPage}
              setRowsPerPage={setRowsPerPage}
              totalRows={totalRows}
              mutate={mutate}
              isFilterable={isFilterable}
              setIsFilterable={setIsFilterable}
            />
          </div>
          {isFilterable && (
            <TeacherFilterable
              open={isFilterable}
              setOpen={setIsFilterable}
              selectedDepartment={selectedDepartment}
              setSelectedDepartment={setSelectedDepartment}
              departments={departments}
              mutate={mutate}
              setPage={setPage}
            />
          )}
        </div>
      </div>
    </div>
  );
}
