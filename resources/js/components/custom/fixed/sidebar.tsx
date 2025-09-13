import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react'
import { useState } from 'react'

export type SidebarElement = {
    id: number;
    href?: string;
    name: string;
    color: string;
};

//Sidebar is used for Dashboard page where it shows all groups and serves as a filter. It changes the state in the dashboard page via groupState props.
//On admin dashboard it shows hard codded links to admin sections. The data is passed from the admin layout file.

const Sidebar = ({data, groupState, setGroupState} : {data: SidebarElement[], groupState?: any, setGroupState?: any}) => {
    const [isCollapsed, setIsCollapsed] = useState<boolean>(true)

    return (
    <div
    onMouseEnter={() => setIsCollapsed(false)}
    onMouseLeave={() => setIsCollapsed(true)}
    className={`fixed top-[60px] left-0 max-w-48 ${isCollapsed ? "w-8" : "w-full"} h-[calc(100vh-60px)] bg-primary flex flex-col ease-in-out duration-300 overflow-x-hidden overflow-y-auto z-50`}
    >
      {data.length ?
      data.map((item) => (
        // If href is present, render Link, else render button
        item.href ? (
        <Link
          key={item.id}
          href={item.href}
          className={`block w-full h-fit ps-8 pe-4 py-2 text-secondary font-semibold whitespace-pre-line`}
          style={{ backgroundColor: item.color }}
        >
          {item.name.replace(/\s+/g, '\n')}
        </Link>
        ) : (
          <Button
            key={item.id}
            onClick={() => setGroupState && setGroupState(item.id)}
            className={`block w-full h-fit ps-8 pe-4 py-2 text-secondary font-semibold whitespace-pre-line text-left text-base rounded-none`}
            style={{ backgroundColor: item.color }}
          >
            {item.name.replace(/\s+/g, '\n')}
          </Button>
        ))
      ) : (
      <span className="block w-full h-fit ps-8 pe-4 py-2 text-secondary font-semibold">
        No data available
      </span>
      )}
    </div>
  )
}

export default Sidebar