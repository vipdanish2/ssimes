
import { User } from '@/context/AuthContext';

export interface Team {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  creator_id: string;
  mentor_id?: string;
}

export interface TeamMember {
  id: string;
  team_id: string;
  user_id: string;
  role: 'leader' | 'member';
  joined_at: string;
  user?: User;
}

export interface Submission {
  id: string;
  team_id: string;
  type: 'abstract' | 'presentation' | 'video' | 'github' | 'demo' | 'report';
  title: string;
  description?: string;
  file_path?: string;
  url?: string;
  submitted_at: string;
  submitted_by: string;
  version: number;
}

export interface SubmissionFile {
  name: string;
  size: number;
  type: string;
  file: File;
}
