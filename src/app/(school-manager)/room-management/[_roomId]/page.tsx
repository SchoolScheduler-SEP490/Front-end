"use client";

import { useAppContext } from "@/context/app_provider";
import { useEffect, useState } from "react";
import SMHeader from "@/commons/school_manager/header";
import { useRouter, useSearchParams } from "next/navigation";
import { IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { IBuilding, IRoomDetail } from "../_libs/constants";
import { ROOM_TYPE_TRANSLATOR } from "@/utils/constants";
import { fetchBuildingName } from "../_libs/apiRoom";

export default function RoomDetails() {
  const [roomData, setRoomData] = useState<IRoomDetail>();
  const { sessionToken, schoolId } = useAppContext();
  const api = process.env.NEXT_PUBLIC_API_URL;
  const searchParams = useSearchParams();
  const roomId = searchParams.get("id");
  const router = useRouter();
  const [buildingData, setBuildingData] = useState<IBuilding>();

  useEffect(() => {
    const fetchData = async () => {
      const roomResponse = await fetch(`${api}/api/schools/${schoolId}/rooms/${roomId}`, {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      });
      const roomData = await roomResponse.json();
      
      if (roomData.status === 200) {
        setRoomData(roomData.result);
        
        const buildingData = await fetchBuildingName(
          sessionToken,
          schoolId
        );
        
        if (buildingData.status === 200) {
          const matchingBuilding = buildingData.result.items.find(
            (building: IBuilding) => building.id === roomData.result["building-id"]
          );
          setBuildingData(matchingBuilding);
        }
      }
    };

    if (sessionToken && roomId) {
      fetchData();
    }
  }, [roomId, sessionToken, api, schoolId]);

  const handleBack = () => {
    router.push("/room-management");
  };

  return (
    <div className="w-[84%] h-screen flex flex-col justify-start items-start overflow-y-scroll no-scrollbar">
      <SMHeader>
        <div className="flex items-center gap-4">
          <IconButton onClick={handleBack} sx={{ color: "white" }}>
            <ArrowBackIcon />
          </IconButton>
          <h3 className="text-title-small text-white font-semibold tracking-wider">
            Thông tin phòng học
          </h3>
        </div>
      </SMHeader>

      <div className="w-full p-7">
        {roomData && (
          <div>
            <h2 className="text-title-medium font-semibold tracking-wider leading-loose">
              Thông tin chung
            </h2>

            <div className="grid grid-cols-2 gap-6 mb-6 leading-loose">
              <div>
                <p><strong>Tên phòng:</strong> {roomData.name}</p>
                <p><strong>Mã phòng:</strong> {roomData["room-code"]}</p>
                <p><strong>Loại phòng:</strong> {ROOM_TYPE_TRANSLATOR[roomData["room-type"]]}</p>
                <p><strong>Tòa nhà:</strong> {buildingData?.name || ''}</p>
              </div>
              <div>
                <p><strong>Số lớp tối đa:</strong> {roomData["max-class-per-time"]}</p>
                <p><strong>Trạng thái:</strong> {roomData["availabilitye-status"] === "Available" ? "Hoạt động" : "Bảo trì"}</p>
                <p><strong>Môn học:</strong> {roomData.subjects.length > 0 ? 
                  roomData.subjects.map(subject => subject["subject-name"]).join(" - ") : 
                  "Không có"}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
