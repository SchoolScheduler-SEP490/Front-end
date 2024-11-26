import { TEACHER_SIDENAV } from "@/app/(school-manager)/_utils/contants";
import { Tab, Tabs } from "@mui/material";
import React from "react";

interface TeacherSidenavProps {
  activeTab: number;
  handleTabChange: (event: React.SyntheticEvent, newValue: number) => void;
}

export default function TeacherSidenav({ activeTab, handleTabChange }: TeacherSidenavProps) {
  return (
    <div className="w-full border-b bg-white fixed top-16 z-10">
      <Tabs
        orientation="horizontal"
        variant="fullWidth"
        value={activeTab}
        onChange={handleTabChange}
        sx={{
          width: '84%',
          '& .MuiTab-root': {
            alignItems: 'center',
            textAlign: 'center',
            color: 'var(--basic-gray)',
            fontSize: '14px',
            fontWeight: 400,
            textTransform: 'none',
            '&.Mui-selected': {
              color: 'var(--primary-normal-active)',
              fontWeight: 600
            }
          },
          '& .MuiTabs-indicator': {
            backgroundColor: 'var(--primary-normal)'
          }
        }}
      >
        {TEACHER_SIDENAV.map((item, index) => (
          <Tab 
            key={index} 
            label={item.name}
            className="text-body-medium"
          />
        ))}
      </Tabs>
    </div>
  );
}
