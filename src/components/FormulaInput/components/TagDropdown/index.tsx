import React, { useState, useRef, useEffect, RefObject } from 'react';
import { ChevronDown, X, Variable } from 'lucide-react';

// i will create an import alias with eslint if i make it in time
import useFormulaStore from '../../store/formulaStore';


interface TagDropdownProps {
  token: string;
  index: number;
  onUpdate: (index: number, newToken: string) => void;
  onDelete: (index: number) => void;
  attachedRef: RefObject<HTMLSpanElement>;
}

const TagDropdown: React.FC<TagDropdownProps> = ({ token, index, onUpdate, onDelete, attachedRef }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { variables } = useFormulaStore();

  useEffect(() => {
    if (isOpen && attachedRef.current) {
      const rect = attachedRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX
      });
    }
  }, [isOpen, attachedRef]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const isVariable = variables[token] !== undefined;

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="ml-1 p-0.5 rounded hover:bg-blue-200 transition-colors"
        type="button"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <ChevronDown size={12} />
      </button>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="fixed bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-48 py-2"
          style={{ top: position.top, left: position.left }}
        >
          <div className="px-3 py-2 text-xs font-medium text-gray-500 border-b border-gray-100">
            {token} Options
          </div>

          {isVariable && (
            <div className="px-3 py-2 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <Variable size={14} />
                <span>Value: {variables[token]}</span>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={() => {
              const newValue = prompt(`Edit ${token}:`, token);
              if (newValue !== null) {
                onUpdate(index, newValue);
              }
              setIsOpen(false);
            }}
            className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
          >
            <span>Edit</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onDelete(index);
              setIsOpen(false);
            }}
            className="w-full px-3 py-2 text-left text-sm hover:bg-red-50 text-red-600 flex items-center gap-2"
          >
            <X size={14} />
            <span>Delete</span>
          </button>
        </div>
      )}
    </>
  );
};

export default TagDropdown