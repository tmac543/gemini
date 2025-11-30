'use client';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

import { ConversionFormat } from '@/lib/converter-logic';

interface ConverterSettingsProps {
    format: ConversionFormat;
    setFormat: (format: ConversionFormat) => void;
    disabled?: boolean;
}

export function ConverterSettings({
    format,
    setFormat,
    disabled,
}: ConverterSettingsProps) {
    return (
        <div className="flex items-center justify-center gap-3 w-full">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 whitespace-nowrap">
                Output Format:
            </label>
            <div className="w-40">
                <Select
                    value={format}
                    onValueChange={(value) => setFormat(value as ConversionFormat)}
                    disabled={disabled}
                >
                    <SelectTrigger className="h-9 cursor-pointer">
                        <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="image/jpeg">JPG (JPEG)</SelectItem>
                        <SelectItem value="image/png">PNG</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
