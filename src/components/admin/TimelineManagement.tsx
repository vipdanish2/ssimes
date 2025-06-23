
import React, { useState } from 'react';
import { useTimelineEvents } from '@/hooks/useTimelineEvents';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, Plus } from 'lucide-react';
import TimelineEventForm from './TimelineEventForm';
import TimelineEventsList from './TimelineEventsList';

const TimelineManagement = () => {
  const { 
    allEvents, 
    isLoadingAll, 
    createEvent, 
    isCreating, 
    updateEvent, 
    isUpdating, 
    deleteEvent, 
    isDeleting 
  } = useTimelineEvents();
  
  const [open, setOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);

  const onSubmit = (values: any) => {
    if (editingEvent) {
      if (values.title && values.event_date) {
        updateEvent({
          id: editingEvent.id,
          updates: {
            title: values.title,
            event_date: values.event_date,
            description: values.description || undefined,
          },
        });
      }
    } else {
      const eventData: { title: string; description?: string; event_date: string } = {
        title: values.title,
        event_date: values.event_date,
        description: values.description || undefined,
      };
      createEvent(eventData);
    }
    setOpen(false);
    setEditingEvent(null);
  };

  const handleEdit = (event: any) => {
    setEditingEvent(event);
    setOpen(true);
  };

  const handleToggleActive = (event: any) => {
    updateEvent({
      id: event.id,
      updates: { is_active: !event.is_active },
    });
  };

  const handleDelete = (id: string) => {
    deleteEvent(id);
  };

  const handleNewEvent = () => {
    setEditingEvent(null);
    setOpen(true);
  };

  if (isLoadingAll) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Timeline Management</CardTitle>
          <CardDescription>Loading timeline events...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center p-6">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Timeline Management</CardTitle>
          <CardDescription>Manage project timeline events and milestones</CardDescription>
        </div>
        <Button onClick={handleNewEvent}>
          <Plus className="h-4 w-4 mr-2" />
          Add Event
        </Button>
      </CardHeader>
      <CardContent>
        <TimelineEventsList
          events={allEvents}
          onEdit={handleEdit}
          onToggleActive={handleToggleActive}
          onDelete={handleDelete}
          isUpdating={isUpdating}
          isDeleting={isDeleting}
        />
        <TimelineEventForm
          open={open}
          onOpenChange={setOpen}
          editingEvent={editingEvent}
          onSubmit={onSubmit}
          isCreating={isCreating}
          isUpdating={isUpdating}
        />
      </CardContent>
    </Card>
  );
};

export default TimelineManagement;
