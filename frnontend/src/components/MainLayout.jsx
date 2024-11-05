import React from 'react'
import { Outlet } from 'react-router-dom'
import LeftSidebar from './LeftSidebar'

const MainLayout = () => {
  return (
    <div className="flex w-full h-full min-h-screen ">
      <LeftSidebar />
      <div className="flex-1 flex justify-center overflow-y-auto ">
        <Outlet />
      </div>
    </div>
  )
}

export default MainLayout
