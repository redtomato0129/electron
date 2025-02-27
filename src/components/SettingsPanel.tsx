import React from 'react';
import { X, RefreshCw, AlertTriangle } from 'lucide-react';

interface AudioDevice {
  id: string;
  name: string;
  type: 'microphone' | 'system';
}

interface SettingsPanelProps {
  onClose: () => void;
  audioDevices: AudioDevice[];
  selectedMicrophone: string | null;
  selectedSpeaker: string | null;
  hasLoopbackDevice: boolean;
  onSelectMicrophone: (id: string) => void;
  onSelectSpeaker: (id: string) => void;
  onRefreshDevices: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  onClose,
  audioDevices,
  selectedMicrophone,
  selectedSpeaker,
  hasLoopbackDevice,
  onSelectMicrophone,
  onSelectSpeaker,
  onRefreshDevices
}) => {
  const microphones = audioDevices.filter(device => device.type === 'microphone');
  const speakers = audioDevices.filter(device => device.type === 'system');
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium">Settings</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Microphone selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Microphone
            </label>
            <div className="space-y-2">
              {microphones.length > 0 ? (
                microphones.map(device => (
                  <div 
                    key={device.id}
                    className={`p-3 border rounded-lg cursor-pointer ${
                      selectedMicrophone === device.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                    onClick={() => onSelectMicrophone(device.id)}
                  >
                    <div className="font-medium">{device.name}</div>
                  </div>
                ))
              ) : (
                <div className="text-gray-500 text-sm">No microphones detected</div>
              )}
            </div>
          </div>
          
          {/* System audio selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              System Audio
            </label>
            
            {!hasLoopbackDevice && (
              <div className="mb-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start">
                <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-yellow-700">
                  <p className="font-medium mb-1">System audio capture requires additional setup</p>
                  <p>On macOS, install BlackHole or Loopback. On Windows, use VB-Audio Virtual Cable.</p>
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              {speakers.length > 0 ? (
                speakers.map(device => (
                  <div 
                    key={device.id}
                    className={`p-3 border rounded-lg cursor-pointer ${
                      selectedSpeaker === device.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                    onClick={() => onSelectSpeaker(device.id)}
                  >
                    <div className="font-medium">{device.name}</div>
                  </div>
                ))
              ) : (
                <div className="text-gray-500 text-sm">No system audio devices detected</div>
              )}
            </div>
          </div>
        </div>
        
        <div className="px-6 py-4 bg-gray-50 rounded-b-lg flex justify-between">
          <button
            onClick={onRefreshDevices}
            className="flex items-center text-gray-700 hover:text-gray-900"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            <span>Refresh devices</span>
          </button>
          
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;