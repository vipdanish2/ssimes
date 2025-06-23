
import React from 'react';
import TimelineEventItem from './TimelineEventItem';

interface TimelineEventsListProps {
  events: any[];
  onEdit: (event: any) => void;
  onToggleActive: (event: any) => void;
  onDelete: (id: string) => void;
  isUpdating: boolean;
  isDeleting: boolean;
}

const TimelineEventsList: React.FC<TimelineEventsListProps> = ({
  events,
  onEdit,
  onToggleActive,
  onDelete,
  isUpdating,
  isDeleting
}) => {
  if (events.length === 0) {
    return (
      <div className="text-center p-6 text-muted-foreground">
        No timeline events found. Create your first event to get started.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <TimelineEventItem
          key={event.id}
          event={event}
          onEdit={onEdit}
          onToggleActive={onToggleActive}
          onDelete={onDelete}
          isUpdating={isUpdating}
          isDeleting={isDeleting}
        />
      ))}
    </div>
  );
};

export default TimelineEventsList;
