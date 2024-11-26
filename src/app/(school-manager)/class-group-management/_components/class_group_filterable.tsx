import { CLASSGROUP_STRING_TYPE } from "@/utils/constants";
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
import { KeyedMutator } from "swr";
import CloseIcon from "@mui/icons-material/Close";

interface IClassGroupFilterableProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedGrade: number | null;
  setSelectedGrade: (grade: number | null) => void;
  mutate: KeyedMutator<any>;
}

const ClassGroupFilterable = (props: IClassGroupFilterableProps) => {
  const { open, setOpen, selectedGrade, setSelectedGrade, mutate } = props;

  const handleGradeSelect = (event: SelectChangeEvent<number | string>) => {
    const value = event.target.value;
    if (value === 'all') {
      setSelectedGrade(null);
      // mutate(); 
    } else {
      setSelectedGrade(Number(value));
    }
  };
  
  const handleClose = () => {
    setOpen(false);
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
            Khối
          </InputLabel>

          <Select
            labelId="demo-simple-select-filled-label"
            id="demo-simple-select-filled"
            value={selectedGrade === null ? 'all' : selectedGrade}
            onChange={handleGradeSelect}
          >
            <MenuItem value="all">Tất cả khối</MenuItem>
            {CLASSGROUP_STRING_TYPE.map((grade) => (
              <MenuItem key={grade.key} value={grade.value}>
                {grade.key}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Paper>
    </div>
  );
};
export default ClassGroupFilterable;
