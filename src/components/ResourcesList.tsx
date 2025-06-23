
import React from 'react';
import { useResources } from '@/hooks/useResources';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, FileText, Download, ExternalLink } from 'lucide-react';

const ResourcesList: React.FC = () => {
  const { resources, resourcesLoading } = useResources();

  if (resourcesLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Resources</CardTitle>
          <CardDescription>Loading resources...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center p-6">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Resources
        </CardTitle>
        <CardDescription>
          Access important documents and resources for your project
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {resources.length === 0 ? (
            <div className="text-center p-6 text-muted-foreground">
              No resources available at the moment.
            </div>
          ) : (
            resources.map((resource) => (
              <div
                key={resource.id}
                className="flex items-center justify-between p-4 rounded-md border hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1">
                  <h3 className="font-semibold">{resource.title}</h3>
                  {resource.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {resource.description}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    Type: {resource.resource_type} • Added: {new Date(resource.created_at).toLocaleDateString()}
                  </p>
                </div>
                {resource.file_url && (
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                  >
                    <a
                      href={resource.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                    >
                      <ExternalLink className="h-4 w-4" />
                      View
                    </a>
                  </Button>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ResourcesList;
