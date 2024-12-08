import {
  IAddTeacherData,
  IUpdateTeacherRequestBody,
  ITeacherDetail,
  ITeachableSubjectRequest,
} from "./constants";

const api = process.env.NEXT_PUBLIC_API_URL || "Unknown";

export const deleteTeacherById = async (
  id: number,
  schoolId: string,
  sessionToken: string
): Promise<void> => {
  if (!sessionToken) {
    throw new Error("Session token not found. Please log in.");
  }
  const url = `${api}/api/schools/${schoolId}/teachers/${id}`;

  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionToken}`,
    },
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
};

export const addTeacher = async (
  api: string,
  schoolId: string,
  sessionToken: string,
  teacherData: IAddTeacherData
): Promise<any> => {
  if (!sessionToken) {
    console.error("Session token is not found. Please log in.");
    return false;
  }

  const url = `${api}/api/schools/${schoolId}/teachers`;
  const requestBody = [teacherData];
  console.log("Request Body:", requestBody);

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

export const updateTeacher = async (
  id: number,
  schoolId: string,
  teacherData: IUpdateTeacherRequestBody,
  sessionToken: string
): Promise<boolean> => {
  if (!sessionToken) {
    console.error("Session token is not found. Please log in.");
    return false;
  }

  const url = `${api}/api/schools/${schoolId}/teachers/${id}`;
  const requestBody = teacherData;
  console.log("Request Body:", requestBody);

  try {
    const response = await fetch(url, {
      method: "PATCH",
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

export const getDepartmentName = async (
  schoolId: string,
  sessionToken: string
) => {
  const initialResponse = await fetch(
    `${api}/api/schools/${schoolId}/departments?pageIndex=1&pageSize=20`,
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
    `${api}/api/schools/${schoolId}/departments?pageIndex=1&pageSize=${totalCount}`,
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

export const getSubjectName = async (
  sessionToken: string,
  schoolYearId: number
) => {
  const initialResponse = await fetch(
    `${api}/api/subjects?schoolYearIdint=${schoolYearId}&includeDeleted=false&pageIndex=1&pageSize=20`,
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
    `${api}/api/subjects?schoolYearIdint=${schoolYearId}&includeDeleted=false&pageIndex=1&pageSize=${totalCount}`,
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

export const fetchTeacherById = async (
  schoolId: string,
  teacherId: number,
  sessionToken: string
): Promise<ITeacherDetail> => {
  const url = `${api}/api/schools/${schoolId}/teachers/${teacherId}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionToken}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch teacher data.");
  }

  const data = await response.json();
  return data.result;
};

export const getTeacherAssignment = async (
  schoolId: string,
  teacherId: number,
  schoolYearId: number,
  sessionToken: string
) => {
  const url = `${api}/api/schools/${schoolId}/teachers/assignment?teacherId=${teacherId}&schoolYearId=${schoolYearId}`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionToken}`,
    },
  });
  const data = await response.json();
  return data;
};

export const updateTeachableSubject = async (
  teacherId: number,
  schoolId: string,
  sessionToken: string,
  teachableSubjects: ITeachableSubjectRequest[]
): Promise<boolean> => {
  const url = `${api}/api/schools/${schoolId}/teachers/${teacherId}/teachable-subjects`;

  try {
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionToken}`,
      },
      body: JSON.stringify(teachableSubjects),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error("Error updating teachable subjects:", error);
    return false;
  }
};

export const getTeachableSubjects = async (
  schoolId: string,
  subjectId: number,
  grade: string,
  sessionToken: string
) => {
  const url = `${api}/api/schools/${schoolId}/subjects/${subjectId}/teachable-subjects?eGrade=${grade}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${sessionToken}`,
    },
  });

  const data = await response.json();
  return data;
};

export const getTeacherSubject = async (
  schoolId: string,
  teacherId: number,
  sessionToken: string
) => {
  const url = `${api}/api/schools/${schoolId}/teachers/${teacherId}/teachable-subjects`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionToken}`,
    },
  });
  const data = await response.json();
  return data;
};

export const addNewTeachableSubject = async (
  schoolId: string,
  teacherId: number,
  teachableData: ITeachableSubjectRequest[],
  sessionToken: string
): Promise<boolean> => {
  const url = `${api}/api/schools/${schoolId}/teachers/${teacherId}/teachable-subjects`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionToken}`,
      },
      body: JSON.stringify(teachableData),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return true;
  } catch (error) {
    console.error("Error adding teachable subject:", error);
    return false;
  }
};

export const deleteTeachableSubject = async (
  id: number,
  schoolId: string,
  sessionToken: string
): Promise<void> => {
  if (!sessionToken) {
    throw new Error("Session token not found. Please log in.");
  }
  const url = `${api}/api/schools/${schoolId}/teachers/teachable-subject/${id}`;

  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionToken}`,
    },
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
};