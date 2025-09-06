import React from 'react'
import AdminLayout from '@/layouts/admin/adminLayout'
import {Input} from '@/components/ui/input'
import {Button} from '@/components/ui/button'
import {Label} from '@/components/ui/label'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  ColorPicker,
  ColorPickerAlphaSlider,
  ColorPickerArea,
  ColorPickerContent,
  ColorPickerEyeDropper,
  ColorPickerFormatSelect,
  ColorPickerHueSlider,
  ColorPickerInput,
  ColorPickerSwatch,
  ColorPickerTrigger,
} from "@/components/ui/color-picker";

import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectGroup,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue,
} from "@/components/ui/multi-select"

import { Form, usePage } from '@inertiajs/react'
import { LoaderCircle, MoreHorizontal } from "lucide-react";
import InputError from '@/components/input-error'
import { toast } from 'sonner'
import { DataTable } from '@/components/custom/admin/DataTable'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

const AdminGroup = () => {
  // color picker
  const [isOpen, setIsOpen] = React.useState(false);
  const defaultColor = "#9EB41D";
  const presetColors = ['#9EB41D', '#F8961E', '#F94144', '#AE2695', '#369AC3'];
  const [color, setColor] = React.useState(defaultColor);
  
  const onPresetSelect = (presetColor: string) => {
    setColor(presetColor);
  };

  const onReset = () => {
    setColor(defaultColor);
    setIsOpen(false);
  };

  // group type
  const [isFFA, setIsFFA] = React.useState(true);
  const allUsers : any  = usePage().props.users;
  const [selectedUsers, setSelectedUsers] = React.useState<string[]>([]);

  // table
  const groups : any = usePage().props.groups;

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
          <DropdownMenuContent align="end" className='bg-secondary *:text-secondary p-0'>
            <DropdownMenuItem
            className='p-2 border-b rounded-none border-primary/10 cursor-pointer bg-accent-blue hover:opacity-75'
            onClick={() => {
              console.log('edit', row.original.id);
            }}
            >
              Edit
            </DropdownMenuItem>
            
            <DropdownMenuItem
            className='p-2 rounded-none border-b border-primary/10 cursor-pointer bg-accent-red hover:opacity-75'
            onClick={() => {
              console.log('delete', row.original.id);
            }}
            >
              Delete
            </DropdownMenuItem>
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
            {/* new group popup */}
            <Dialog>
                <DialogTrigger asChild>
                  <Button className="text-secondary">Create new</Button>
                </DialogTrigger>
                
                <DialogContent className="sm:max-w-[500px] p-4 bg-secondary">
                  <Form
                  action={'/create-group'}
                  method='post'
                  transform={(data) => {
                    return {
                      ...data,
                      color: color,
                      users: isFFA ? null : selectedUsers
                    };
                  }}
                  onSuccess={() => {
                    toast.success('Group created successfully!');
                  }}
                  onError={() => {
                    toast.error('Failed to create group.');
                  }}
                  >
                    {({errors, processing}) => (
                      <>
                      <DialogHeader className='pb-4 border-b border-primary/10'>
                        <DialogTitle className='font-bold text-xl'>Create new group</DialogTitle>
                        <DialogDescription>
                          Enter the group details below and click save.
                        </DialogDescription>
                      </DialogHeader>
                    
                      <div className="py-4 grid gap-8">
                        <div className="grid gap-2">
                          <Label htmlFor="name" required>Name</Label>
                          <Input id="name" name="name" placeholder='eg. Marketing' required/>
                          <InputError message={errors.name} />
                        </div>
                        
                        <div className="grid gap-2">
                          <Label htmlFor="color" required>Color</Label>
                          <div className="flex flex-col gap-4">
                            {/* color picker */}
                            <div className="flex items-center gap-3">
                              <ColorPicker
                                value={color}
                                onValueChange={setColor}
                                open={isOpen}
                                onOpenChange={setIsOpen}
                                defaultFormat="hex"
                              >
                                <ColorPickerTrigger asChild>
                                  <Button className="flex items-center gap-2 text-secondary">
                                    <ColorPickerSwatch className="size-4" />
                                    Color picker
                                  </Button>
                                </ColorPickerTrigger>

                                <ColorPickerContent className='bg-secondary'>
                                  <ColorPickerArea />
                                  <div className="flex items-center gap-2">
                                    <ColorPickerEyeDropper />
                                    <div className="flex flex-1 flex-col gap-2">
                                      <ColorPickerHueSlider />
                                      <ColorPickerAlphaSlider />
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <ColorPickerFormatSelect size="sm"/>
                                    <ColorPickerInput />
                                  </div>
                                </ColorPickerContent>
                              </ColorPicker>

                              <Button type="button" variant="outline" onClick={onReset}>
                                Reset
                              </Button>

                              <InputError message={errors.color} />
                            </div>

                            {/* preset colors */}
                            <div className="flex flex-wrap items-end gap-2">
                              <span className="font-medium text-sm">Preset colors:</span>
                              <div className="flex flex-wrap gap-2">
                                {presetColors.map((presetColor) => (
                                  <button
                                    key={presetColor}
                                    type="button"
                                    className="cursor-pointer size-8 rounded border border-primary hover:border-border focus:border-ring focus:outline-none"
                                    style={{ backgroundColor: presetColor }}
                                    onClick={() => onPresetSelect(presetColor)}
                                    aria-label={`Select color ${presetColor}`}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid gap-2">
                          <Label required>Group type</Label>
                          
                          <div className="inline-flex gap-2">
                            <Input type="radio" id="type_ffa" name="is_ffa" value="1" className='w-4 h-4' onChange={() => setIsFFA(true)} defaultChecked/>
                            <Label htmlFor="type_ffa">FFA (Free For All)</Label>
                          </div>
                          
                          <div className="inline-flex gap-2">
                            <Input type="radio" id="type_non_ffa" name="is_ffa" value="0" className='w-4 h-4' onChange={() => setIsFFA(false)} />
                            <Label htmlFor="type_non_ffa">Only selected users</Label>
                          </div>

                          <InputError message={errors.type} />
                        </div>

                        {!isFFA && (
                          <div className="grid gap-2">
                            <Label required>Select users</Label>
                            
                            <MultiSelect
                            onValuesChange={(values) => setSelectedUsers(values)}
                            >
                              <MultiSelectTrigger className="w-full max-w-[400px]">
                                <MultiSelectValue placeholder="Select users" />
                              </MultiSelectTrigger>

                              <MultiSelectContent className="bg-secondary">
                                <MultiSelectGroup>
                                  {allUsers.map((user:any) => (
                                    <MultiSelectItem key={user.id} value={(String(user.id))} className='flex items-center gap-2'>
                                      { user.image ?
                                          <img src={'/storage/'+user.image} alt={user.name} className="w-4 h-4 rounded-full" />
                                      :
                                          <img src="/icons/user.svg" alt={user.name} className="w-4 h-4 rounded-full bg-accent-lime"/>
                                      }

                                      {user.name}
                                    </MultiSelectItem>
                                  ))}
                                </MultiSelectGroup>
                              </MultiSelectContent>
                            </MultiSelect>
                            
                            <InputError message={errors.users} />
                          </div>
                        )}
                      </div>
                    
                      <DialogFooter className='pt-4 border-t border-primary/10'>
                        <DialogClose asChild>
                          <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        
                        <Button type="submit">
                          {processing ? <LoaderCircle className="h-7 w-7 stroke-secondary animate-spin" /> : 'Save'}
                        </Button>
                      </DialogFooter>
                      </>
                    )}
                  </Form>
                </DialogContent>
            </Dialog>
        </div>

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