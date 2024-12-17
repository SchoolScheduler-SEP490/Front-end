"use client";

import { useAppContext } from "@/context/app_provider";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  IClassCombine,
  ICombineClassData,
  IRoom,
  ISubject,
  ITerm,
} from "./_libs/constants";
import useCombineClassData from "./_hooks/useCombineClassData";
import {
  getRoomName,
  getSubjectName,
  getTermName,
} from "./_libs/apiCombineClass";
import useNotify from "@/hooks/useNotify";
import { TRANSLATOR } from "@/utils/dictionary";
import SMHeader from "@/commons/school_manager/header";
import CombineClassTableSkeleton from "./_components/table_skeleton";
import CombineClassTable from "./_components/combine_class_table";
import CombineClassDetails from "./_components/combine_class_details";

export default function SMCombineClass() {
  const isMenuOpen: boolean = useSelector(
    (state: any) => state.schoolManager.isMenuOpen
  );
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const { schoolId, sessionToken, selectedSchoolYearId } = useAppContext();
  const [totalRows, setTotalRows] = useState<number | undefined>(undefined);
  const [isErrorShown, setIsErrorShown] = useState<boolean>(false);
  const [combineClassTableData, setCombineClassTableData] = useState<
    ICombineClassData[]
  >([]);
  const [subjectName, setSubjectName] = useState<ISubject[]>([]);
  const [roomName, setRoomName] = useState<IRoom[]>([]);
  const [termName, setTermName] = useState<ITerm[]>([]);
  const [isDetailsShown, setIsDetailsShown] = useState<boolean>(false);
  const [selectedCombineClassId, setSelectedCombineClassId] = useState<number>(0);

  const { data, error, isValidating, mutate } = useCombineClassData({
    sessionToken,
    schoolId,
    pageSize: rowsPerPage,
    pageIndex: page + 1,
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
    const fetchSubject = async () => {
      try {
        const response = await getSubjectName(
          sessionToken,
          selectedSchoolYearId
        );
        if (response.status === 200) {
          setSubjectName(response.result.items);
        }
      } catch (error) {
        console.error("Failed to fetch subject name:", error);
      }
    };
    fetchSubject();
  }, [sessionToken, selectedSchoolYearId]);

  React.useEffect(() => {
    const fetchRoom = async () => {
      try {
        const response = await getRoomName(sessionToken, schoolId, 0);
        if (response.status === 200) {
          setRoomName(response.result.items);
        }
      } catch (error) {
        console.error("Failed to fetch room name:", error);
      }
    };
    fetchRoom();
  }, [sessionToken, schoolId]);

  React.useEffect(() => {
    const fetchTerm = async () => {
      try {
        const response = await getTermName(sessionToken, selectedSchoolYearId);
        if (response.status === 200) {
          setTermName(response.result.items);
        }
      } catch (error) {
        console.error("Failed to fetch term name:", error);
      }
    };
    fetchTerm();
  }, [sessionToken, selectedSchoolYearId]);

  React.useEffect(() => {
    if (data?.status === 200) {
      setTotalRows(data.result["total-item-count"]);
      const combineClassData: ICombineClassData[] = data.result.items.map(
        (item: IClassCombine) => {
          const subjectData =
            subjectName.find((subject) => subject.id === item["subject-id"])?.[
              "subject-name"
            ] || "-";
          const roomData =
            roomName.find((room) => room.id === item["room-id"])?.name || "-";

          const termData =
            termName.find((term) => term.id === item["term-id"])?.name || "-";

          const studentClassNames = Array.isArray(item["student-class"])
            ? item["student-class"]
                .map((item) => item["student-class-name"])
                .join(", ") || "-"
            : "-";

          return {
            id: item.id,
            subjectId: subjectData,
            roomId: roomData,
            roomSubjectCode: item["room-subject-code"],
            studentClass: studentClassNames,
            termId: termData,
            teacherAbbreviation: item["teacher-abbreviation"],
          };
        }
      );
      setCombineClassTableData(combineClassData);
    }
  }, [data, subjectName, roomName, termName]);

  React.useEffect(() => {
    if (error && !isErrorShown) {
      setIsErrorShown(true);
      useNotify({
        message: TRANSLATOR[error?.message] ?? "Lớp gộp chưa có dữ liệu.",
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
              Lớp ghép
            </h3>
          </div>
        </SMHeader>
        <CombineClassTableSkeleton />
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
            Lớp ghép
          </h3>
        </div>
      </SMHeader>
      <div
        className={`w-full h-full flex justify-${
          isDetailsShown ? "end" : "center"
        } items-start`}
      >
        <CombineClassTable
          combineClassData={combineClassTableData}
          page={page}
          setPage={setPage}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          totalRows={totalRows}
          selectedCombineClassId={selectedCombineClassId}
          setSelectedCombineClassId={setSelectedCombineClassId}
          mutate={mutate}
          isDetailsShown={isDetailsShown}
          setIsDetailsShown={setIsDetailsShown}
        />
        <CombineClassDetails
          open={isDetailsShown}
          setOpen={setIsDetailsShown}
          combineClassId={selectedCombineClassId}
        />
      </div>
    </div>
  );
}
