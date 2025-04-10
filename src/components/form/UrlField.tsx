
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { Submission } from '@/types';

interface UrlFieldProps {
  form: UseFormReturn<any>;
  type: Submission['type'];
  required: boolean;
}

const UrlField: React.FC<UrlFieldProps> = ({
  form,
  type,
  required
}) => {
  const getUrlDescription = () => {
    switch (type) {
      case 'video':
        return 'Provide a YouTube or Google Drive link to your video.';
      case 'github':
        return 'Link to your GitHub repository.';
      case 'demo':
        return 'Link to your live demo site (if available).';
      default:
        return 'Enter a URL for your submission';
    }
  };

  return (
    <FormField
      control={form.control}
      name="url"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{required ? 'URL' : 'URL (Optional)'}</FormLabel>
          <FormControl>
            <Input 
              placeholder="https://..." 
              {...field} 
              type="url" 
            />
          </FormControl>
          <FormDescription>
            {getUrlDescription()}
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default UrlField;
