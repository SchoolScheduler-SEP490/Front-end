import { useState } from "react";
import { ITeachableSubjectRequest } from "../_libs/constants";
import { addNewTeachableSubject } from "../_libs/apiTeacher";
import useNotify from "@/hooks/useNotify";

interface IAddTeachableSubjectProps {
  schoolId: string;
  teacherId: number;
  teachableData: ITeachableSubjectRequest[];
  sessionToken: string;
}

const useAddTeachableSubject = (props: IAddTeachableSubjectProps) => {
  const handleAddTeachableSubject = async () => {
    try {
      const response = await addNewTeachableSubject(
        props.schoolId,
        props.teacherId,
        props.teachableData,
        props.sessionToken
      );

      useNotify({
        message: "Thêm chuyên môn thành công",
        type: "success",
      });
      return true;
    } catch (err: any) {
      useNotify({
        message: err.message || "Thêm chuyên môn thất bại",
        type: "error",
      });
      return false;
    }
  };

  return {
    handleAddTeachableSubject,
  };
};

export default useAddTeachableSubject;
