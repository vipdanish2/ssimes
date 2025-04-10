
import React, { useState } from 'react';
import { useTimeline } from '@/hooks/useTimeline';
import { TimelineEvent } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { Calendar as CalendarIcon, Edit, Plus, Trash2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Loader2 } from 'lucide-react';

interface TimelineEditFormProps {
  event?: TimelineEvent;
  onSave: (data: any) => Promise<void>;
  onCancel: () => void;
}

const TimelineEditForm: React.FC<TimelineEditFormProps> = ({ event, onSave, onCancel }) => {
  const [title, setTitle] = useState(event?.title || '');
  const [description, setDescription] = useState(event?.description || '');
  const [date, setDate] = useState<Date | undefined>(
    event?.event_date ? new Date(event.event_date) : new Date()
  );
  const [isActive, setIsActive] = useState(event?.is_active ?? true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Title is required',
        variant: 'destructive',
      });
      return;
    }

    if (!date) {
      toast({
        title: 'Validation Error',
        description: 'Date is required',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSave({
        title,
        description: description || null,
        event_date: date.toISOString(),
        is_active: isActive,
      });
      
      onCancel();
    } catch (error) {
      // Error is handled in the hook
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Event title"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Event description"
          rows={3}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="event-date">Event Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="event-date"
              variant="outline"
              className="w-full justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, 'PPP') : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(date) => setDate(date)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch
          id="is-active"
          checked={isActive}
          onCheckedChange={setIsActive}
        />
        <Label htmlFor="is-active">Active</Label>
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {event ? 'Update' : 'Create'} Event
        </Button>
      </div>
    </form>
  );
};

const TimelineEditor: React.FC = () => {
  const { timelineEvents, isLoading, createTimelineEvent, updateTimelineEvent, deleteTimelineEvent } = useTimeline();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<TimelineEvent | null>(null);
  const [deleteConfirmEvent, setDeleteConfirmEvent] = useState<TimelineEvent | null>(null);

  const handleAddEvent = async (data: any) => {
    await createTimelineEvent(data);
    setShowAddForm(false);
  };

  const handleUpdateEvent = async (data: any) => {
    if (editingEvent) {
      await updateTimelineEvent(editingEvent.id, data);
      setEditingEvent(null);
    }
  };

  const handleDeleteEvent = async () => {
    if (deleteConfirmEvent) {
      await deleteTimelineEvent(deleteConfirmEvent.id);
      setDeleteConfirmEvent(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Timeline Management</h2>
        <Button onClick={() => setShowAddForm(true)} disabled={showAddForm}>
          <Plus className="h-4 w-4 mr-2" />
          Add Event
        </Button>
      </div>

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Timeline Event</CardTitle>
          </CardHeader>
          <CardContent>
            <TimelineEditForm
              onSave={handleAddEvent}
              onCancel={() => setShowAddForm(false)}
            />
          </CardContent>
        </Card>
      )}

      {editingEvent && (
        <Card>
          <CardHeader>
            <CardTitle>Edit Timeline Event</CardTitle>
          </CardHeader>
          <CardContent>
            <TimelineEditForm
              event={editingEvent}
              onSave={handleUpdateEvent}
              onCancel={() => setEditingEvent(null)}
            />
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {timelineEvents.length === 0 ? (
          <Card>
            <CardContent className="flex justify-center items-center h-24">
              <p className="text-muted-foreground">No timeline events found. Create one to get started.</p>
            </CardContent>
          </Card>
        ) : (
          timelineEvents.map((event) => (
            <Card key={event.id} className={!event.is_active ? "opacity-60" : ""}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-semibold">{event.title}</h3>
                      {!event.is_active && (
                        <span className="inline-flex items-center rounded-full bg-muted px-2 py-1 text-xs">
                          Inactive
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(event.event_date), 'PPP')}
                    </p>
                    {event.description && (
                      <p className="mt-2 text-sm">{event.description}</p>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setEditingEvent(event)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setDeleteConfirmEvent(event)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <AlertDialog open={!!deleteConfirmEvent} onOpenChange={(open) => !open && setDeleteConfirmEvent(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the timeline event
              "{deleteConfirmEvent?.title}" and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteEvent}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TimelineEditor;
