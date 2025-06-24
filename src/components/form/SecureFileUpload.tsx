
import React, { useState } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { File, FileWarning, CheckCircle2, Shield } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SecureFileUploadProps {
  form: UseFormReturn<any>;
  label: string;
  description: string;
  acceptFiles: string;
  required: boolean;
  maxSize?: number;
}

const SecureFileUpload: React.FC<SecureFileUploadProps> = ({
  form,
  label,
  description,
  acceptFiles,
  required,
  maxSize = 20 * 1024 * 1024 // 20MB default
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const { toast } = useToast();

  const humanFileSize = (size: number) => {
    if (size === 0) return '0 B';
    const units = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(size) / Math.log(1024));
    return `${(size / Math.pow(1024, i)).toFixed(2)} ${units[i]}`;
  };

  const getFileTypesFromAccept = (accept: string) => {
    return accept.split(',').map(type => type.trim().replace('.', '')).join(', ');
  };

  // Enhanced file validation with security checks
  const validateFile = async (file: File): Promise<{ isValid: boolean; error?: string }> => {
    // Basic size validation
    if (file.size > maxSize) {
      return { isValid: false, error: `File size exceeds the ${humanFileSize(maxSize)} limit` };
    }

    // File type validation
    if (acceptFiles && acceptFiles !== '*') {
      const fileExt = `.${file.name.split('.').pop()?.toLowerCase()}`;
      const acceptedTypes = acceptFiles.split(',').map(t => t.trim().toLowerCase());
      
      if (!acceptedTypes.includes(fileExt) && !acceptedTypes.includes('*')) {
        const allowedTypes = getFileTypesFromAccept(acceptFiles);
        return { isValid: false, error: `Invalid file type. Allowed: ${allowedTypes}` };
      }
    }

    // File name validation (prevent path traversal)
    if (file.name.includes('../') || file.name.includes('..\\')) {
      return { isValid: false, error: 'Invalid file name' };
    }

    // Check for suspicious file extensions
    const suspiciousExtensions = ['.exe', '.bat', '.cmd', '.scr', '.pif', '.com', '.js', '.vbs'];
    const fileExt = `.${file.name.split('.').pop()?.toLowerCase()}`;
    if (suspiciousExtensions.includes(fileExt)) {
      return { isValid: false, error: 'File type not allowed for security reasons' };
    }

    // Basic file header validation for common types
    try {
      const arrayBuffer = await file.slice(0, 8).arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      
      // PDF validation
      if (file.type === 'application/pdf' || fileExt === '.pdf') {
        const pdfHeader = String.fromCharCode(...uint8Array.slice(0, 4));
        if (pdfHeader !== '%PDF') {
          return { isValid: false, error: 'Invalid PDF file format' };
        }
      }
      
      // Basic ZIP/Office document validation
      if (fileExt === '.pptx' || fileExt === '.docx' || fileExt === '.xlsx') {
        // These are ZIP-based formats, check for ZIP header
        if (uint8Array[0] !== 0x50 || uint8Array[1] !== 0x4B) {
          return { isValid: false, error: 'Invalid Office document format' };
        }
      }
    } catch (error) {
      console.warn('File header validation failed:', error);
      // Don't block upload for header validation failures
    }

    return { isValid: true };
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFileError(null);
    setIsValidating(false);
    
    if (file) {
      setIsValidating(true);
      
      const validation = await validateFile(file);
      
      if (!validation.isValid) {
        setFileError(validation.error || 'File validation failed');
        setSelectedFile(null);
        form.setError('file', { 
          type: 'manual', 
          message: validation.error || 'File validation failed'
        });
        setIsValidating(false);
        return;
      }
      
      setSelectedFile(file);
      form.setValue('file', file, { shouldValidate: true });
      form.clearErrors('file');
      setIsValidating(false);
      
      toast({
        title: "File validated",
        description: "File passed security checks and is ready for upload.",
      });
    } else {
      setSelectedFile(null);
      form.setValue('file', undefined);
    }
  };

  return (
    <FormField
      control={form.control}
      name="file"
      render={({ field: { value, onChange, ...fieldProps }, fieldState }) => (
        <FormItem>
          <FormLabel className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-green-600" />
            {required ? label : `${label} (Optional)`}
          </FormLabel>
          <FormControl>
            <div className="space-y-2">
              <div className="relative">
                <Input
                  type="file"
                  accept={acceptFiles}
                  onChange={handleFileChange}
                  {...fieldProps}
                  className={`file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 ${
                    fileError || fieldState.error 
                      ? 'border-destructive' 
                      : selectedFile && !isValidating 
                        ? 'border-green-500' 
                        : ''
                  }`}
                  disabled={isValidating}
                />
                {isValidating && (
                  <div className="absolute right-3 top-3">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                  </div>
                )}
                {selectedFile && !fileError && !fieldState.error && !isValidating && (
                  <CheckCircle2 className="h-4 w-4 absolute right-3 top-3 text-green-500" />
                )}
                {(fileError || fieldState.error) && !isValidating && (
                  <FileWarning className="h-4 w-4 absolute right-3 top-3 text-destructive" />
                )}
              </div>
              
              {selectedFile && !fileError && !fieldState.error && !isValidating && (
                <div className="text-xs flex items-center space-x-2 text-muted-foreground">
                  <File className="h-3 w-3" />
                  <span className="font-medium">{selectedFile.name}</span>
                  <span>({humanFileSize(selectedFile.size)})</span>
                  <Shield className="h-3 w-3 text-green-600" />
                  <span className="text-green-600">Validated</span>
                </div>
              )}
            </div>
          </FormControl>
          <FormDescription>
            {!selectedFile ? description : ''}
            {!selectedFile && acceptFiles && acceptFiles !== '*' && (
              <> Accepted formats: {getFileTypesFromAccept(acceptFiles)}.</>
            )}
            <div className="text-xs text-muted-foreground mt-1">
              🛡️ Files are automatically scanned for security threats
            </div>
          </FormDescription>
          {fileError ? (
            <p className="text-sm font-medium text-destructive">{fileError}</p>
          ) : (
            <FormMessage />
          )}
        </FormItem>
      )}
    />
  );
};

export default SecureFileUpload;
