
import React from 'react';
import { FileText, ExternalLink, Github, Monitor, Upload, Video } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import SubmissionForm from '@/components/SubmissionForm';

interface SubmissionOptionsProps {
  teamId: string;
}

const SubmissionOptions: React.FC<SubmissionOptionsProps> = ({ teamId }) => {
  const submissionTypes = [
    {
      type: 'abstract' as const,
      title: 'Abstract',
      description: 'Upload your project abstract (PDF)',
      icon: <FileText className="h-6 w-6 text-primary" />,
      acceptFiles: '.pdf,.doc,.docx',
      allowUrl: false,
    },
    {
      type: 'presentation' as const,
      title: 'PowerPoint Presentation',
      description: 'Upload your project presentation slides',
      icon: <FileText className="h-6 w-6 text-primary" />,
      acceptFiles: '.pdf,.ppt,.pptx',
      allowUrl: false,
    },
    {
      type: 'report' as const,
      title: 'Final Report',
      description: 'Upload your final project report (PDF)',
      icon: <FileText className="h-6 w-6 text-primary" />,
      acceptFiles: '.pdf,.doc,.docx',
      allowUrl: false,
    },
    {
      type: 'github' as const,
      title: 'Repository Link',
      description: 'Link to your project repository (GitHub)',
      icon: <Github className="h-6 w-6 text-primary" />,
      acceptFiles: '',
      allowUrl: true,
    },
    {
      type: 'video' as const,
      title: 'Video Explanation',
      description: 'Link to your project demo video',
      icon: <Video className="h-6 w-6 text-primary" />,
      acceptFiles: '.mp4,.mov,.avi',
      allowUrl: true,
    },
    {
      type: 'demo' as const,
      title: 'Live Demo',
      description: 'Link to your live demo application',
      icon: <Monitor className="h-6 w-6 text-primary" />,
      acceptFiles: '',
      allowUrl: true,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Submit Project Materials</CardTitle>
        <CardDescription>
          Upload your project documents and provide repository links
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {submissionTypes.map((item) => (
            <SubmissionForm
              key={item.type}
              teamId={teamId}
              type={item.type}
              title={item.title}
              description={item.description}
              icon={item.icon}
              acceptFiles={item.acceptFiles}
              allowUrl={item.allowUrl}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SubmissionOptions;
