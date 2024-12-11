"use client";
import { IJWTTokenPayload } from "@/app/(auth)/_utils/constants";
import { IDropdownOption } from "@/app/(school-manager)/_utils/contants";
import { useNotification } from "@/app/(school-manager)/notification/_hooks/useNotification";
import "@/commons/styles/sm_header.css";
import { useAppContext } from "@/context/app_provider";
import {
  ITeacherState,
  setTeacherInfo,
  toggleMenu,
} from "@/context/slice_teacher";
import useFetchSchoolYear from "@/hooks/useFetchSchoolYear";
import { useTeacherDispatch, useTeacherSelector } from "@/hooks/useReduxStore";
import { ISchoolYearResponse } from "@/utils/constants";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {
  IconButton,
  Menu,
  MenuItem,
  styled,
  Tab,
  Tabs,
  Tooltip,
  tooltipClasses,
  TooltipProps,
} from "@mui/material";
import { jwtDecode } from "jwt-decode";
import Image from "next/image";
import { ReactNode, useEffect, useState } from "react";

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

const StyledTabs = styled(Tabs)({
  "& .MuiTabs-indicator": {
    display: "none",
  },
  "& .MuiTab-root": {
    padding: 0,
    color: "var(--basic-gray)",
    fontSize: "var(--font-size-12)",
    fontWeight: 400,
    textTransform: "none",
    alignItems: "flex-start",
    textAlign: "left",
    minWidth: "fit-content",
    marginRight: "16px",
    "&:hover": {
      backgroundColor: "transparent",
      color: "var(--primary-normal-hover)",
    },
  },
  "& .Mui-selected": {
    color: "var(--primary-normal-active) !important",
    fontWeight: "bold",
    backgroundColor: "transparent",
  },
});

const TeacherHeader = ({ children }: { children: ReactNode }) => {
  const {
    selectedSchoolYearId,
    setSelectedSchoolYearId,
    userRole,
    sessionToken,
    schoolId,
  } = useAppContext();
  const [selectedSchoolYear, setSelectedSchoolYear] =
    useState<IDropdownOption<number> | null>(null);
  const [schoolYearOptions, setSchoolYearIdOptions] = useState<
    IDropdownOption<number>[]
  >([]);
  const { data, mutate } = useFetchSchoolYear({ includePrivate: true });
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const userData: IJWTTokenPayload = jwtDecode(sessionToken);
  const { isMenuOpen }: ITeacherState = useTeacherSelector(
    (state) => state.teacher
  );
  const dispatch = useTeacherDispatch();
  const { teacherInfo }: ITeacherState = useTeacherSelector(
    (state) => state.teacher
  );

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleToggleMenu = () => {
    dispatch(toggleMenu());
  };

  const handleUpdateYear = async (selectedId: number) => {
    setAnchorEl(null);
    const res = await fetch("/api/school", {
      method: "POST",
      body: JSON.stringify({ schoolYearId: selectedId }),
    });
    if (res.status === 200) {
      setSelectedSchoolYearId(selectedId);
      setSelectedSchoolYear(
        schoolYearOptions.find((item) => item.value === selectedId) ?? null
      );
    }
  };

  useEffect(() => {
    if (data?.status === 200) {
      const options: IDropdownOption<number>[] = data.result.map(
        (item: ISchoolYearResponse) => {
          const currentYear = new Date().getFullYear();
          if (
            parseInt(item["start-year"]) <= currentYear &&
            parseInt(item["end-year"]) >= currentYear &&
            !selectedSchoolYearId
          ) {
            handleUpdateYear(item.id);
          }
          if (item.id === selectedSchoolYearId) {
            setSelectedSchoolYear({
              label: `${item["start-year"]} - ${item["end-year"]}`,
              value: item.id,
            } as IDropdownOption<number>);
          }
          return {
            label: `${item["start-year"]} - ${item["end-year"]}`,
            value: item.id,
          } as IDropdownOption<number>;
        }
      );
      setSchoolYearIdOptions(
        options.sort((a, b) => a.label.localeCompare(b.label))
      );
    }
  }, [data, selectedSchoolYearId]);

  useEffect(() => {
    const storedTeacherInfo = localStorage.getItem('teacherInfo');
    if (storedTeacherInfo) {
      dispatch(setTeacherInfo(JSON.parse(storedTeacherInfo)));
    } else {
      // Get email from JWT token
      const token = sessionToken;
      if (token) {
        const decodedToken: any = jwtDecode(token);
        const teacherEmail = decodedToken.email;
        
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/schools/${schoolId}/teachers/${teacherEmail}/info`, {
          headers: {
            Authorization: `Bearer ${sessionToken}`,
          },
        })
        .then(res => res.json())
        .then(data => {
          if (data.status === 200) {
            localStorage.setItem('teacherInfo', JSON.stringify(data.result));
            dispatch(setTeacherInfo(data.result));
          }
        });
      }
    }
  }, [sessionToken, schoolId]);

  useEffect(() => {
    const storedTeacherInfo = localStorage.getItem('teacherInfo');
    if (storedTeacherInfo && !teacherInfo) {
      dispatch(setTeacherInfo(JSON.parse(storedTeacherInfo)));
    }
  }, []);


  return (
    <div className="w-full min-h-[50px] bg-primary-500 flex flex-row justify-between items-center pl-[1.5vw] pr-2">
      <div className="w-fit h-full flex flex-row justify-start items-center gap-5">
        <LightTooltip
          title={!isMenuOpen ? "Thu gọn Menu" : "Mở rộng menu"}
          placement="bottom"
          arrow
        >
          <label className="select-none">
            <div className="w-9 h-10 cursor-pointer flex flex-col items-center justify-center">
              <input
                className="hidden peer"
                type="checkbox"
                checked={!isMenuOpen}
                onClick={handleToggleMenu}
              />
              <div className="w-[50%] h-[2px] bg-white rounded-sm transition-all duration-300 origin-left translate-y-[0.45rem] peer-checked:rotate-[-45deg]" />
              <div className="w-[50%] h-[2px] bg-white rounded-md transition-all duration-300 origin-center peer-checked:hidden" />
              <div className="w-[50%] h-[2px] bg-white rounded-md transition-all duration-300 origin-left -translate-y-[0.45rem] peer-checked:rotate-[45deg]" />
            </div>
          </label>
        </LightTooltip>
        {children}
      </div>
      <div className="flex flex-row justify-end items-center gap-3">
        <div className="w-fit h-full flex flex-col justify-between items-end text-white pr-3">
          <div className="text-body-medium font-medium leading-4 pr-1">
            {teacherInfo
              ? `${teacherInfo["first-name"]} ${teacherInfo["last-name"]}`
              : userRole}
          </div>
          <div
            className="text-[0.75rem] leading-4 opacity-80 flex flex-row justify-between items-center cursor-pointer"
            id="basic-button"
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
          >
            {selectedSchoolYear?.label}
            <KeyboardArrowDownIcon sx={{ fontSize: 20 }} />
          </div>
        </div>

        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          {schoolYearOptions.map((option, index) => (
            <MenuItem
              key={option.label + index}
              onClick={() => handleUpdateYear(option.value)}
              sx={
                option.value === selectedSchoolYearId
                  ? { backgroundColor: "#E0E0E0" }
                  : undefined
              }
            >
              {option.label}
            </MenuItem>
          ))}
        </Menu>
      </div>
    </div>
  );
};

export default TeacherHeader;
