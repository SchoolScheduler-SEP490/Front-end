"use client";

import SMHeader from "@/commons/school_manager/header";
import TeacherTable from "./_components/teacher_table";
import { ITeacherTableData } from "./_hooks/custom_hook";

const teacherData: ITeacherTableData[] = [
  {
    id: 1,
    teacherCode: "1",
    teacherName: "Nguyễn Hà Thanh Mai",
    nameAbbreviation: "MaiNHT",
    subjectDepartment: "Ngữ Văn",
    phoneNumber: "0981457821",
    email: "mainht@gmail.com",
    status: "Hoạt động",
  },
  {
    id: 2,
    teacherCode: "2",
    teacherName: "Nguyễn Chiến Thắng",
    nameAbbreviation: "ThangNC",
    subjectDepartment: "Toán - Vật Lý - Hóa Học",
    phoneNumber: "0909654321",
    email: "chuatebongtoi@gmail.com",
    status: "Hoạt động",
  },
  {
    id: 3,
    teacherCode: "3",
    teacherName: "Lương Hoàng Anh",
    nameAbbreviation: "AnhLH",
    subjectDepartment: "Công Nghệ - GDCD",
    phoneNumber: "0987654321",
    email: "anhhl@gmail.com",
    status: "Vô hiệu",
  },

  {
    id: 4,
    teacherCode: "4",
    teacherName: "Nguyễn Thành Long",
    nameAbbreviation: "LongNT",
    subjectDepartment: "Sinh Học - Lịch Sử - Địa Lý",
    phoneNumber: "0963791460",
    email: "nuhoanganhsang@gmail.com",
    status: "Hoạt động",
  },

  {
    id: 5,
    teacherCode: "5",
    teacherName: "Lâm Hữu Khánh Phương",
    nameAbbreviation: "PhuongLHK",
    subjectDepartment: "Tiếng Anh",
    phoneNumber: "0886310928",
    email: "phuonglhkfe@gmail.com",
    status: "Vô hiệu",
  },
];
export default function Home() {
  return (
    <div className="w-[100%] h-screen flex flex-col justify-start">
      <SMHeader>
        <div>
          <h3 className="text-title-small text-white font-semibold tracking-widest">
            Giáo viên
          </h3>
        </div>
      </SMHeader>
      <div className="w-full h-fit flex flex-col justify-center items-center px-[2vw] pt-[5vh]">
        <TeacherTable teachers={teacherData} />
      </div>
    </div>
  );
}
