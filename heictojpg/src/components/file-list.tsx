'use client';

import { FileWithStatus, FileItem } from './file-item';

interface FileListProps {
    files: FileWithStatus[];
    onRemove: (id: string) => void;
}

export function FileList({ files, onRemove }: FileListProps) {
    if (files.length === 0) return null;

    return (
        <div className="flex flex-col gap-3 w-full mt-6">
            {files.map((file) => (
                <FileItem key={file.id} fileData={file} onRemove={onRemove} />
            ))}
        </div>
    );
}
