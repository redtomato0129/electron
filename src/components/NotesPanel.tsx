import React from 'react';
import { MoreHorizontal } from 'lucide-react';

interface NotesPanelProps {
  isRecording: boolean;
}

const NotesPanel: React.FC<NotesPanelProps> = ({ isRecording }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-3 h-[200px]">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-sm font-medium">Add notes</h2>
        <button className="text-gray-500 hover:text-gray-700">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>

      <div className="text-sm text-gray-500 italic">
        {isRecording ? 'Recording in progress. Click here to add notes' : 'Start recording to add notes'}
      </div>

      <button className="absolute bottom-4 right-4 bg-gray-100 rounded-full p-2">
        <span className="text-xl">+</span>
      </button>
    </div>
  );
};

export default NotesPanel;