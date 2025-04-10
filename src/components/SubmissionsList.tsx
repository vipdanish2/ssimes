
import React from 'react';
import { Submission } from '@/types';
import { useSubmissions } from '@/hooks/useSubmissions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, ExternalLink, FileText, Github, Video, Globe, Loader2 } from 'lucide-react';

interface SubmissionsListProps {
  teamId: string;
}

const getSubmissionIcon = (type: Submission['type']) => {
  switch (type) {
    case 'abstract':
    case 'presentation':
    case 'report':
      return <FileText className="h-4 w-4" />;
    case 'video':
      return <Video className="h-4 w-4" />;
    case 'github':
      return <Github className="h-4 w-4" />;
    case 'demo':
      return <Globe className="h-4 w-4" />;
    default:
      return <FileText className="h-4 w-4" />;
  }
};

const SubmissionsList: React.FC<SubmissionsListProps> = ({ teamId }) => {
  const { getTeamSubmissions, getFileUrl } = useSubmissions();
  const { data: submissions, isLoading } = getTeamSubmissions(teamId);

  const formatSubmissionType = (type: Submission['type']) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Submissions</CardTitle>
          <CardDescription>Loading submissions...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center p-6">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (!submissions || submissions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Submissions</CardTitle>
          <CardDescription>Your team's project submissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center p-6 text-muted-foreground">
            No submissions found. Start by submitting your project materials.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Submissions</CardTitle>
        <CardDescription>Your team's project submissions</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead>Version</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {submissions.map((submission) => (
              <TableRow key={submission.id}>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    {getSubmissionIcon(submission.type)}
                    <span>{formatSubmissionType(submission.type)}</span>
                  </div>
                </TableCell>
                <TableCell>{submission.title}</TableCell>
                <TableCell>
                  {formatDistanceToNow(new Date(submission.submitted_at), { addSuffix: true })}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">v{submission.version}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  {submission.file_path && (
                    <Button
                      variant="ghost"
                      size="icon"
                      asChild
                    >
                      <a 
                        href={getFileUrl(submission.file_path)} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        title="Download file"
                      >
                        <Download className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                  
                  {submission.url && (
                    <Button
                      variant="ghost"
                      size="icon"
                      asChild
                    >
                      <a 
                        href={submission.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        title="Open link"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default SubmissionsList;
