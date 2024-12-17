import { useAppContext } from "@/context/app_provider";
import { useEffect, useState } from "react";
import {
  ICombineClassDetail,
  ISubject,
  IRoom,
  IStudentClass,
} from "../_libs/constants";
import {
  getCombineClassDetail,
  getSubjectName,
  getRoomName,
} from "../_libs/apiCombineClass";
import { Divider, IconButton, Skeleton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { MAIN_SESSION, MAIN_SESSION_TRANSLATOR } from "@/utils/constants";

interface ICombineClassDetailsProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  combineClassId: number;
}

const CombineClassDetails = (props: ICombineClassDetailsProps) => {
  const { open, setOpen, combineClassId } = props;
  const { sessionToken, schoolId, selectedSchoolYearId } = useAppContext();
  const [combineClassDetails, setCombineClassDetails] =
    useState<ICombineClassDetail | null>(null);
  const [subjectName, setSubjectName] = useState<ISubject[]>([]);
  const [roomName, setRoomName] = useState<IRoom[]>([]);
  const [studentClassName, setStudentCLassName] = useState<IStudentClass[]>([]);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const data = await getCombineClassDetail(
          schoolId,
          combineClassId,
          sessionToken
        );
        setCombineClassDetails(data.result.items[0]);
      } catch (error) {
        console.log("Failed to fetch combine class details:", error);
      }
    };
    if (open && combineClassId) {
      fetchDetails();
    }
  }, [open, combineClassId, schoolId, sessionToken]);

  useEffect(() => {
    const fetchSubjectName = async () => {
      try {
        const data = await getSubjectName(sessionToken, selectedSchoolYearId);
        setSubjectName(data.result.items);
      } catch (error) {
        console.log("Failed to fetch subject details:", error);
      }
    };
    fetchSubjectName();
  }, [open, combineClassId, sessionToken, selectedSchoolYearId]);

  useEffect(() => {
    const fetchRoomName = async () => {
      try {
        const data = await getRoomName(sessionToken, schoolId, 2);
        setRoomName(data.result.items);
      } catch (error) {
        console.log("Failed to fetch subject details:", error);
      }
    };
    fetchRoomName();
  }, [open, combineClassId, sessionToken, selectedSchoolYearId]);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div
      className={`h-full flex flex-col justify-start items-center pt-[2vh] border-l-2 border-basic-gray-active transition-all duration-300 ease-in-out transform
    ${
      open
        ? " w-[30%] translate-x-0 opacity-100"
        : " w-0 translate-x-full opacity-0"
    }`}
    >
      <div className="w-full flex flex-row justify-between items-center pb-1 px-5">
        <Typography
          variant="h6"
          className="text-title-small-strong font-normal w-full text-left"
        >
          Thông tin lớp ghép
        </Typography>
        <IconButton onClick={handleClose} className="translate-x-2">
          <CloseIcon />
        </IconButton>
      </div>
      <Divider
        variant="middle"
        orientation="horizontal"
        sx={{ width: "100%" }}
      />

      <div className="w-full h-fit p-5 flex flex-col justify-start items-start gap-3">
        <div className="w-full flex flex-col justify-start items-start">
          <h4 className="text-body-small text-basic-gray">Mã lớp ghép</h4>
          {combineClassDetails?.["room-subject-code"] ? (
            <h2 className="text-body-large-strong">
              {combineClassDetails["room-subject-code"]}
            </h2>
          ) : (
            <Skeleton
              className="!text-body-large-strong"
              animation="wave"
              variant="text"
              sx={{ width: "50%" }}
            />
          )}
        </div>

        <div className="w-full flex flex-col justify-start items-start">
          <h4 className="text-body-small text-basic-gray">Tên lớp ghép</h4>
          {combineClassDetails?.["room-subject-name"] ? (
            <h2 className="text-body-large-strong">
              {combineClassDetails["room-subject-name"]}
            </h2>
          ) : (
            <Skeleton
              className="!text-body-large-strong"
              animation="wave"
              variant="text"
              sx={{ width: "50%" }}
            />
          )}
        </div>

        <div className="w-full flex flex-col justify-start items-start">
          <h4 className="text-body-small text-basic-gray">Giáo viên</h4>
          {combineClassDetails ? (
            <h2 className="text-body-large-strong">
              {`${combineClassDetails["teacher-first-name"]} ${combineClassDetails["teacher-last-name"]} (${combineClassDetails["teacher-abbreviation"]})`}
            </h2>
          ) : (
            <Skeleton
              className="!text-body-large-strong"
              animation="wave"
              variant="text"
              sx={{ width: "50%" }}
            />
          )}
        </div>

        <div className="w-full flex flex-col justify-start items-start">
          <h4 className="text-body-small text-basic-gray">Buổi học</h4>
          {combineClassDetails?.session ? (
            <h2 className="text-body-large-strong">
              {
                MAIN_SESSION_TRANSLATOR[
                  MAIN_SESSION.find(
                    (s) => s.key === combineClassDetails.session
                  )?.value || 0
                ]
              }
            </h2>
          ) : (
            <Skeleton
              className="!text-body-large-strong"
              animation="wave"
              variant="text"
              sx={{ width: "50%" }}
            />
          )}
        </div>

        <div className="w-full flex flex-col justify-start items-start">
          <h4 className="text-body-small text-basic-gray">Lớp áp dụng</h4>
          {combineClassDetails && combineClassDetails["student-class"] ? (
            combineClassDetails["student-class"].map(
              (classItem: IStudentClass) => (
                <h2 key={classItem.id} className="text-body-large-strong">
                  {classItem["student-class-name"]}
                </h2>
              )
            )
          ) : (
            <Skeleton
              className="!text-body-large-strong"
              animation="wave"
              variant="text"
              sx={{ width: "50%" }}
            />
          )}
        </div>

        <div className="w-full flex flex-col justify-start items-start">
          <h4 className="text-body-small text-basic-gray">Môn học</h4>
          {combineClassDetails ? (
            <h2 className="text-body-large-strong">
              {subjectName?.find(
                (s) => s.id === combineClassDetails["subject-id"]
              )?.["subject-name"] || "Chưa có dữ liệu"}
            </h2>
          ) : (
            <Skeleton
              className="!text-body-large-strong"
              animation="wave"
              variant="text"
              sx={{ width: "50%" }}
            />
          )}
        </div>

        <div className="w-full flex flex-col justify-start items-start">
          <h4 className="text-body-small text-basic-gray">Phòng học</h4>
          {combineClassDetails ? (
            <h2 className="text-body-large-strong">
              {roomName.find((r) => r.id === combineClassDetails["room-id"])
                ?.name || "Chưa có dữ liệu"}
            </h2>
          ) : (
            <Skeleton
              className="!text-body-large-strong"
              animation="wave"
              variant="text"
              sx={{ width: "50%" }}
            />
          )}
        </div>
      </div>
    </div>
  );
};
export default CombineClassDetails;
