import { useCallback } from 'react'

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

export interface ExtendedFile extends File {
  existingId?: number;
}

interface FileUploadProps {
    files: ExtendedFile[],
    setFiles: (files: ExtendedFile[]) => void,
    maxFiles?: number,
    maxFileSize?: number,
    allowMultiple?: boolean,
    allowDocuments?: boolean,
}

const FileUploader = ({files, setFiles, maxFiles = 1, maxFileSize = 2 * 1024 * 1024, allowMultiple = false, allowDocuments = true} : FileUploadProps) => {
    // allowed file types
    const allowedFileTypes = ['.jpg', '.jpeg', '.png', '.webp'];
    if (allowDocuments) {
        allowedFileTypes.push('.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.txt', '.json', '.csv', '.zip', '.rar');
    }

    const onFileValidate = useCallback((file: ExtendedFile): string | null => {
            // Validate file duplication
            if (files.some((f) => (f.name === file.name && f.size === file.size))) {
                return "This file is already uploaded.";
            }

            // Validate file type
            const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
            if(!allowedFileTypes.includes(fileExtension)) {
                return `Invalid file type: ${fileExtension}. Only following types are allowed: ${allowedFileTypes.join(", ")}.`;
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

    const onFileReject = useCallback((file: ExtendedFile, message: string) => {
        toast.error(message);
    }, []);

    const handleFileRemove = (file: ExtendedFile) => {
        const newFiles = files.filter(f => f !== file);
        setFiles(newFiles);
    };

    return (
        <FileUpload
        value={files}
        onValueChange={setFiles}
        name='image'
        accept={allowedFileTypes.join(',')}
        multiple={allowMultiple}
        maxFiles={maxFiles}
        maxSize={maxFileSize}
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
                {files.map((file, index) => (
                <FileUploadItem key={index} value={file}>
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