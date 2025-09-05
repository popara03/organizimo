import React from 'react'
import Sidebar from '@/components/custom/sidebar'
import {Input} from '@/components/ui/input'
import {Button} from '@/components/ui/button'

const AdminGroup = () => {
  return (
    <div>
        <Sidebar/>
        
        <div className='px-4 ps-12'>
            <h1 className='font-jersey !text-2xl'>Groups</h1>

            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                <Input placeholder="Search" className="w-full md:w-50" />
                <Button className="text-secondary">Create new</Button>
            </div>

            <div className="">

            </div>
        </div>
    </div>
  )
}

export default AdminGroup