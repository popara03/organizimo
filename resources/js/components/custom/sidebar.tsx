import { Link } from '@inertiajs/react'
import { useState } from 'react'

export type SidebarElement = {
    id: number;
    href?: string;
    name: string;
    color: string;
};

const Sidebar = ({data} : {data: SidebarElement[]}) => {
    const [isCollapsed, setIsCollapsed] = useState<boolean>(true)

    return (
    <div
    onMouseEnter={() => setIsCollapsed(false)}
    onMouseLeave={() => setIsCollapsed(true)}
    className={`fixed top-[60px] left-0 max-w-48 ${isCollapsed ? "w-8" : "w-full"} h-[calc(100vh-60px)] bg-primary flex flex-col ease-in-out duration-300 overflow-x-hidden overflow-y-auto z-50`}
    >
      {data.length ?
      data.map((item) => (
        <Link
          key={item.id}
          href={item.href ? item.href : `/dashboard?group=${item.id}`}
          className="block w-full h-fit ps-8 pe-4 py-2 text-secondary font-semibold whitespace-pre-line"
          style={{ backgroundColor: item.color }}
        >
          {item.name.replace(/\s+/g, '\n')}
        </Link>
      ))
    : (
      <span className="block w-full h-fit ps-8 pe-4 py-2 text-secondary font-semibold">
        No data available
      </span>
    )}
    </div>
  )
}

export default Sidebar