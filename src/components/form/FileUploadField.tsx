
import React, { useState } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { File, FileWarning, CheckCircle2 } from 'lucide-react';
import { MAX_FILE_SIZE } from '@/utils/submissionFormSchema';

interface FileUploadFieldProps {
  form: UseFormReturn<any>;
  label: string;
  description: string;
  acceptFiles: string;
  required: boolean;
}

const FileUploadField: React.FC<FileUploadFieldProps> = ({
  form,
  label,
  description,
  acceptFiles,
  required
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const humanFileSize = (size: number) => {
    if (size === 0) return '0 B';
    const units = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(size) / Math.log(1024));
    return `${(size / Math.pow(1024, i)).toFixed(2)} ${units[i]}`;
  };

  const getFileTypesFromAccept = (accept: string) => {
    return accept.split(',').map(type => type.trim().replace('.', '')).join(', ');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFileError(null);
    
    if (file) {
      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        setFileError(`File size exceeds the ${humanFileSize(MAX_FILE_SIZE)} limit`);
        setSelectedFile(null);
        form.setError('file', { 
          type: 'manual', 
          message: `File size exceeds the ${humanFileSize(MAX_FILE_SIZE)} limit` 
        });
        return;
      }
      
      // Validate file type if acceptFiles is provided
      if (acceptFiles && acceptFiles !== '*') {
        const fileExt = `.${file.name.split('.').pop()?.toLowerCase()}`;
        const acceptedTypes = acceptFiles.split(',').map(t => t.trim().toLowerCase());
        
        if (!acceptedTypes.includes(fileExt) && !acceptedTypes.includes('*')) {
          const allowedTypes = getFileTypesFromAccept(acceptFiles);
          setFileError(`Invalid file type. Allowed: ${allowedTypes}`);
          setSelectedFile(null);
          form.setError('file', { 
            type: 'manual', 
            message: `Invalid file type. Allowed: ${allowedTypes}` 
          });
          return;
        }
      }
      
      setSelectedFile(file);
      form.setValue('file', file, { shouldValidate: true });
      form.clearErrors('file');
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
          <FormLabel>{required ? label : `${label} (Optional)`}</FormLabel>
          <FormControl>
            <div className="space-y-2">
              <div className="relative">
                <Input
                  type="file"
                  accept={acceptFiles}
                  onChange={handleFileChange}
                  {...fieldProps}
                  className={`file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 ${fileError || fieldState.error ? 'border-destructive' : selectedFile ? 'border-green-500' : ''}`}
                />
                {selectedFile && !fileError && !fieldState.error && (
                  <CheckCircle2 className="h-4 w-4 absolute right-3 top-3 text-green-500" />
                )}
                {(fileError || fieldState.error) && (
                  <FileWarning className="h-4 w-4 absolute right-3 top-3 text-destructive" />
                )}
              </div>
              
              {selectedFile && !fileError && !fieldState.error && (
                <div className="text-xs flex items-center space-x-2 text-muted-foreground">
                  <File className="h-3 w-3" />
                  <span className="font-medium">{selectedFile.name}</span>
                  <span>({humanFileSize(selectedFile.size)})</span>
                </div>
              )}
            </div>
          </FormControl>
          <FormDescription>
            {!selectedFile ? description : ''}
            {!selectedFile && acceptFiles && acceptFiles !== '*' && (
              <> Accepted formats: {getFileTypesFromAccept(acceptFiles)}.</>
            )}
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

export default FileUploadField;
