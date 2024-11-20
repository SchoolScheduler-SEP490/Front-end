import { useState } from "react";
import { useAppContext } from "@/context/app_provider";
import { updateClassGroup } from "../_libs/apiClassGroup";
import { IUpdateClassGroup } from "../_libs/constants";

export function useUpdateClassGroup(mutate: () => void) {
  const { sessionToken, schoolId, selectedSchoolYearId } = useAppContext();
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  const editClassGroup = async (
    classGroupId: number,
    classGroupData: IUpdateClassGroup
  ) => {
    setIsUpdating(true);
    try {
      if (!sessionToken) {
        throw new Error("Session token not found. Please log in.");
      }
      const success = await updateClassGroup(
        classGroupId,
        schoolId,
        selectedSchoolYearId,
        sessionToken,
        classGroupData
      );

      if (success) {
        mutate();
      }
      setIsUpdating(false);
      return success;
    } catch (error) {
      setUpdateError("Failed to update class.");
      console.error("Error updating class:", error);
      setIsUpdating(false);
      return false;
    }
  };
  return { editClassGroup, isUpdating, updateError };
}
