import React from 'react';
import { MoreHorizontal } from 'lucide-react';

interface NotesPanelProps {
  isRecording: boolean;
}

const NotesPanel: React.FC<NotesPanelProps> = ({ isRecording }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">Add notes</h2>
        <button className="text-gray-500 hover:text-gray-700">
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </div>

      <div className="text-gray-500 italic">
        {isRecording ? 'Recording in progress. Click here to add notes' : 'Start recording to add notes'}
      </div>

      <button className="absolute bottom-4 right-4 bg-gray-100 rounded-full p-2">
        <span className="text-2xl">+</span>
      </button>
    </div>
  );
};

export default NotesPanel;