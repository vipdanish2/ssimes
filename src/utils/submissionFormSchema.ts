
import { z } from 'zod';

// Define maximum file sizes for different submission types
export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB max file size

export const submissionFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  type: z.enum(["abstract", "presentation", "video", "github", "demo", "report"]),
  url: z.string().url("Please enter a valid URL").optional(),
  file: z.instanceof(File).optional(),
}).refine(data => {
  // For these submission types, require a URL
  if (['github', 'video'].includes(data.type)) {
    return !!data.url;
  }
  return true;
}, {
  message: "URL is required for this submission type",
  path: ['url']
}).refine(data => {
  // For these submission types, require a file
  if (['abstract', 'presentation', 'report', 'demo'].includes(data.type)) {
    return !!data.file;
  }
  return true;
}, {
  message: "File is required for this submission type",
  path: ['file']
});

export type SubmissionFormValues = z.infer<typeof submissionFormSchema>;

// Export a function to create a schema based on submission type
export const createSubmissionSchema = (
  type: string, 
  allowUrl: boolean, 
  requireFile: boolean
) => {
  let baseFields: any = {
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
  };

  // Add URL field if allowed
  if (allowUrl) {
    if (requireFile) {
      baseFields.url = z.string().url("Please enter a valid URL").optional();
    } else {
      baseFields.url = z.string().url("Please enter a valid URL");
    }
  }

  // Add file field if required
  if (requireFile) {
    baseFields.file = z.instanceof(File, { message: "File is required" });
  } else {
    baseFields.file = z.instanceof(File).optional();
  }

  return z.object(baseFields);
};

export const getSubmissionTypeOptions = () => [
  { value: "abstract", label: "Abstract" },
  { value: "presentation", label: "Presentation" },
  { value: "video", label: "Video" },
  { value: "github", label: "GitHub Repository" },
  { value: "demo", label: "Demo" },
  { value: "report", label: "Report" },
];

export const getSubmissionTypeLabel = (type: string) => {
  const option = getSubmissionTypeOptions().find(opt => opt.value === type);
  return option ? option.label : type;
};

export const getSubmissionRequirements = (type: string) => {
  switch (type) {
    case 'abstract':
      return {
        fileTypes: '.pdf,.doc,.docx',
        description: `Upload a PDF or Word document (max ${formatFileSize(5 * 1024 * 1024)})`,
        requiresFile: true,
        requiresUrl: false,
        maxSize: 5 * 1024 * 1024 // 5MB
      };
    case 'presentation':
      return {
        fileTypes: '.pdf,.ppt,.pptx',
        description: `Upload a PDF or PowerPoint presentation (max ${formatFileSize(10 * 1024 * 1024)})`,
        requiresFile: true,
        requiresUrl: false,
        maxSize: 10 * 1024 * 1024 // 10MB
      };
    case 'video':
      return {
        fileTypes: '',
        description: 'Provide a link to your video (YouTube, Vimeo, etc.)',
        requiresFile: false,
        requiresUrl: true,
        maxSize: 0
      };
    case 'github':
      return {
        fileTypes: '',
        description: 'Provide a link to your GitHub repository',
        requiresFile: false,
        requiresUrl: true,
        maxSize: 0
      };
    case 'demo':
      return {
        fileTypes: '.zip,.rar',
        description: `Upload a compressed file containing your demo (max ${formatFileSize(MAX_FILE_SIZE)})`,
        requiresFile: true,
        requiresUrl: false,
        maxSize: MAX_FILE_SIZE
      };
    case 'report':
      return {
        fileTypes: '.pdf,.doc,.docx',
        description: `Upload a PDF or Word document (max ${formatFileSize(10 * 1024 * 1024)})`,
        requiresFile: true,
        requiresUrl: false,
        maxSize: 10 * 1024 * 1024 // 10MB
      };
    default:
      return {
        fileTypes: '',
        description: '',
        requiresFile: false,
        requiresUrl: false,
        maxSize: 0
      };
  }
};

// Helper function to format file sizes
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
