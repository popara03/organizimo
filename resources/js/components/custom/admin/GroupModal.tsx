import React, { useEffect } from 'react'
import { usePage } from '@inertiajs/react';

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

import { Form } from '@inertiajs/react'
import {Label} from '@/components/ui/label'
import {Input} from '@/components/ui/input'
import InputError from '@/components/input-error'
import { Button } from '@/components/ui/button';
import { LoaderCircle } from "lucide-react";
import { toast } from 'sonner';

type GroupModalProps = {
    isOpen: boolean,
    onIsOpenChange: (open: boolean) => void,
    users: any[],
    groupForEdit: any,
    onCreate: (group: any) => void,
    onUpdate: (group: any) => void
}

const GroupModal = ({isOpen, onIsOpenChange, users, groupForEdit, onCreate, onUpdate}: GroupModalProps) => {
    // color picker
    const [isColorPickerOpen, setIsColorPickerOpen] = React.useState(false);
    const defaultColor = "#9EB41D";
    const presetColors = ['#9EB41D', '#F8961E', '#F94144', '#AE2695', '#369AC3'];
    const [color, setColor] = React.useState(groupForEdit?.color || defaultColor);
        
    const onPresetSelect = (presetColor: string) => {
        setColor(presetColor);
    };

    const onReset = () => {
        setColor(defaultColor);
        setIsColorPickerOpen(false);
    };

    // group type
    const [isFFA, setIsFFA] = React.useState(groupForEdit ? groupForEdit.is_ffa : true);
    const [selectedUsers, setSelectedUsers] = React.useState(
        groupForEdit && !groupForEdit.is_ffa
            ? groupForEdit.users.map((u: any) => String(u.id))
            : []
    );

    // onload reset modal depending on action (edit/create)
    useEffect(() => {
        console.log('groupForEdit changed:', groupForEdit);
    if (groupForEdit) {
        setColor(groupForEdit.color);
        setIsFFA(Number(groupForEdit.is_ffa));
        setSelectedUsers(
        !Number(groupForEdit.is_ffa)
            ? groupForEdit.users?.map((u: any) => String(u.id))
            : []
        );
    } else {
        // reset for create
        setColor(defaultColor);
        setIsFFA(true);
        setSelectedUsers([]);
    }
    }, [groupForEdit, isOpen]);

    return (
        <Dialog
            open={isOpen}
            onOpenChange={()=>{onIsOpenChange(!isOpen)}}
        >
            <DialogContent className="w-full rounded-2xl sm:max-w-[500px] p-4 bg-secondary overflow-y-auto max-h-[90vh]">
                <Form
                action={groupForEdit ? `/update-group` : '/create-group'}
                method={groupForEdit ? 'put' : 'post'}
                transform={(data) => {
                    // If editing - include the ID. If creating - exclude the ID
                    const finalData = groupForEdit ?
                    {
                        ...data,
                        color: color,
                        users: isFFA ? null : selectedUsers,
                        id: groupForEdit.id
                    } : {
                        ...data,
                        color: color,
                        users: isFFA ? null : selectedUsers
                    };

                    return finalData;
                }}
                onSuccess={(response:any) => {
                    toast.success(groupForEdit ? 'Group updated successfully.' : 'Group created successfully.');
                    {groupForEdit ? onUpdate(response.props.group) : onCreate(response.props.group)}
                }}
                onError={() => {
                    toast.error('Failed to save group.');
                }
                }
                resetOnSuccess
                disableWhileProcessing
                options={{
                preserveScroll: true,
                preserveUrl: true,
                }}
                >
                {({errors, processing}) => (
                    <>
                    <DialogHeader className='items-start pb-4 border-b border-primary/10'>
                        <DialogTitle className='font-bold text-xl'>
                            {groupForEdit ? 'Edit Group' : 'Create New Group'}
                        </DialogTitle>

                        <DialogDescription>
                            Enter the details below and click save.
                        </DialogDescription>
                    </DialogHeader>
                
                    <div className="py-4 grid gap-8">
                        <div className="grid gap-2">
                            <Label htmlFor="name" required>Name</Label>
                            <Input
                            id="name"
                            name="name"
                            placeholder='eg. Marketing'
                            required
                            defaultValue={groupForEdit?.name || ''}
                            />
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
                                open={isColorPickerOpen}
                                onOpenChange={setIsColorPickerOpen}
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
                            <Input type="radio" id="type_ffa" name="is_ffa" value="1" className='w-4 h-4' onChange={() => setIsFFA(true)} checked={isFFA} />
                            <Label htmlFor="type_ffa">FFA (Free For All)</Label>
                            </div>
                            
                            <div className="inline-flex gap-2">
                            <Input type="radio" id="type_non_ffa" name="is_ffa" value="0" className='w-4 h-4' onChange={() => setIsFFA(false)} checked={!isFFA} />
                            <Label htmlFor="type_non_ffa">Only selected users</Label>
                            </div>

                            <InputError message={errors.type} />
                        </div>

                        {!isFFA && (
                            <div className="grid gap-2">
                            <Label required>Select users</Label>
                            
                            <MultiSelect
                            onValuesChange={setSelectedUsers}
                            values={selectedUsers}
                            >
                                <MultiSelectTrigger className="w-full max-w-[400px]">
                                <MultiSelectValue placeholder="Select users" />
                                </MultiSelectTrigger>

                                <MultiSelectContent className="bg-secondary">
                                <MultiSelectGroup>
                                    {users.map((user:any) => (
                                    <MultiSelectItem key={user.id} value={(String(user.id))} keywords={[user.name]} className='flex items-center gap-2'>
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
                
                    <DialogFooter className='pt-4 gap-2 border-t border-primary/10'>
                        <DialogClose asChild className='m-0'>
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
    )
}

export default GroupModal