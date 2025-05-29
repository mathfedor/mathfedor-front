import React from 'react';

interface AlertDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
}

export const AlertDialog: React.FC<AlertDialogProps> = ({
  isOpen,
  onClose,
  title,
  message,
}) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
        onClick={onClose}
      >
        {/* Modal */}
        <div 
          className="bg-[#1E1F25] rounded-lg p-6 max-w-md w-full mx-4 shadow-xl"
          onClick={e => e.stopPropagation()}
        >
          <h3 className="text-xl font-medium text-white mb-2">{title}</h3>
          <p className="text-gray-300 mb-6">{message}</p>
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-[#282828] hover:bg-[#363636] text-white rounded-md transition-colors"
            >
              Aceptar
            </button>
          </div>
        </div>
      </div>
    </>
  );
}; 