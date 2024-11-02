"use client";

import CloseIcon from "@mui/icons-material/Close";
import {
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { KeyedMutator } from "swr";
import { IDropdownOption, ISchoolYear } from "../_libs/constants";
import useGetSchoolYear from "../_hooks/useGetSchoolYear";
import { useAppContext } from "@/context/app_provider";

interface IClassFilterableProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedYearId: number;
  setSelectedYearId: React.Dispatch<React.SetStateAction<number>>;
  mutate?: KeyedMutator<any>;
}

const ClassFilterable = (props: IClassFilterableProps) => {
  const { open, setOpen, selectedYearId, setSelectedYearId } = props;
  const { sessionToken } = useAppContext();
  const { data, error } = useGetSchoolYear(sessionToken);
  const [yearStudyOptions, setYearStudyOptions] = useState<
    IDropdownOption<number>[]
  >([]);

  useEffect(() => {
    if (data?.status === 200) {
      const yearStudyOptions: IDropdownOption<number>[] = data.result.map(
        (item: ISchoolYear) => ({
          value: item.id,
          label: `${item["start-year"]} - ${item["end-year"]}`,
        })
      );
      setYearStudyOptions(yearStudyOptions);
    }
  }, [data]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleYearSelect = (event: SelectChangeEvent<number>) => {
    if (setSelectedYearId) {
      setSelectedYearId(Number(event.target.value));
    }
  };

  return (
    <div
      className={`h-full w-[23%] flex flex-col justify-start items-center pt-[2vh] ${
        open
          ? "visible animate-fade-left animate-once animate-duration-500 animate-ease-out"
          : "hidden"
      }`}
    >
      <Paper className="w-full p-3 flex flex-col justify-start items-center gap-3">
        <div className="w-full flex flex-row justify-between items-center pt-1">
          <Typography
            variant="h6"
            className="text-title-small-strong font-normal w-full text-left"
          >
            Bộ lọc
          </Typography>
          <IconButton onClick={handleClose} className="translate-x-2">
            <CloseIcon />
          </IconButton>
        </div>
        <FormControl fullWidth variant="filled" sx={{ m: 1, minWidth: 120 }}>
          <InputLabel
            id="demo-simple-select-filled-label"
            className="!text-body-xlarge font-normal"
          >
            Năm học
          </InputLabel>
          <Select
            labelId="demo-simple-select-filled-label"
            id="demo-simple-select-filled"
            value={selectedYearId}
            onChange={handleYearSelect}
          >
            {yearStudyOptions.map((item, index) => (
              <MenuItem key={item.value + index} value={item.value}>
                {item.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Paper>
    </div>
  );
};
export default ClassFilterable;
