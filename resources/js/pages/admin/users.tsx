import { useState } from 'react'
import { usePage } from '@inertiajs/react'

import axios from 'axios'
import { toast } from 'sonner'

import AdminLayout from '@/layouts/admin/adminLayout'

import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/custom/admin/DataTable'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Clipboard } from 'lucide-react'
import GroupModal from '@/components/custom/admin/UserModal'

const Users = () => {
  // data
  const globalProps = usePage().props;
  const [users, setUsers] = useState<any[]>(globalProps.users as any[]);
  const [roles, setRoles] = useState<any[]>(globalProps.roles as any[]);

  // modal open
  const [isOpen, setIsOpen] = useState(false);

  const openModalForCreate = () => {
    setUserForEdit(null);
    setIsOpen(true);
  };

  const openModalForEdit = (user: any) => {
    console.log(userForEdit)
    setUserForEdit(user);
    setIsOpen(true);
  };

  // edit
  const [userForEdit, setUserForEdit] = useState<any>(null);

  // delete
  const handleDelete = async (id:number) => {
    const r = await axios.delete(`/delete-user/${id}`);

    if(r.status === 200){
      setUsers(users.filter((user: any) => user.id !== id));

      toast.success('User deleted successfully.');
    }
    else {
      toast.error('Failed to delete user. ' + r.data.message);
    }
  }

  // table update handles
  const updateTableOnCreate = (user: any) => {
    setUsers([...users, user]);
  };

  const updateTableOnEdit = (user: any) => {
    setUsers(users.map((u) => (u.id === user.id ? user : u)));
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
      cell: ({ row }: { row: any }) => {
        return (
          <div className='flex flex-wrap gap-2 text-left text-inherit'>
            { row.original.image ?
                <img src={'/storage/'+row.original.image} alt={row.original.name} className="w-4 h-4 rounded-full" />
            :
                <img src="/icons/user.svg" alt={row.original.name} className="w-4 h-4 rounded-full bg-accent-lime"/>
            }

            {row.original.name}
          </div>
        );
      },
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({row} : {row : any}) => {
        return (
          <div className="flex flex-wrap items-center justify-between gap-2">
            <a href={`mailto:${row.original.email}`} className='text-blue-500'>{(row.original.email)}</a>
            
            <Button
            className='!p-2 bg-secondary/10'
            onClick={()=>{
              navigator.clipboard.writeText(row.original.email);
              toast.success('Email copied to clipboard');
            }}>
              <Clipboard className='w-4 h-4 stroke-secondary'/>
            </Button>
          </div>
        )
      }
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({row} : {row : any}) => <span className='text-inherit'>{(row.original.role.name)}</span>
    },
    {
      accessorKey: "position",
      header: "Position",
      cell: ({row}: { row : any}) => {
        return (
          <div className='text-inherit'>
            {row.original.position ? row.original.position : '-'}
          </div>
        );
      },
    },
    {
      accessorKey: "created_at",
      header: "Joined",
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
            className='bg-secondary *:text-primary p-0'
          >
            {/* edit */}
            <div onClick={() => openModalForEdit(row.original)} className='p-2 border-b rounded-none border-primary/10 hover:opacity-75 cursor-pointer text-inherit'>
              Edit
            </div>
            
            {/* delete */}
            <div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <div className='p-2 rounded-none border-b border-primary/10 hover:opacity-75 cursor-pointer text-inherit'>Delete</div>
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
    <>
      <div className="flex flex-col md:flex-row gap-4 md:justify-between items-start md:items-center">
        <h1 className='font-jersey !text-2xl'>Users</h1>
        <Button onClick={openModalForCreate} className="text-secondary">Create new</Button>
      </div>

      <GroupModal
      isOpen={isOpen}
      onIsOpenChange={setIsOpen}
      roles={roles}
      userForEdit={userForEdit}
      onCreate={updateTableOnCreate}
      onUpdate={updateTableOnEdit}
      />

      <DataTable
      columns={columns}
      data={users}
      searchableColumnIdentifier='name'
      />
    
    </>
  )
}

Users.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>;


export default Users