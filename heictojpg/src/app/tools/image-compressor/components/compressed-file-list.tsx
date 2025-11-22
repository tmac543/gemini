'use client';

import { CompressedFile, CompressedFileItem } from './compressed-file-item';

interface CompressedFileListProps {
    files: CompressedFile[];
    onRemove: (id: string) => void;
}

export function CompressedFileList({ files, onRemove }: CompressedFileListProps) {
    if (files.length === 0) return null;

    return (
        <div className="flex flex-col gap-3 w-full mt-6">
            {files.map((file) => (
                <CompressedFileItem key={file.id} fileData={file} onRemove={onRemove} />
            ))}
        </div>
    );
}
