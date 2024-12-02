"use client";

import { useAppContext } from "@/context/app_provider";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { IBuilding, IBuildingTableData } from "./_libs/constants";
import useBuildingData from "./_hooks/useBuildingData";
import useNotify from "@/hooks/useNotify";
import { TRANSLATOR } from "@/utils/dictionary";
import SMHeader from "@/commons/school_manager/header";
import BuildingTableSkeleton from "./_components/table_skeleton";
import BuildingTable from "./_components/building_table";

export default function SMBuilding() {
  const isMenuOpen: boolean = useSelector(
    (state: any) => state.schoolManager.isMenuOpen
  );
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const { schoolId, sessionToken, selectedSchoolYearId } = useAppContext();
  const [totalRows, setTotalRows] = useState<number | undefined>(undefined);
  const [isErrorShown, setIsErrorShown] = useState<boolean>(false);
  const [buildingData, setBuildingData] = useState<IBuildingTableData[]>([]);

  const { data, error, isValidating, mutate } = useBuildingData({
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
    if (data?.status === 200) {
      setTotalRows(data.result["total-item-count"]);
      const buildingData: IBuildingTableData[] = data.result.items.map(
        (building: IBuilding) => {
          return {
            id: building.id,
            name: building.name,
            buildingCode: building["building-code"],
            description: building.description,
            floor: building.floor,
          };
        }
      );
      setBuildingData(buildingData);
    }
  }, [data, schoolId]);

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
        message: TRANSLATOR[error?.message] ?? "Lớp học chưa có dữ liệu.",
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
              Lớp học
            </h3>
          </div>
        </SMHeader>
        <BuildingTableSkeleton />
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
            Toà nhà
          </h3>
        </div>
      </SMHeader>
      <BuildingTable
        buildingTableData={buildingData}
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
