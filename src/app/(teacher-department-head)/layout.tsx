'use client';

import TeacherHeadSidenav from '@/commons/teacher_department_head/sidenav';
import { useAppContext } from '@/context/app_provider';
import { teacherHeadStore } from '@/context/store_teacher_head';
import { notFound } from 'next/navigation';
import { Provider } from 'react-redux';

export default function TeacherLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { userRole } = useAppContext();
  
  console.log("Teacher Head Layout userRole:", userRole); // Debug log

  if ((userRole?.toLowerCase() ?? '') !== 'teacherdepartmenthead') {
    notFound();
  }

  return (
    <Provider store={teacherHeadStore}>
      <section className='w-screen h-fit min-h-screen flex flex-row justify-start items-start overflow-y-hidden'>
        <TeacherHeadSidenav />
        {children}
      </section>
    </Provider>
  );
}
