import { useState } from "react";
import { useAppContext } from "@/context/app_provider";
import { updateBuilding } from "../_libs/apiBuilding";
import { IUpdateBuilding } from "../_libs/constants";

export function useUpdateBuilding(mutate: () => void) {
  const { sessionToken, schoolId } = useAppContext();
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  const editBuilding = async (
    buildingId: number,
    buildingData: IUpdateBuilding
  ) => {
    setIsUpdating(true);
    try {
      if (!sessionToken) {
        throw new Error("Session token not found. Please log in.");
      }
      const success = await updateBuilding(
        buildingId,
        schoolId,
        buildingData,
        sessionToken
      );
      if (success) {
        mutate();
      }
      setIsUpdating(false);
      return success;
    } catch (error) {
      setUpdateError("Failed to update building.");
      console.error("Error updating building:", error);
      setIsUpdating(false);
      return false;
    }
  };
  return { editBuilding, isUpdating, updateError };
}
