import { Link } from '@inertiajs/react'
import { useState } from 'react'

type SidebarGroup = {
    id: number;
    href?: string;
    name: string;
    color: string;
};

// Admin sidebar tabs
const sidebarAdminTabs: SidebarGroup[] = [
  { id: 1, href: "/admin/groups", name: "Groups", color: "#9EB41D" },
  { id: 2, href: "/admin/users", name: "Users", color: "#369AC3" },
];

const Sidebar = ({groupList} : {groupList?: SidebarGroup[]}) => {
    const [isCollapsed, setIsCollapsed] = useState<boolean>(true)

    const links = groupList?.length ? groupList : sidebarAdminTabs; 

    return (
    <div
    onMouseEnter={() => setIsCollapsed(false)}
    onMouseLeave={() => setIsCollapsed(true)}
    className={`fixed top-[60px] left-0 max-w-48 ${isCollapsed ? "w-8" : "w-full"} h-[calc(100vh-60px)] bg-primary flex flex-col ease-in-out duration-300 overflow-hidden`}
    >
      {links.map((item) => (
        <Link
          key={item.id}
          href={item.href ? item.href : `/dashboard?group=${item.id}`}
          className="block w-full h-fit ps-8 pe-4 py-2 text-secondary font-semibold"
          style={{ backgroundColor: item.color }}
        >
          {item.name}
        </Link>
      ))}
    </div>
  )
}

export default Sidebar