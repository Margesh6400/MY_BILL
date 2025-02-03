import React, { useState, useCallback, memo } from "react";

// Memoized option component for better performance
const DropdownOption = memo(({ option, onSelect }) => (
  <div
    role="option"
    aria-selected="false"
    onClick={onSelect}
    className="px-4 py-2 text-black bg-white cursor-pointer hover:bg-green-100 focus:bg-green-100 focus:outline-none"
    tabIndex={0}
    onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onSelect(e);
      }
    }}
  >
    {option.toUpperCase()}
  </div>
));

DropdownOption.displayName = 'DropdownOption';

const SingleSelectionDropdown = ({ formData, setFormData }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Move options outside component to prevent recreating on each render
  const OPTIONS = ["SS", "SK", "શિવમ", "નવી", "અન્ય."];

  // Memoize handlers to prevent recreating on each render
  const handleSelect = useCallback((option, event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    setFormData(prev => ({
      ...prev,
      selectedMarkOption: option.toUpperCase()
    }));
    setIsOpen(false);
  }, [setFormData]);

  const toggleDropdown = useCallback((event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    setIsOpen(prev => !prev);
  }, []);

  // Handle click outside using React's built-in event delegation
  React.useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((event) => {
    if (event.key === 'Escape') {
      setIsOpen(false);
    }
  }, []);

  return (
    <div 
      className="relative inline-block mt-2 dropdown-container"
      onKeyDown={handleKeyDown}
      role="combobox"
      aria-expanded={isOpen}
      aria-haspopup="listbox"
    >
      <button
        type="button"
        onClick={toggleDropdown}
        className="px-4 py-2 text-white transition-colors bg-green-500 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300"
        aria-label="Toggle dropdown"
      >
        {formData.selectedMarkOption || 'માર્કો'}
      </button>

      {isOpen && (
        <div 
          className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg"
          role="listbox"
        >
          {OPTIONS.map((option) => (
            <DropdownOption
              key={option}
              option={option}
              onSelect={(e) => handleSelect(option, e)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default memo(SingleSelectionDropdown);