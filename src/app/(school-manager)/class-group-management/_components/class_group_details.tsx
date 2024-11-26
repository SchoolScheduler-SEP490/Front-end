import { useAppContext } from "@/context/app_provider";
import { useEffect, useState } from "react";
import { IClassGroupDetail, ICurriculum } from "../_libs/constants";
import { getClassGroupById, getCurriculum } from "../_libs/apiClassGroup";
import { Divider, IconButton, Skeleton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface IClassGroupDetailsProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  classGroupId: number;
}

const ClassGroupDetails = (props: IClassGroupDetailsProps) => {
  const { open, setOpen, classGroupId } = props;
  const { sessionToken, schoolId, selectedSchoolYearId } = useAppContext();
  const [classGroupDetails, setClassGroupDetails] =
    useState<IClassGroupDetail | null>(null);
  const [curriculums, setCurriculums] = useState<ICurriculum[]>([]);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const data = await getClassGroupById(
          classGroupId,
          schoolId,
          selectedSchoolYearId,
          sessionToken
        );
        setClassGroupDetails(data);
      } catch (error) {
        console.log("Failed to fetch class group details:", error);
      }
    };
    if (open && classGroupId) {
      fetchDetails();
    }
  }, [open, classGroupId, schoolId, selectedSchoolYearId, sessionToken]);

  useEffect(() => {
    const fetchCurriculums = async () => {
      try {
        const response = await getCurriculum(
          sessionToken,
          schoolId,
          selectedSchoolYearId
        );
        if (response.status === 200) {
          setCurriculums(response.result.items);
        }
      } catch (error) {
        console.error("Failed to fetch curriculums:", error);
      }
    };
    fetchCurriculums();
  }, [sessionToken, schoolId, selectedSchoolYearId]);

  const handleClose = () => {
    setOpen(false);
  };


  const curriculumName = curriculums.find((c) => c.id === classGroupDetails?.["curriculum-id"])?.[
    "curriculum-name"
  ] || "Chưa có dữ liệu";  

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
          Thông tin nhóm lớp
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
          <h4 className="text-body-small text-basic-gray">Tên nhóm lớp</h4>
          {classGroupDetails?.["group-name"] ? (
            <h2 className="text-body-large-strong">
              {classGroupDetails?.["group-name"]}
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
          <h4 className="text-body-small text-basic-gray">Mã nhóm lớp</h4>
          {classGroupDetails?.["student-class-group-code"] ? (
            <h2 className="text-body-large-strong">
              {classGroupDetails?.["student-class-group-code"]}
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
          <h4 className="text-body-small text-basic-gray">
            Khung chương trình
          </h4>
          {classGroupDetails? (
            <h2 className="text-body-large-strong">
            {curriculumName}
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
          <h4 className="text-body-small text-basic-gray">Mô tả</h4>
          {classGroupDetails?.["group-description"] ? (
            <h2 className="text-body-large-strong">
              {classGroupDetails?.["group-description"]}
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
          {classGroupDetails ? (
            classGroupDetails.classes.map((classItem) => (
              <h2 key={classItem.id} className="text-body-large-strong">
                {classItem.name}
              </h2>
            ))
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
export default ClassGroupDetails;
