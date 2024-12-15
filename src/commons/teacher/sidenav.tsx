"use client";

import {
  TEACHER_SIDENAV,
  ITeacherNavigation,
} from "@/app/(teacher)/_utils/constants";
import { Collapse } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import "../styles/teacher_sidenav.css";
import { useAppContext } from "@/context/app_provider";
import { ITeacherInfo, ITeacherState, setTeacherInfo } from "@/context/slice_teacher";
import { useTeacherDispatch, useTeacherSelector } from "@/hooks/useReduxStore";

const TeacherSidenav = () => {
  const currentPath = usePathname();
  const router = useRouter();
  const dispatch = useTeacherDispatch();
  const { isMenuOpen }: ITeacherState = useTeacherSelector(
    (state) => state.teacher
  );

  const { logout } = useAppContext();

  const handleLogout = async () => {
    dispatch(setTeacherInfo({} as ITeacherInfo));
    await logout();
  };

  const handleNavigate = (url: string) => {
    router.push(url);
  };

  return (
    <Collapse
      in={!isMenuOpen}
      timeout={300}
      unmountOnExit
      orientation="horizontal"
      sx={{ width: "16vw", height: "100vh", margin: 0, padding: 0 }}
    >
      <div className="relative w-[16vw] h-full flex flex-col justify-start items-start gap-5 bg-white border-r-1 border-gray-400">
        <div className="absolute top-0 left-0 z-10 bg-white w-full min-h-[50px] flex justify-center items-center border-b-1 border-gray-400">
          <Link
            href={"/"}
            className="w-fit h-full text-primary-500 text-title-xl-strong font-bold"
          >
            Schedulify
          </Link>
        </div>
        <div className="w-full h-fit pb-[70px] pt-[50px] flex flex-col justify-start items-center overflow-y-scroll no-scrollbar">
          <div className="w-full h-full p-3">
            {TEACHER_SIDENAV.map((item: ITeacherNavigation, index: number) => (
              <div
                key={item.name}
                className={`w-[100%] h-fit flex flex-row justify-start items-center py-3 pl-4 pr-2 gap-3 rounded-[3px] hover:cursor-pointer 
          ${
            currentPath.startsWith(item.url)
              ? "bg-basic-gray-active "
              : "hover:bg-basic-gray-hover"
          }`}
                onClick={() => handleNavigate(item.url)}
              >
                <Image
                  className={`opacity-60`}
                  src={item.icon}
                  alt="sidebar-icon"
                  unoptimized={true}
                  width={23}
                  height={23}
                />
                <p
                  className={`text-body-medium font-normal select-none ${
                    currentPath.startsWith(item.url) ? " !font-semibold" : ""
                  }`}
                >
                  {item.name}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute bottom-0 right-0 w-full h-fit flex justify-center items-center bg-white py-3">
          <button
            className="w-[60%] logout-btn text-center font-semibold text-body-medium"
            onClick={handleLogout}
          >
            ĐĂNG XUẤT
          </button>
        </div>
      </div>
    </Collapse>
  );
};

export default TeacherSidenav;
