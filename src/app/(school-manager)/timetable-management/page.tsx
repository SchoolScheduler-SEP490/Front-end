"use client";

import SMHeader from "@/commons/school_manager/header";
import { Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { toggleMenu } from "@/context/slice_school_manager";
import TimetableTable from "./_components/timetable_table";
import { styled } from "@mui/material/styles";
import Tooltip, { tooltipClasses, TooltipProps } from "@mui/material/Tooltip";
import { ITimetableTableData } from "./_libs/constants";
import { firestore } from '@/utils/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { useEffect, useState } from "react";
import LoadingComponent from "@/commons/loading";
const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.white,
    color: "rgba(0, 0, 0, 0.87)",
    boxShadow: theme.shadows[1],
    fontSize: 13,
  },
}));

//   {
//     id: 1,
//     timetableCode: "T01",
//     timetableName: "Thời khóa biểu 1",
//     appliedDate: "2022-09-01",
//     endDate: "2022-09-30",
//     fitness: 100,
//     status: "Công bố",
//   },
//   {
//     id: 2,
//     timetableCode: "T02",
//     timetableName: "Thời khóa biểu 2",
//     appliedDate: "2022-09-01",
//     endDate: "2022-09-30",
//     fitness: 60,
//     status: "Chờ duyệt",
//   },
//   {
//     id: 3,
//     timetableCode: "T03",
//     timetableName: "Thời khóa biểu 3",
//     appliedDate: "2022-09-01",
//     endDate: "2022-09-30",
//     fitness: 80,
//     status: "Chờ duyệt",
//   },
//   {
//     id: 4,
//     timetableCode: "T04",
//     timetableName: "Thời khóa biểu 3",
//     appliedDate: "2022-09-01",
//     endDate: "2022-09-30",
//     fitness: 50,
//     status: "Vô hiệu",
//   },
//   {
//     id: 5,
//     timetableCode: "T05",
//     timetableName: "Thời khóa biểu 3",
//     appliedDate: "2022-09-01",
//     endDate: "2022-09-30",
//     fitness: 95,
//     status: "Vô hiệu",
//   },
//   {
//     id: 6,
//     timetableCode: "T06",
//     timetableName: "Thời khóa biểu 3",
//     appliedDate: "2022-09-01",
//     endDate: "2022-09-30",
//     fitness: 69,
//     status: "Vô hiệu",
//   },
// ];

export default function TimetableManagement() {
  const router = useRouter();
  const isMenuOpen = useSelector(
    (state: any) => state.schoolManager.isMenuOpen
  );
  const dispatch = useDispatch();
  const [timetableData, setTimetableData] = useState<ITimetableTableData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTimetables = async () => {
        try {
            const timetablesRef = collection(firestore, 'timetables');
            const snapshot = await getDocs(timetablesRef);
            const timetables = snapshot.docs.map((doc, index) => {
                const data = doc.data();
                return {
                    id: index + 1,
                    timetableCode: data['timetable-abbreviation'],
                    timetableName: data['timetable-name'],
                    appliedWeek: data['applied-week'],
                    endedWeek: data['ended-week'],
                    status: data['status'],
                    termName: data['term-name'],
                    yearName: data['year-name']
                };
            }) as ITimetableTableData[];
            
            setTimetableData(timetables);
        } catch (error) {
            console.error('Error fetching timetables:', error);
        } finally {
            setLoading(false);
        }
    };

    fetchTimetables();
}, []);


  const handleGenerateTimetable = () => {
    if (!isMenuOpen) {
      dispatch(toggleMenu());
    }
    router.push("timetable-generation");
  };

  return (
    <div
      className={`relative w-[${
        !isMenuOpen ? "84" : "100"
      }%] h-screen flex flex-col justify-start items-start`}
    >
      <SMHeader>
        <div>
          <h3 className="text-title-small text-white font-medium tracking-wider">
            Thời khóa biểu
          </h3>
        </div>
      </SMHeader>
      <div className="w-full h-fit flex flex-col justify-center items-center px-[8vw] pt-[5vh]">
        {loading ? (
          <LoadingComponent
            loadingStatus = {true}
          />
        ) : (
        <TimetableTable data={timetableData} />
        )}
      </div>
      <div className="absolute w-fit h-fit overflow-visible bottom-[3vw] right-[3vw]">
        <LightTooltip title="Tạo Thời khóa biểu" placement="top" arrow>
          <Fab
            color="primary"
            aria-label="add"
            onClick={handleGenerateTimetable}
          >
            <AddIcon color="inherit" sx={{ color: "white" }} />
          </Fab>
        </LightTooltip>
      </div>
    </div>
  );
}
