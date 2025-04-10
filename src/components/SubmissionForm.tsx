
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSubmissions } from '@/hooks/useSubmissions';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Upload, FileText, Link as LinkIcon } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Submission } from '@/types';

interface SubmissionFormProps {
  teamId: string;
  type: Submission['type'];
  title: string;
  description: string;
  icon: React.ReactNode;
  acceptFiles?: string;
  allowUrl?: boolean;
}

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

const createSubmissionSchema = (
  type: Submission['type'], 
  allowUrl: boolean, 
  requireFile: boolean
) => {
  // Base schema with title and description
  const baseSchema = z.object({
    title: z.string().min(3, { message: "Title must be at least 3 characters" }),
    description: z.string().optional(),
  });

  // File validation schema
  const fileSchema = requireFile
    ? z.object({
        file: z.instanceof(File)
          .refine(file => file.size <= MAX_FILE_SIZE, {
            message: `File size must be less than 20MB`,
          })
      })
    : z.object({
        file: z.instanceof(File)
          .refine(file => !file || file.size <= MAX_FILE_SIZE, {
            message: `File size must be less than 20MB`,
          })
          .optional()
      });

  // URL validation schema - Only include if allowUrl is true
  const urlSchema = allowUrl
    ? z.object({
        url: z.string().url({ message: "Please enter a valid URL" }).optional(),
      })
    : z.object({});

  // Combine schemas and add refinement for file/url requirement
  return baseSchema.merge(fileSchema).merge(urlSchema)
    .refine(
      data => {
        if (requireFile && !allowUrl) return !!data.file;
        if (!requireFile && allowUrl) return !!data.url;
        if (requireFile && allowUrl) return !!data.file || !!data.url;
        return true;
      },
      {
        message: "You must provide either a file or a URL",
        path: ["file"],
      }
    );
};

const SubmissionForm: React.FC<SubmissionFormProps> = ({
  teamId,
  type,
  title,
  description,
  icon,
  acceptFiles = '.pdf,.doc,.docx',
  allowUrl = false,
}) => {
  const { submitProject, isSubmitting, uploadProgress } = useSubmissions();
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const requireFile = type === 'abstract' || type === 'presentation' || type === 'report';
  
  const schema = createSubmissionSchema(type, allowUrl, requireFile);
  
  // Define the form type using zod inference
  type FormValues = z.infer<typeof schema>;
  
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      description: '',
      ...(allowUrl ? { url: '' } : {})
    },
  });

  const onSubmit = (values: FormValues) => {
    submitProject(
      {
        teamId,
        type,
        title: values.title,
        description: values.description || '',
        file: values.file,
        url: 'url' in values ? values.url : undefined,
      },
      {
        onSuccess: () => {
          setOpen(false);
          form.reset();
          setSelectedFile(null);
        }
      }
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      form.setValue('file', file);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full h-auto p-6 flex flex-col items-center justify-center space-y-2">
          {icon}
          <span className="font-medium">{title}</span>
          <span className="text-xs text-muted-foreground text-center">{description}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Submit {title}</DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder={`Enter ${type} title`} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Add a brief description of your submission" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {requireFile && (
              <FormField
                control={form.control}
                name="file"
                render={({ field: { value, onChange, ...fieldProps } }) => (
                  <FormItem>
                    <FormLabel>File Upload</FormLabel>
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
                      {selectedFile ? `Selected: ${selectedFile.name}` : `Upload your ${type} file (max 20MB)`}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            {allowUrl && (
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{requireFile ? 'URL (Optional)' : 'URL'}</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="https://..." 
                        {...field} 
                        type="url" 
                      />
                    </FormControl>
                    <FormDescription>
                      {type === 'video' && 'Provide a YouTube or Google Drive link to your video.'}
                      {type === 'github' && 'Link to your GitHub repository.'}
                      {type === 'demo' && 'Link to your live demo site (if available).'}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            {isSubmitting && uploadProgress > 0 && (
              <div className="space-y-2">
                <Progress value={uploadProgress} />
                <p className="text-sm text-center text-muted-foreground">
                  Uploading: {Math.round(uploadProgress)}%
                </p>
              </div>
            )}
            
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default SubmissionForm;
