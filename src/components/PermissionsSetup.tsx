import React, { useState, useEffect } from 'react';
import { Mic, MonitorDot, MonitorUp } from 'lucide-react';

interface PermissionsSetupProps {
  onComplete: () => void;
}

const PermissionsSetup: React.FC<PermissionsSetupProps> = ({ onComplete }) => {
  const [microphoneEnabled, setMicrophoneEnabled] = useState(false);
  const [accessibilityEnabled, setAccessibilityEnabled] = useState(false);
  const [screenRecordingEnabled, setScreenRecordingEnabled] = useState(false);

  // Check initial permission status
  useEffect(() => {
    const checkPermissions = async () => {
      try {
        const micStatus = await window.electron.systemPreferences.getMediaAccessStatus('microphone');
        setMicrophoneEnabled(micStatus === 'granted');

        const accessibilityStatus = await window.electron.systemPreferences.getMediaAccessStatus('accessibility');
        setAccessibilityEnabled(accessibilityStatus === 'granted');

        const screenStatus = await window.electron.systemPreferences.getMediaAccessStatus('screen');
        setScreenRecordingEnabled(screenStatus === 'granted');
      } catch (error) {
        console.error('Error checking permissions:', error);
      }
    };

    checkPermissions();
  }, []);

  const handleMicrophonePermission = async () => {
    try {
      const hasPermission = await window.electron.systemPreferences.askForMediaAccess('microphone');
      setMicrophoneEnabled(hasPermission);
    } catch (error) {
      console.error('Microphone permission denied:', error);
    }
  };

  const handleAccessibilityPermission = async () => {
    try {
      const hasPermission = await window.electron.systemPreferences.askForMediaAccess('accessibility');
      setAccessibilityEnabled(hasPermission);
    } catch (error) {
      console.error('Accessibility permission denied:', error);
    }
  };

  const handleScreenRecordingPermission = async () => {
    try {
      const hasPermission = await window.electron.systemPreferences.askForMediaAccess('screen');
      setScreenRecordingEnabled(hasPermission);
    } catch (error) {
      console.error('Screen recording permission denied:', error);
    }
  };

  return (
    <div className="p-6">
      <div className="space-y-6">
        <div className="text-center" style={{paddingTop: '20px'}}>
          <h6 className=" font-semibold mb-2">Welcome to Voice Recorder</h6>
          <p className="text-gray-600">Enable permissions to get started</p>
        </div>

        <div className="space-y-1">
          <div className="rounded-2xl p-1">
            <div className="flex items-center justify-between bg-gray-100 p-2 rounded-full">
              <div className="flex items-center gap-3">
                <Mic className="h-5 w-5" />
                <span>Microphone</span>
              </div>
              <button
                onClick={handleMicrophonePermission}
                className={`px-4 py-1 rounded-full text-sm shadow-sm hover:shadow transition-all ${
                  microphoneEnabled 
                    ? 'bg-gray-200' 
                    : 'bg-gray-200'
                }`}
              >
                Done
              </button>
            </div>
          </div>

          <div className="rounded-2xl p-1">
            <div className="flex items-center justify-between bg-gray-100 p-2 rounded-full">
              <div className="flex items-center gap-3">
                <MonitorDot className="h-5 w-5" />
                <span>Accessibility</span>
              </div>
              <button
                onClick={handleAccessibilityPermission}
                className={`px-4 py-1 rounded-full text-sm shadow-sm hover:shadow transition-all ${
                  accessibilityEnabled 
                    ? 'bg-gray-200' 
                    : 'bg-gray-200'
                }`}
              >
                Done
              </button>
            </div>
          </div>

          <div className="rounded-2xl p-1">
            <div className="flex items-center justify-between bg-gray-100 p-2 rounded-full">
              <div className="flex items-center gap-3">
                <MonitorUp className="h-5 w-5" />
                <span>Screen recording</span>
              </div>
              <button
                onClick={handleScreenRecordingPermission}
                className={`px-4 py-1 rounded-full text-sm shadow-sm hover:shadow transition-all ${
                  screenRecordingEnabled 
                    ? 'bg-gray-200' 
                    : 'bg-blue-600 text-white'
                }`}
              >
                {screenRecordingEnabled ? 'Done' : 'Enable'}
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={onComplete}
          disabled={!microphoneEnabled || !accessibilityEnabled || !screenRecordingEnabled}
          className="w-full py-3 bg-black text-white rounded-full shadow-md hover:shadow-lg disabled:opacity-50 disabled:shadow-none transition-all mt-6"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default PermissionsSetup; 