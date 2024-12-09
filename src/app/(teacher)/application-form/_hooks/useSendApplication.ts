import { useState } from "react";
import { sendApplication } from "../_libs/apiApplication";
import { ISendApplication } from "../_libs/constants";
import useNotify from "@/hooks/useNotify";

export const useSendApplication = () => {
  const [loading, setLoading] = useState(false);

  const submitApplication = async (
    schoolId: string,
    sessionToken: string,
    formData: ISendApplication
  ) => {
    try {
      setLoading(true);
      const result = await sendApplication(schoolId, sessionToken, formData);
      useNotify({
        type: "success",
        message: "Gửi đơn thành công",
      });
      return result;
    } catch (error) {
      useNotify({
        type: "error",
        message: "Gửi đơn thất bại. Vui lòng thử lại!",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    submitApplication,
  };
};
