
import { z } from 'zod';
import { Submission } from '@/types';

export const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

export const createSubmissionSchema = (
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
