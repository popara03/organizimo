import React, { useState } from 'react'
import { usePage } from '@inertiajs/react'

import AdminLayout from '@/layouts/admin/adminLayout'

import axios from 'axios'
import { toast } from 'sonner'

import GroupModal from '@/components/custom/admin/GroupModal'
import {Button} from '@/components/ui/button'

import { DataTable } from '@/components/custom/admin/DataTable'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { MoreHorizontal } from 'lucide-react'

const AdminGroup = () => {
  // data
  const globalProps = usePage().props;
  const [groups, setGroups] = useState<any[]>(globalProps.groups as any[]);
  const [users, setUsers] = useState<any[]>(globalProps.users as any[]);

  // modal open flag
  const [isOpen, setIsOpen] = useState(false);

  // edit
  const [groupForEdit, setGroupForEdit] = useState<any>(null);

  // delete
  const handleDelete = async (id:number) => {
    const r = await axios.delete(`/delete-group/${id}`);
    
    if(r.status === 200){
      setGroups(groups.filter((group: any) => group.id !== id));

      toast.success('Group deleted successfully.');
    }
    else {
      toast.error('Failed to delete group. ' + r.data.message);
    }
  }

  // table update handles
  const updateTableOnCreate = (group: any) => {
    setGroups([...groups, group]);
  };

  const updateTableOnEdit = (group: any) => {
    setGroups(groups.map((g) => (g.id === group.id ? group : g)));
  };

  // modal open handlers
  const openModalForCreate = () => {
    setGroupForEdit(null);
    setIsOpen(true);
  };

  const openModalForEdit = (group: any) => {
    setGroupForEdit(group);
    setIsOpen(true);
  };
  
  // table columns
  const columns = [
    {
      accessorKey: "#",
      header: () => <div className='text-right text-inherit'>#</div>,
      cell: ({ row }: { row: any }) => {
        return (
          <div className='text-right text-inherit'>
            {row.index + 1}
          </div>
        );
      },
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "users",
      header: () => <div className='text-right text-inherit'>Members</div>,
      cell : ({row}: { row : any}) => {
        return (
          <div className='text-right text-inherit'>
            {row.original.is_ffa ? 'FFA' : row.original.users.length}
          </div>
        );
      },
    },
    {
      accessorKey: "color",
      header: "Color",
      cell: ({row}: { row : any}) => {
        return (
          <div className="flex items-center gap-2 text-inherit">
            <div className="h-6 w-6 rounded-full" style={{ backgroundColor: row.original.color }}></div>
            {row.original.color}
          </div>
        );
      },
    },
    {
      accessorKey: "created_at",
      header: "Created At",
      cell: ({row}: { row : any}) => {
        return new Date(row.original.created_at).toLocaleDateString();
      },
    },
    {
      accessorKey: "actions",
      header: "",
      cell: ({ row } : {row : any}) => {
        return (
        <DropdownMenu>
          {/* trigger */}
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4 *:stroke-secondary" />
            </Button>
          </DropdownMenuTrigger>

          {/* list elements */}
          <DropdownMenuContent
            align="end"
            className='bg-secondary *:text-secondary p-0'
          >
            {/* edit */}
            <div onClick={openModalForEdit} className='p-2 border-b rounded-none border-primary/10 bg-accent-blue hover:opacity-75 cursor-pointer text-inherit'>
              Edit
            </div>
            
            {/* delete */}
            <div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <div className='p-2 rounded-none border-b border-primary/10 bg-accent-red hover:opacity-75 cursor-pointer text-inherit'>Delete</div>
                </AlertDialogTrigger>
                
                <AlertDialogContent className='bg-secondary'>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>

                    <AlertDialogDescription>
                      This action can't be undone, it will permanently delete selected data from the server.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>

                    <AlertDialogAction onClick={() => handleDelete(row.original.id)}>
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
        )
      },
    },
  ]

  return (
    <div className='px-4 ps-12 flex flex-col gap-4'>
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <h1 className='font-jersey !text-2xl'>Groups</h1>
        <Button onClick={openModalForCreate} className="text-secondary">Create new</Button>
      </div>

      <GroupModal
      isOpen={isOpen}
      onIsOpenChange={setIsOpen}
      users={users}
      groupForEdit={groupForEdit}
      onCreate={updateTableOnCreate}
      onUpdate={updateTableOnEdit}
      />

      <DataTable
      columns={columns}
      data={groups}
      searchableColumnIdentifier='name'
      />
    </div>
  )
}

AdminGroup.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>;

export default AdminGroup