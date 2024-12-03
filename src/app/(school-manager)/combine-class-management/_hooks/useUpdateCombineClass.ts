import { useState } from "react";
import { useAppContext } from "@/context/app_provider";
import { updateCombineClass } from "../_libs/apiCombineClass";
import { IUpdateCombineClass } from "../_libs/constants";

export function useUpdateCombineClass(mutate: () => void) {
  const { sessionToken, schoolId } = useAppContext();
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  const editCombineClass = async (
    combineClassId: number,
    combineClassData: IUpdateCombineClass
  ) => {
    setIsUpdating(true);
    try {
      if (!sessionToken) {
        throw new Error("Session token not found. Please log in.");
      }
      const success = await updateCombineClass(
        combineClassId,
        schoolId,
        sessionToken,
        combineClassData
      );
      if (success) {
        mutate();
      }
      setIsUpdating(false);
      return success;
    } catch (error) {
      setUpdateError("Failed to update combine class.");
      console.error("Error updating combine class:", error);
      setIsUpdating(false);
      return false;
    }
  };
  return { editCombineClass, isUpdating, updateError };
}
