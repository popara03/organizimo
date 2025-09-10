import { useCallback, useState } from 'react'

import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadList,
} from "@/components/ui/file-upload";
import { Upload, X } from "lucide-react";
import { toast } from 'sonner';
import { Button } from '../ui/button';

interface FileUploadProps {
    files: File[],
    setFiles: (files: File[]) => void,
    maxFiles?: number,
    maxFileSize?: number,
}

const FileUploader = ({files, setFiles, maxFiles = 1, maxFileSize = 2 * 1024 * 1024} : FileUploadProps) => {

    const onFileValidate = useCallback(
        (file: File): string | null => {
            // Validate file duplication
            if (files.some((f) => (f.name === file.name && f.size === file.size))) {
                return "This file is already uploaded.";
            }

            // Validate file type (only images)
            if (!file.type.startsWith("image/")) {
                return "Only image files are allowed.";
            }

            // Validate max files
            if (files.length >= maxFiles) {
                return `You can upload up to ${maxFiles} file(s).`;
            }
        
            // Validate file size (max 2MB)
            if (file.size > maxFileSize) {
                return `File size must be less than ${maxFileSize / (1024 * 1024)}MB.`;
            }
        
            return null;
        }, [files],
    );
    const onFileReject = useCallback((file: File, message: string) => {
        toast.error(message);
    }, []);
    const handleFileRemove = (file: File) => {
        const newFiles = files.filter(f => f !== file);
        setFiles(newFiles);
    };
    return (
        <FileUpload
        name='image'
        accept="image/*"
        maxFiles={maxFiles}
        value={files}
        onValueChange={setFiles}
        onFileValidate={onFileValidate}
        onFileReject={onFileReject}
        className="w-full"
        >
            {/* dropzone */}
            <FileUploadDropzone className='w-full h-48 p-0'>
                <div className="w-full h-full p-4 flex flex-col justify-center items-center gap-2 hover:opacity-50 cursor-pointer">
                    <div className="flex items-center justify-center rounded-full border p-2">
                        <Upload className="size-4 text-muted-foreground" />
                    </div>
                    <p className="font-medium text-sm">Drag & drop files here</p>
                    <p className="text-muted-foreground text-xs">
                        Or click to browse (max {maxFiles} file/s of {maxFileSize / (1024 * 1024)}MB each)
                    </p>
                </div>
            </FileUploadDropzone>

            {/* uploaded files */}
            <FileUploadList>
                {files.map((file) => (
                <FileUploadItem key={file.name} value={file}>
                    <FileUploadItemPreview />
                    <FileUploadItemMetadata className='w-2' />
                    <FileUploadItemDelete onClick={() => handleFileRemove(file)} asChild>
                        <Button variant="ghost" size="icon" className="size-7 cursor-pointer hover:opacity-50">
                            <X/>
                        </Button>
                    </FileUploadItemDelete>
                </FileUploadItem>
                ))}
            </FileUploadList>
        </FileUpload>
    )
}

export default FileUploader;