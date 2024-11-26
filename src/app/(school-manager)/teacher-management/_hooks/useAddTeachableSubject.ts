import { useState } from "react";
import { ITeachableSubjectRequest } from "../_libs/constants";
import { addNewTeachableSubject } from "../_libs/apiTeacher";
import useNotify from "@/hooks/useNotify";

interface IAddTeachableSubjectProps {
  schoolId: string;
  teacherId: number;
  teachableData: ITeachableSubjectRequest;
  sessionToken: string;
}

const useAddTeachableSubject = async (props: IAddTeachableSubjectProps) => {
  const { schoolId, teacherId, teachableData, sessionToken } = props;
  try {
    const result = await addNewTeachableSubject(
      schoolId,
      teacherId,
      [teachableData],
      sessionToken
    );
    useNotify({
      message: "Thêm chuyên môn thành công",
      type: "success",
    });
    return result;
  } catch (err) {
    useNotify({
      message: "Thêm chuyên môn thất bại. Vui lòng thử lại",
      type: "error",
    });
    return false;
  }
};

export default useAddTeachableSubject;
