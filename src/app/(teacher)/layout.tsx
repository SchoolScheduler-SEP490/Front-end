'use client';

import TeacherSidenav from '@/commons/teacher/sidenav';
import { useAppContext } from '@/context/app_provider';
import { teacherStore } from '@/context/store_teacher';
import { notFound } from 'next/navigation';
import { Provider } from 'react-redux';

export default function TeacherLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { userRole } = useAppContext();
  
  console.log("Teacher Layout userRole:", userRole); // Debug log

  if ((userRole?.toLowerCase() ?? '') !== 'teacher') {
    notFound();
  }

  return (
    <Provider store={teacherStore}>
      <section className='w-screen h-fit min-h-screen flex flex-row justify-start items-start overflow-y-hidden'>
        <TeacherSidenav />
        {children}
      </section>
    </Provider>
  );
}
