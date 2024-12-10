"use client";
import { IDropdownOption } from "@/app/(school-manager)/_utils/contants";
import { useNotification } from "@/app/(school-manager)/notification/_hooks/useNotification";
import "@/commons/styles/sm_header.css";
import { useAppContext } from "@/context/app_provider";
import { toggleMenu } from "@/context/slice_school_manager";
import useFetchSchoolYear from "@/hooks/useFetchSchoolYear";
import { ISchoolYearResponse } from "@/utils/constants";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {
  IconButton,
  Menu,
  MenuItem,
  styled,
  Tooltip,
  tooltipClasses,
  TooltipProps,
  Tabs,
  Tab,
} from "@mui/material";
import Image from "next/image";
import { ReactNode, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

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

const SMHeader = ({ children }: { children: ReactNode }) => {
  const { schoolName, selectedSchoolYearId, setSelectedSchoolYearId } =
    useAppContext();
  const [selectedSchoolYear, setSelectedSchoolYear] =
    useState<IDropdownOption<number> | null>(null);
  const [schoolYearOptions, setSchoolYearIdOptions] = useState<
    IDropdownOption<number>[]
  >([]);
  const { data, mutate } = useFetchSchoolYear({ includePrivate: false });
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [activeTab, setActiveTab] = useState(0);
  const {
    notifications,
    unreadCount,
    markAsRead,
    fetchUnreadCount,
    markAllAsRead,
  } = useNotification();
  const [showNotifications, setShowNotifications] = useState(false);
  const isMenuOpen: boolean = useSelector(
    (state: any) => state.schoolManager.isMenuOpen
  );
  const dispatch = useDispatch();

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
    fetchUnreadCount();
  }, [notifications]);

  const filteredNotifications =
    activeTab === 0
      ? notifications.filter(
          (notification) =>
            new Date(notification["create-date"]).toDateString() ===
            new Date().toDateString()
        )
      : notifications.filter(
          (notification) =>
            new Date(notification["create-date"]).toDateString() !==
            new Date().toDateString()
        );

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <div className="w-full min-h-[50px] bg-primary-400 flex flex-row justify-between items-center pl-[1.5vw] pr-2">
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
        <div className="relative">
          <IconButton
            color="primary"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <div className="relative">
              <Image
                src="/images/icons/notification-bell.png"
                alt="notification-icon"
                unoptimized={true}
                width={20}
                height={20}
              />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">
                {unreadCount}
              </span>
            </div>
          </IconButton>

          {showNotifications && (
            <div className="absolute right-0 top-12 min-w-96 bg-white rounded-lg shadow-lg z-[1000] max-h-96 overflow-y-auto no-scrollbar ">
              <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <h5 className="text-lg font-semibold">Thông báo</h5>
                </div>
                <div className="flex justify-between items-center">
                  <StyledTabs
                    value={activeTab}
                    onChange={(_, newValue) => setActiveTab(newValue)}
                  >
                    <Tab label="Tất cả" disableRipple />
                    <Tab label="Chưa đọc" disableRipple />
                  </StyledTabs>
                  <button
                    onClick={markAllAsRead}
                    className="text-sm text-primary-300 hover:text-primary-500 hover:font-semibold flex items-center gap-1 whitespace-nowrap"
                  >
                    <Image
                      src="/images/icons/double-tick.png"
                      alt="double-tick"
                      width={16}
                      height={16}
                      unoptimized={true}
                    />
                    Đánh dấu tất cả
                  </button>
                </div>
                {notifications.length > 0 ? (
                  notifications.map((notification, index) => (
                    <div
                      key={index}
                      className={`p-3 border-b cursor-pointer hover:bg-gray-50 ${
                        !notification["is-read"] ? "bg-blue-50" : ""
                      }`}
                      onClick={() => {
                        markAsRead(notification["notification-url"]);
                        if (notification.link) {
                          window.location.href = notification.link;
                        }
                      }}
                    >
                      <div className="font-medium">{notification.title}</div>
                      <div className="text-sm text-gray-600">
                        {notification.message}
                      </div>
                      <div className="text-xs text-gray-400 mt-2 flex justify-between items-center">
                        <span>
                          {new Date(
                            notification["create-date"]
                          ).toLocaleDateString("vi-VN", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                          })}
                        </span>
                        <span>
                          {new Date(
                            notification["create-date"]
                          ).toLocaleTimeString("vi-VN", {
                            hour12: false,
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 py-4">
                    Không có thông báo !
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="w-fit h-full flex flex-col justify-between items-end text-white pr-3">
          <h3 className="text-body-medium font-medium leading-4 pr-1">
            {schoolName}
          </h3>
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
    </div>
  );
};

export default SMHeader;
