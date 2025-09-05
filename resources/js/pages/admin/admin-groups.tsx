import React from 'react'
import Sidebar from '@/components/custom/sidebar'
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
import { Form, usePage } from '@inertiajs/react'
import { toast } from 'sonner'
import { error } from 'node:console'

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
  const allUsers = usePage().props.users;
  console.log(allUsers);

  return (
    <div>
        <Sidebar/>
        
        <div className='px-4 ps-12'>
            <h1 className='font-jersey !text-2xl'>Groups</h1>

            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                <Input placeholder="Search" className="w-full md:w-50" />
                <Dialog>
                    <DialogTrigger asChild>
                      <Button className="text-secondary">Create new</Button>
                    </DialogTrigger>
                    
                    <DialogContent className="sm:max-w-[500px] p-4 bg-secondary">
                      <Form
                      // action={'/groups/create'}
                      action={'/print'}
                      method='post'
                      transform={(data) => {
                        return {
                          ...data,
                          color: color,
                          users: []
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
                              <Input id="name" name="name" placeholder='eg. Marketing' />
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
                                <Input type="radio" id="type_ffa" name="is_ffa" value="true" className='w-4 h-4' onChange={() => setIsFFA(true)} defaultChecked/>
                                <Label htmlFor="type_ffa">FFA (Free For All)</Label>
                              </div>
                              
                              <div className="inline-flex gap-2">
                                <Input type="radio" id="type_non_ffa" name="is_ffa" value="false" className='w-4 h-4' onChange={() => setIsFFA(false)} />
                                <Label htmlFor="type_non_ffa">Only selected users</Label>
                              </div>
                            </div>

                            {!isFFA && (
                              <div className="grid gap-2">
                                <Label required>Select users</Label>
                                <Input placeholder="Search users" className="w-full" />
                              </div>
                            )}
                          </div>
                        
                          <DialogFooter className='pt-4 border-t border-primary/10'>
                            <DialogClose asChild>
                              <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button type="submit">Save</Button>
                          </DialogFooter>
                          </>
                        )}
                      </Form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="">

            </div>
        </div>
    </div>
  )
}

export default AdminGroup