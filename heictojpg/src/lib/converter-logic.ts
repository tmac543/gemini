// import heic2any from 'heic2any'; // Removed static import

export type ConversionFormat = 'image/jpeg' | 'image/png';

export interface ConversionOptions {
    quality: number;
    format: ConversionFormat;
}

/**
 * Converts a HEIC file to JPEG or PNG.
 * @param file The HEIC file to convert.
 * @param options Conversion options (quality, format).
 * @returns A Promise that resolves to the converted Blob.
 */
export const convertHeicToImage = async (
    file: File,
    options: ConversionOptions
): Promise<Blob> => {
    try {
        // Dynamically import heic2any to avoid SSR issues (window is not defined)
        const heic2any = (await import('heic2any')).default;

        // heic2any returns a Blob or an array of Blobs. We expect a single Blob for a single file.
        const result = await heic2any({
            blob: file,
            toType: options.format,
            quality: options.quality,
        });

        if (Array.isArray(result)) {
            return result[0];
        }
        return result;
    } catch (error) {
        console.error('Conversion failed:', error);
        throw new Error('Failed to convert HEIC image.');
    }
};
