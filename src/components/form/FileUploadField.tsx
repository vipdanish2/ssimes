
import React, { useState } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      form.setValue('file', file);
    }
  };

  return (
    <FormField
      control={form.control}
      name="file"
      render={({ field: { value, onChange, ...fieldProps } }) => (
        <FormItem>
          <FormLabel>{required ? label : `${label} (Optional)`}</FormLabel>
          <FormControl>
            <div className="grid w-full items-center gap-1.5">
              <Input
                type="file"
                accept={acceptFiles}
                onChange={handleFileChange}
                {...fieldProps}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
              />
            </div>
          </FormControl>
          <FormDescription>
            {selectedFile ? `Selected: ${selectedFile.name}` : description}
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FileUploadField;
