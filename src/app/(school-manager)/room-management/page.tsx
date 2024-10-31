"use client";

import SMHeader from "@/commons/school_manager/header";
import * as React from "react";
import { IRoom, IRoomTableData} from "./_libs/constants";
import { useAppContext } from "@/context/app_provider";
import RoomTable from "./_components/room_table";
import useRoomData from "./_hooks/useRoomData";
import { fetchBuildingName } from "./_libs/apiRoom";
import RoomTableSkeleton from "./_components/table_skeleton";
import useNotify from "@/hooks/useNotify";
import { ERoomType } from "@/utils/constants";

export default function SMRoom() {
  const [page, setPage] = React.useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(5);
  const { schoolId, sessionToken } = useAppContext();
  const [buildingMap, setBuildingMap] = React.useState<Map<number, string>>(
    new Map()
  );

  const { data, error, isValidating, mutate } = useRoomData({
    sessionToken,
    schoolId,
    pageSize: rowsPerPage,
    pageIndex: page + 1,
  });

  const [totalRows, setTotalRows] = React.useState<number | undefined>(
    undefined
  );
  const [roomTableData, setRoomTableData] = React.useState<IRoomTableData[]>(
    []
  );

  const getMaxPage = () => {
    if (totalRows === 0) return 1;
    return totalRows ? Math.ceil(totalRows / rowsPerPage) : 1;
  };

  // Fetch building data
  React.useEffect(() => {
    const getBuildingData = async () => {
      try {
        const buildingData = await fetchBuildingName({
          sessionToken,
          schoolId,
        });

        if (buildingData?.status === 200) {
          const buildings = buildingData.result.items;
          const newBuildingMap = new Map();
          buildings.forEach((building: any) => {
            newBuildingMap.set(building.id, building.name);
          });
          setBuildingMap(newBuildingMap);
        }
      } catch (error) {
        console.error("Error fetching building data:", error);
      }
    };
    getBuildingData();
  }, [sessionToken, schoolId]);

  React.useEffect(() => {
    if (data?.status === 200) {
      setTotalRows(data.result["total-item-count"]);
      const roomData: IRoomTableData[] = data.result.items.map(
        (item: IRoom) => ({
          id: item.id,
          roomName: item.name,
          buildingName: buildingMap.get(item["building-id"]) || "Unknown",
          availableSubjects: item.subjects?.map(subject => subject["subject-name"]).join(", ") || "-",
          roomType: item["room-type"] === ERoomType.PRACTICE_ROOM ? "Phòng thực hành" : "Phòng học",
          status: item["availabilitye-status"] === "Available" ? "Hoạt động" : "Bảo trì",
        })
      );
      console.log(roomData);
      setRoomTableData(roomData);
    }
  }, [data, buildingMap]);

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
              Phòng học
            </h3>
          </div>
        </SMHeader>
        <RoomTableSkeleton />
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
            Phòng học
          </h3>
        </div>
      </SMHeader>
      <RoomTable
        roomTableData={roomTableData}
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
