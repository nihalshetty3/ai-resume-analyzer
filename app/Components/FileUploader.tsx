import { useState, useCallback } from 'react'
import {useDropZone} from 'react-dropzone'
import { maxSize } from 'valibot';

interface FileUploaderProps {
    onFileSelect? : (file: File | null) => void;
}

const FileUploader = () =>({onFileSelect } : FileUploaderProps)

    const onDrop= useCallback((acceptedFile: File[]) => {
        const file=acceptedFile[0] || null;

        onFileSelect?.(file)
      }, [onFileSelect]);

    const {getRootProps, getInputProps, isDragActive, acceptedFile}= useDropZone({
        onDrop, 
        multiple:false,
        accept: {'application/pdf' : ['.pdf']},
        maxSize: maxFileSize,
    })

    const file = acceptedFile[0] || null;


    return (
        <div className="w-full gradient-border">
            <div {...getRootProps()}>
                <input {...getInputProps()} />
                {
                   <div className="space-y-4 cursor-pointer"> 
                   <div className="mx-auto w-16 flex items-center justify-center">
                    <img src="/icons/info.svg" alt="upload" className="size-20"/>
                   </div>

                   {file ? (
                   <div className="flex items-center space-x-3"> 
                   <img src="/images/pdf.png" alt="pdf" className="size-10"/>

                    <div>
                    <p className="text-lg text-gray-700 font-medium truncate">
                    {file.name};
                   </p>

                   <p className="text-sm text-gray-500">
                        {formatSize(file.size)}
                   </p>

                     </div>

                   </div>
                   ): (
                    <div> 
                        <p className="text-lg text-gray-500">
                            <span className="font-semibold">
                                Click to Upload
                            </span> or drag and drop
                            </p> 
                            <p className="text-lg text-gray-500">PDF (max{formatSize (maxFileSize)}) </p>
                    </div>
                   )}
                }
            </div>
        </div>
    )
}
export default FileUploader;