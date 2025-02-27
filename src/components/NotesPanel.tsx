import React from 'react';
import { Loader } from 'lucide-react';

interface NotesPanelProps {
  notes: string;
  isLoading: boolean;
}

const NotesPanel: React.FC<NotesPanelProps> = ({ notes, isLoading }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-medium">Meeting Notes</h3>
      </div>
      
      <div className="flex-1 p-4 overflow-auto">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="flex items-center space-x-3">
              <Loader className="h-5 w-5 text-blue-600 animate-spin" />
              <span className="text-gray-600">Generating meeting notes...</span>
            </div>
          </div>
        ) : notes ? (
          <div className="prose max-w-none">
            <div className="whitespace-pre-wrap">{notes}</div>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <p>Generate notes from the transcription to see them here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotesPanel;