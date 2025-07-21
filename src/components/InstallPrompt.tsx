import React from 'react';
import { Download, X, Smartphone, Monitor } from 'lucide-react';
import { usePWA } from '../hooks/usePWA';

const InstallPrompt: React.FC = () => {
  const { showInstallPrompt, setShowInstallPrompt, installApp, isInstallable } = usePWA();

  if (!showInstallPrompt || !isInstallable) return null;

  const handleInstall = async () => {
    await installApp();
    setShowInstallPrompt(false);
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-sm">
      <div className="bg-slate-800/95 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Download className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Install BlogSphere</h3>
              <p className="text-gray-300 text-sm">Get the full app experience</p>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="p-1 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center space-x-3 text-gray-300 text-sm">
            <Smartphone className="w-4 h-4 text-indigo-400" />
            <span>Works offline</span>
          </div>
          <div className="flex items-center space-x-3 text-gray-300 text-sm">
            <Monitor className="w-4 h-4 text-indigo-400" />
            <span>Native app experience</span>
          </div>
          <div className="flex items-center space-x-3 text-gray-300 text-sm">
            <Download className="w-4 h-4 text-indigo-400" />
            <span>Fast loading</span>
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={handleInstall}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 font-medium"
          >
            Install
          </button>
          <button
            onClick={handleDismiss}
            className="px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            Later
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstallPrompt;