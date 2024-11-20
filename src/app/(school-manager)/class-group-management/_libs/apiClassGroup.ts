import {
  IAddClassGroup,
  IClassGroupDetail,
  IClassGroupResponse,
  IUpdateClassGroup,
} from "./constants";

const api = process.env.NEXT_PUBLIC_API_URL;

export const addClassGroup = async (
  sessionToken: string,
  schoolId: string,
  classGroupData: IAddClassGroup,
  schoolYearId: number
): Promise<any> => {
  if (!sessionToken) {
    console.error("Session token is not found. Please log in.");
    return false;
  }
  const url = `${api}/api/schools/${schoolId}/academic-years/${schoolYearId}/class-groups`;
  const requestBody = [classGroupData];

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionToken}`,
    },
    body: JSON.stringify(requestBody),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message);
  }
  return data;
};

export const deleteClassGroup = async (
  id: number,
  sessionToken: string,
  schoolId: string,
  schoolYearId: number
): Promise<void> => {
  const url = `${api}/api/schools/${schoolId}/academic-years/${schoolYearId}/class-groups/${id}`;

  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionToken}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }
};

export const getStudentClass = async (
  sessionToken: string,
  schoolId: string,
  schoolYearId: number
) => {
  const initialResponse = await fetch(
    `${api}/api/schools/${schoolId}/academic-years/${schoolYearId}/classes?includeDeleted=false&pageIndex=1&pageSize=20`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionToken}`,
      },
    }
  );

  const initialData = await initialResponse.json();
  const totalCount = initialData.result["total-item-count"];

  const response = await fetch(
    `${api}/api/schools/${schoolId}/academic-years/${schoolYearId}/classes?includeDeleted=false&pageIndex=1&pageSize=${totalCount}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionToken}`,
      },
    }
  );

  const data = await response.json();
  return data;
};

export const assignClass = async (
  schoolId: string,
  schoolYearId: number,
  classGroupId: number,
  classIds: number[],
  sessionToken: string
) => {
  const url = `${api}/api/schools/${schoolId}/academic-years/${schoolYearId}/class-groups/${classGroupId}/assign-class-to-class-group`;

  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionToken}`,
    },
    body: JSON.stringify({
      "class-ids": classIds,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message);
  }
  return data;
};

export const getCurriculum = async (
  sessionToken: string,
  schoolId: string,
  schoolYearId: number
) => {
  const initialResponse = await fetch(
    `${api}/api/schools/${schoolId}/academic-years/${schoolYearId}/curriculum?pageIndex=1&pageSize=20`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionToken}`,
      },
    }
  );

  const initialData = await initialResponse.json();
  const totalCount = initialData.result["total-item-count"];

  const response = await fetch(
    `${api}/api/schools/${schoolId}/academic-years/${schoolYearId}/curriculum?pageIndex=1&pageSize=${totalCount}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionToken}`,
      },
    }
  );

  const data = await response.json();
  return data;
};

export const assignCurriculum = async (
  schoolId: string,
  schoolYearId: number,
  classGroupId: number,
  curriculumId: number,
  sessionToken: string
) => {
  const url = `${api}/api/schools/${schoolId}/academic-years/${schoolYearId}/class-groups/${classGroupId}/assign-curriculum/${curriculumId}`;

  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionToken}`,
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message);
  }
  return data;
};

export const getClassGroupById = async (
  id: number,
  schoolId: string,
  schoolYearId: number,
  sessionToken: string
): Promise<IClassGroupDetail> => {
  const url = `${api}/api/schools/${schoolId}/academic-years/${schoolYearId}/class-groups/${id}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionToken}`,
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message);
  }
  return data.result;
};

export const updateClassGroup = async (
  id: number,
  schoolId: string,
  schoolYearId: number,
  sessionToken: string,
  classGroupData: IUpdateClassGroup
): Promise<boolean> => {
  if (!sessionToken) {
    throw new Error("Session token not found. Please log in.");
  }

  const url = `${api}/api/schools/${schoolId}/academic-years/${schoolYearId}/class-groups/${id}`;
  const requestBody = classGroupData;
  console.log("Request Body:", requestBody);

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionToken}`,
      },
      body: JSON.stringify(requestBody),
    });
    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error occurred while sending request:", error);
    return false;
  }
};

export const getExistingClassGroup = async (
  schoolId: string,
  schoolYearId: number,
  sessionToken: string
): Promise<IClassGroupResponse> => {
  const initialResponse = await fetch(
    `${api}/api/schools/${schoolId}/academic-years/${schoolYearId}/class-groups?pageIndex=1&pageSize=20`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionToken}`,
      },
    }
  );
  const initialData = await initialResponse.json();
  const totalCount = initialData.result["total-item-count"];

  const response = await fetch(
    `${api}/api/schools/${schoolId}/academic-years/${schoolYearId}/class-groups?pageIndex=1&pageSize=${totalCount}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionToken}`,
      },
    }
  );
  const data = await response.json();
  return data;
};
