import { IRegisterForm } from "../../_utils/constants";
import { IDistrict, IProvince, ISchool } from "./constant";

const api = process.env.NEXT_PUBLIC_API_URL || "Unknown";

export const getProvince = async (): Promise<IProvince[]> => {
  try {
    const response = await fetch(`${api}/api/provinces`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch provinces");
    }

    const data = await response.json();
    return data.result.items;
  } catch (error) {
    console.error("Error fetching provinces:", error);
    throw error;
  }
};

export const getDistrict = async (provinceId: number): Promise<IDistrict[]> => {
  try {
    const response = await fetch(
      `${api}/api/districts/provinces/${provinceId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch districts");
    }

    const data = await response.json();
    return data.result.items;
  } catch (error) {
    console.error("Error fetching districts:", error);
    throw error;
  }
};

export const getSchool = async (provinceId: number, districtCode: number): Promise<ISchool[]> => {
  const initialResponse = await fetch(
    `${api}/api/schools?districtCode=${districtCode}&provinceId=${provinceId}&pageIndex=1&pageSize=20`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const initialData = await initialResponse.json();
  const totalCount = initialData.result["total-item-count"];

  const response = await fetch(
    `${api}/api/schools?districtCode=${districtCode}&provinceId=${provinceId}&pageIndex=1&pageSize=${totalCount}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const data = await response.json();
  return data.result.items;
};

export const registerSchool = async (
    formData: IRegisterForm
) => {
    const response = await fetch (`${api}/api/users/school-manager-register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formData)
    })

    const data = await response.json();
    return data;
}
