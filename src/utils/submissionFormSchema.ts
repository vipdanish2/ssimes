import { z } from 'zod';

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
        description: 'Upload a PDF or Word document (max 5MB)',
        requiresFile: true,
        requiresUrl: false,
      };
    case 'presentation':
      return {
        fileTypes: '.pdf,.ppt,.pptx',
        description: 'Upload a PDF or PowerPoint presentation (max 10MB)',
        requiresFile: true,
        requiresUrl: false,
      };
    case 'video':
      return {
        fileTypes: '',
        description: 'Provide a link to your video (YouTube, Vimeo, etc.)',
        requiresFile: false,
        requiresUrl: true,
      };
    case 'github':
      return {
        fileTypes: '',
        description: 'Provide a link to your GitHub repository',
        requiresFile: false,
        requiresUrl: true,
      };
    case 'demo':
      return {
        fileTypes: '.zip,.rar',
        description: 'Upload a compressed file containing your demo (max 50MB)',
        requiresFile: true,
        requiresUrl: false,
      };
    case 'report':
      return {
        fileTypes: '.pdf,.doc,.docx',
        description: 'Upload a PDF or Word document (max 10MB)',
        requiresFile: true,
        requiresUrl: false,
      };
    default:
      return {
        fileTypes: '',
        description: '',
        requiresFile: false,
        requiresUrl: false,
      };
  }
};
