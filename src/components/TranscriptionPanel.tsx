import React from 'react';
import { FileText, Loader } from 'lucide-react';

interface TranscriptionPanelProps {
  transcription: string;
  isRecording: boolean;
  onGenerateNotes: () => void;
  isGeneratingNotes: boolean;
}

const TranscriptionPanel: React.FC<TranscriptionPanelProps> = ({
  transcription,
  isRecording,
  onGenerateNotes,
  isGeneratingNotes
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="font-medium">Transcription</h3>
        
        {transcription && !isRecording && (
          <button
            onClick={onGenerateNotes}
            disabled={isGeneratingNotes}
            className="flex items-center px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGeneratingNotes ? (
              <>
                <Loader className="h-4 w-4 mr-2 animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <FileText className="h-4 w-4 mr-2" />
                <span>Generate Notes</span>
              </>
            )}
          </button>
        )}
      </div>
      
      <div className="flex-1 p-4 overflow-auto">
        {isRecording && !transcription && (
          <div className="flex items-center justify-center h-full text-gray-500">
            <Loader className="h-5 w-5 animate-spin mr-2" />
            <span>Waiting for speech...</span>
          </div>
        )}
        
        {transcription ? (
          <div className="prose max-w-none">
            <div className="whitespace-pre-wrap">{transcription}</div>
          </div>
        ) : !isRecording ? (
          <div className="text-center py-12 text-gray-500">
            <p>Start recording to see the transcription here</p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default TranscriptionPanel;