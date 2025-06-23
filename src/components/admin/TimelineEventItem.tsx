
import React from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Calendar, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

interface TimelineEventItemProps {
  event: any;
  onEdit: (event: any) => void;
  onToggleActive: (event: any) => void;
  onDelete: (id: string) => void;
  isUpdating: boolean;
  isDeleting: boolean;
}

const TimelineEventItem: React.FC<TimelineEventItemProps> = ({
  event,
  onEdit,
  onToggleActive,
  onDelete,
  isUpdating,
  isDeleting
}) => {
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this timeline event?')) {
      onDelete(event.id);
    }
  };

  return (
    <div className="flex items-center justify-between p-4 rounded-md border">
      <div className="flex-1">
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <h3 className="font-semibold">{event.title}</h3>
          <span className={`px-2 py-1 text-xs rounded-full ${
            event.is_active 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-800'
          }`}>
            {event.is_active ? 'Active' : 'Inactive'}
          </span>
        </div>
        {event.description && (
          <p className="text-sm text-muted-foreground mt-1">
            {event.description}
          </p>
        )}
        <p className="text-sm text-muted-foreground mt-1">
          Date: {format(new Date(event.event_date), 'PPP')}
        </p>
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          checked={event.is_active}
          onCheckedChange={() => onToggleActive(event)}
          disabled={isUpdating}
        />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onEdit(event)}
          disabled={isUpdating}
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </div>
    </div>
  );
};

export default TimelineEventItem;
