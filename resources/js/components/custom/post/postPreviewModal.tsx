import React from 'react'
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
import { usePage } from '@inertiajs/react';

const PostPreviewModal = ({ isOpen, togglePreview, post } : { isOpen: boolean, togglePreview: (post:any) => void, post : any }) => {
    const { props } = usePage();
    const activeUser = props.active_user;

    console.log(post);

    return (
    <Dialog
    open={isOpen}
    onOpenChange={togglePreview}
    >
      <DialogContent className='bg-secondary'>
        <DialogHeader>
          <DialogTitle>Post Preview</DialogTitle>
          <DialogDescription>
            This is a preview of the post content.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
            <DialogClose>Close</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default PostPreviewModal