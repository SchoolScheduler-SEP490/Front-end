import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import * as XLSX from 'xlsx';
import { IScheduleResponse } from '@/utils/constants';
import { ISubjectResponse } from '@/app/(school-manager)/department-management/_libs/constants';
import { ITeacherResponse } from '../../_libs/constants';
import { Label } from '@mui/icons-material';
import ContainedButton from '@/commons/button-contained';

interface ExportDialogProps {
  open: boolean;
  onClose: () => void;
  scheduleData: IScheduleResponse | null;
  subjectData: ISubjectResponse[];
  teacherData: ITeacherResponse[];
}

const ExportDialog: React.FC<ExportDialogProps> = ({
  open,
  onClose,
  scheduleData,
  subjectData,
  teacherData,
}) => {
  const [selectedOption, setSelectedOption] = useState('school');
  const [exportSubjectBy, setExportSubjectBy] = useState<'name' | 'abbreviation'>('name'); // Lựa chọn xuất môn học

  // Hàm tìm subject-name hoặc abbreviation
  const getSubjectDisplay = (abbreviation: string) => {
    const subject = subjectData.find((s) => s.abbreviation === abbreviation);
    return exportSubjectBy === 'name' ? subject?.['subject-name'] || abbreviation : abbreviation;
  };


  const handleExport = () => {
    if (!scheduleData) {
      alert('Không có dữ liệu để xuất!');
      return;
    }

    const workbook = XLSX.utils.book_new();

    if (selectedOption === 'school') {
      const exportData: any[] = [['Tiết / Lớp']];
      scheduleData['class-schedules'].forEach((classSchedule) =>
        exportData[0].push(classSchedule['student-class-name'])
      );

      for (let periodIndex = 1; periodIndex <= 60; periodIndex++) {
        const row = [`Tiết ${periodIndex}`];
        scheduleData['class-schedules'].forEach((classSchedule) => {
          const period = classSchedule['class-periods'].find((p) => p['start-at'] === periodIndex);
          row.push(
            period
              ? `${getSubjectDisplay(period['subject-abbreviation'])} - ${
                  period['teacher-abbreviation']
                }`
              : '-'
          );
        });
        exportData.push(row);
      }

      const sheet = XLSX.utils.aoa_to_sheet(exportData);
      XLSX.utils.book_append_sheet(workbook, sheet, 'Toàn trường');
    }

    if (selectedOption === 'teacher') {
      const teacherSchedules = new Map();

      scheduleData['class-schedules'].forEach((classSchedule) => {
        classSchedule['class-periods'].forEach((period) => {
          const teacher = period['teacher-abbreviation'];
          if (!teacherSchedules.has(teacher)) {
            teacherSchedules.set(teacher, []);
          }
          teacherSchedules.get(teacher).push({
            ...period,
            className: classSchedule['student-class-name'],
          });
        });
      });

      teacherSchedules.forEach((periods, teacherAbbreviation) => {
        const exportData: any[] = [['Tiết', 'Lớp', 'Môn']];
        periods.forEach((period: any) => {
          exportData.push([
            `Tiết ${period['start-at']}`,
            period.className,
            getSubjectDisplay(period['subject-abbreviation']),
          ]);
        });

        const sheet = XLSX.utils.aoa_to_sheet(exportData);
        XLSX.utils.book_append_sheet(workbook, sheet, teacherAbbreviation);
      });
    }

    if (selectedOption === 'class') {
      scheduleData['class-schedules'].forEach((classSchedule) => {
        const exportData: any[] = [['Tiết', 'Môn', 'Giáo viên']];
        for (let periodIndex = 1; periodIndex <= 60; periodIndex++) {
          const period = classSchedule['class-periods'].find((p) => p['start-at'] === periodIndex);
          exportData.push([
            `Tiết ${periodIndex}`,
            period ? getSubjectDisplay(period['subject-abbreviation']) : '-',
            period ? period['teacher-abbreviation'] : '',
          ]);
        }

        const sheet = XLSX.utils.aoa_to_sheet(exportData);
        XLSX.utils.book_append_sheet(workbook, sheet, classSchedule['student-class-name']);
      });
    }

    XLSX.writeFile(workbook, `ThoiKhoaBieu_${selectedOption}_Schedulify.xlsx`);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <div className="w-full h-fit flex flex-row justify-between items-center bg-primary-50 p-3">
        <Typography
          variant="h6"
          component="h2"
          className="text-title-medium-strong font-normal opacity-60"
        >
          Xuất TKB
        </Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </div>
      <DialogContent>
        <FormControl fullWidth className="mb-8">
          <Typography className='font-semibold mb-2'>Chọn kiểu xuất</Typography>
          <Select
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
          >
            <MenuItem value="school">Xuất thời khóa biểu toàn trường</MenuItem>
            <MenuItem value="teacher">
              Xuất thời khóa biểu theo giáo viên (mỗi giáo viên một sheet)
            </MenuItem>
            <MenuItem value="class">
              Xuất thời khóa biểu theo lớp học (mỗi lớp một sheet)
            </MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth className="mb-4">
        <Typography className='font-semibold mb-2'>Hiển thị môn học</Typography>
          <Select
            value={exportSubjectBy}
            onChange={(e) => setExportSubjectBy(e.target.value as 'name' | 'abbreviation')}
          >
            <MenuItem value="name">Môn học theo tên</MenuItem>
            <MenuItem value="abbreviation">Môn học theo mã</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <div className="w-full flex flex-row justify-end items-center gap-2 bg-basic-gray-hover p-3">
        <ContainedButton
          title="Xuất TKB"
          disableRipple
          disabled={!scheduleData}
          type="submit"
          styles="bg-primary-300 text-white !py-1 px-4"
          onClick={handleExport}
        />
        
        <ContainedButton
          title="Huỷ"
          onClick={onClose}
          disableRipple
          styles="!bg-basic-gray-active !text-basic-gray !py-1 px-4"
        />
      </div>
    </Dialog>
  );
};

export default ExportDialog;
