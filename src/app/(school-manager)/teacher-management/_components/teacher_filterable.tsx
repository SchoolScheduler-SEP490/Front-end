import { IDepartment } from "../_libs/constants";
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
import CloseIcon from "@mui/icons-material/Close";

interface TeacherFilterableProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedDepartment: number | null;
  setSelectedDepartment: (departmentId: number | null) => void;
  departments: IDepartment[];
  mutate: () => void;
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
      scrollbars: "none",
    },
  },
};

const TeacherFilterable = (props: TeacherFilterableProps) => {
  const { open, setOpen, selectedDepartment, setSelectedDepartment, departments } = props;

  const handleDepartmentSelect = (event: SelectChangeEvent<number | string>) => {
    const value = event.target.value;
    setSelectedDepartment(value === 'all' ? null : Number(value));
  };

  return (
    <div className={`h-full w-[23%] flex flex-col justify-start items-center ${
      open ? "visible animate-fade-left animate-once animate-duration-500 animate-ease-out" : "hidden"
    }`}>
      <Paper className="w-full p-3 flex flex-col justify-start items-center gap-3">
        <div className="w-full flex flex-row justify-between items-center pt-1">
          <Typography variant="h6" className="text-title-small-strong font-normal w-full text-left">
            Bộ lọc
          </Typography>
          <IconButton onClick={() => setOpen(false)} className="translate-x-2">
            <CloseIcon />
          </IconButton>
        </div>
        <FormControl fullWidth variant="filled" sx={{ m: 1, minWidth: 120 }}>
          <InputLabel className="!text-body-xlarge font-normal">
            Tổ bộ môn
          </InputLabel>
          <Select
            value={selectedDepartment === null ? 'all' : selectedDepartment}
            onChange={handleDepartmentSelect}
            MenuProps={MenuProps}
          >
            <MenuItem value="all">Tất cả tổ bộ môn</MenuItem>
            {departments.map((dept) => (
              <MenuItem key={dept.id} value={dept.id}>
                {dept.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Paper>
    </div>
  );
};

export default TeacherFilterable;
