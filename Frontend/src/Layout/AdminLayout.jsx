import React from 'react';
import Sidebar from '../Admin/SideBar/Sidebar';

const AdminLayout = ({ children }) => {
  return (
    <Sidebar>
      {children}
    </Sidebar>
  );
};

export default AdminLayout;
