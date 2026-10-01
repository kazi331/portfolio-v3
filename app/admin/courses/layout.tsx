import React from 'react';

export default function CoursesLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal?: React.ReactNode;
}) {
  return (
    <div className="relative">
      {children}
      {modal}
    </div>
  );
}
