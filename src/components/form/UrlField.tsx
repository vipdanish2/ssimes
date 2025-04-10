
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { Submission } from '@/types';
import { ExternalLink, AlertCircle } from 'lucide-react';

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

  const getUrlPlaceholder = () => {
    switch (type) {
      case 'video':
        return 'https://youtube.com/...';
      case 'github':
        return 'https://github.com/username/repo';
      case 'demo':
        return 'https://your-demo-site.com';
      default:
        return 'https://...';
    }
  };

  const validateUrlPattern = (value: string) => {
    if (!value) return true;
    
    try {
      new URL(value);
      return true;
    } catch (e) {
      return false;
    }
  };

  return (
    <FormField
      control={form.control}
      name="url"
      rules={{
        validate: {
          validUrl: (value) => !value || validateUrlPattern(value) || 'Please enter a valid URL including https://'
        }
      }}
      render={({ field, fieldState }) => (
        <FormItem>
          <FormLabel>{required ? 'URL' : 'URL (Optional)'}</FormLabel>
          <FormControl>
            <div className="relative">
              <Input 
                placeholder={getUrlPlaceholder()} 
                {...field} 
                type="url" 
                className={fieldState.error ? "border-destructive pr-10" : ""}
              />
              {fieldState.error && (
                <AlertCircle className="h-4 w-4 absolute right-3 top-3 text-destructive" />
              )}
              {field.value && !fieldState.error && (
                <ExternalLink className="h-4 w-4 absolute right-3 top-3 text-muted-foreground" />
              )}
            </div>
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
