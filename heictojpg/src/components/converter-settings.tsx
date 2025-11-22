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
    quality: number;
    setQuality: (quality: number) => void;
    disabled?: boolean;
}

export function ConverterSettings({
    format,
    setFormat,
    quality,
    setQuality,
    disabled,
}: ConverterSettingsProps) {
    return (
        <div className="flex flex-col sm:flex-row gap-6 p-6 bg-card rounded-xl border shadow-sm w-full max-w-2xl">
            <div className="flex-1 space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Output Format
                </label>
                <Select
                    value={format}
                    onValueChange={(value) => setFormat(value as ConversionFormat)}
                    disabled={disabled}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="image/jpeg">JPG (JPEG)</SelectItem>
                        <SelectItem value="image/png">PNG</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="flex-1 space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Quality: {Math.round(quality * 100)}%
                </label>
                <Select
                    value={quality.toString()}
                    onValueChange={(value) => setQuality(parseFloat(value))}
                    disabled={disabled}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select quality" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="1.0">Original (100%)</SelectItem>
                        <SelectItem value="0.9">High (90%)</SelectItem>
                        <SelectItem value="0.8">Medium (80%)</SelectItem>
                        <SelectItem value="0.6">Low (60%)</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
