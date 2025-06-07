/* eslint-disable jsx-a11y/role-supports-aria-props */
import React, { useState, useRef } from 'react';
import { Calculator, Variable, Hash } from 'lucide-react';

import useFormulaStore from './store/formulaStore';
import useAutocomplete from './hooks/useAutocomplete';

import TagDropdown from './components/TagDropdown';

// need to create an correct prettier options, sorry if I don't make it :)
import { FORMULA_BUILDER, FORMULA_BUILDER_DISCLAIMER, INPUT_PLACEHOLDER, OPERATORS } from './config';

const FormulaInput: React.FC = () => {
  const { formula, addToken, removeToken, updateToken, calculateResult } = useFormulaStore();
  const [inputValue, setInputValue] = useState<string>('');
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const tagRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const { data: suggestions = [] } = useAutocomplete(inputValue);

  const isOperator = (char: string) => OPERATORS.includes(char);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setShowSuggestions(value.length > 0);
    setSelectedSuggestion(0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (showSuggestions && suggestions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedSuggestion(prev =>
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedSuggestion(prev =>
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        return;
      }
      if (e.key === 'Tab' || e.key === 'Enter') {
        e.preventDefault();
        addSuggestion(suggestions[selectedSuggestion]);
        return;
      }
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      if (inputValue.trim()) {
        addToken(inputValue.trim());
        setInputValue('');
        setShowSuggestions(false);
      }
    } else if (e.key === 'Backspace' && inputValue === '' && formula.length > 0) {
      removeToken(formula.length - 1);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }

    if (isOperator(e.key)) {
      e.preventDefault();
      if (inputValue.trim()) {
        addToken(inputValue.trim());
        setInputValue('');
      }
      addToken(e.key);
      setShowSuggestions(false);
    }

    if (e.key === ' ' && inputValue.trim()) {
      e.preventDefault();
      addToken(inputValue.trim());
      setInputValue('');
      setShowSuggestions(false);
    }
  };

  const addSuggestion = (suggestion: string) => {
    addToken(suggestion);
    setInputValue('');
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const getTokenStyle = (token: string) => {
    if (isOperator(token)) {
      return 'bg-orange-100 text-orange-800 border-orange-200';
    }
    if (!isNaN(parseFloat(token))) {
      return 'bg-green-100 text-green-800 border-green-200';
    }
    return 'bg-blue-100 text-blue-800 border-blue-200';
  };

  const getTokenIcon = (token: string) => {
    if (isOperator(token)) return null;
    if (!isNaN(parseFloat(token))) return <Hash size={12} />;
    return <Variable size={12} />;
  };

  const result = calculateResult();

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-800">{FORMULA_BUILDER}</h1>
        <p className="text-gray-600">{FORMULA_BUILDER_DISCLAIMER}</p>
      </div>

      <div className="relative" ref={containerRef}>
        <div className="formula-input-container border-2 border-gray-200 rounded-xl p-4 bg-white shadow-sm hover:border-blue-300 transition-colors min-h-[80px]">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {formula.map((token, index) => (
              <span
                key={index}
                ref={(el) => {
                tagRefs.current[index] = el;
                }}                
                className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold cursor-default select-none ${getTokenStyle(token)}`}
              >
                {getTokenIcon(token)}
                <span>{token}</span>
                <TagDropdown
                  token={token}
                  index={index}
                  onUpdate={updateToken}
                  onDelete={removeToken}
                  attachedRef={{ current: tagRefs.current[index]! }}
                />
              </span>
            ))}
            <input
              ref={inputRef}
              type="text"
              className="flex-grow min-w-[8rem] border-none outline-none text-sm p-1"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={INPUT_PLACEHOLDER}
              autoComplete="off"
              spellCheck={false}
              aria-label="Formula input"
              aria-autocomplete="list"
              aria-expanded={showSuggestions}
              aria-controls="autocomplete-list"
            />
          </div>

          {showSuggestions && suggestions.length > 0 && (
            <ul
              id="autocomplete-list"
              role="listbox"
              className="absolute z-50 mt-1 w-full max-w-md bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-auto"
            >
              {suggestions.map((suggestion, i) => (
                <li
                  key={suggestion}
                  role="option"
                  aria-selected={selectedSuggestion === i}
                  className={`cursor-pointer select-none px-3 py-2 hover:bg-blue-500 hover:text-white ${
                    selectedSuggestion === i ? 'bg-blue-600 text-white' : ''
                  }`}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    addSuggestion(suggestion);
                  }}
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>

        {result !== null && (
          <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 text-green-800">
              <Calculator size={20} />
              <span className="font-medium">Result: </span>
              <span className="text-xl font-bold">{result.toLocaleString()}</span>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <Variable size={18} />
            Available Variables
          </h3>
          <div className="space-y-2">
            {Object.entries(useFormulaStore.getState().variables).map(([name, value]) => (
              <div key={name} className="flex justify-between items-center p-2 bg-white rounded border">
                <span className="font-medium text-gray-700">{name}</span>
                <span className="text-blue-600 font-mono">{value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-800 mb-3">Keyboard Shortcuts</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <div><kbd className="px-2 py-1 bg-white rounded border">Enter</kbd> Add token</div>
            <div><kbd className="px-2 py-1 bg-white rounded border">Tab</kbd> Accept suggestion</div>
            <div><kbd className="px-2 py-1 bg-white rounded border">↑↓</kbd> Navigate suggestions</div>
            <div><kbd className="px-2 py-1 bg-white rounded border">Backspace</kbd> Delete last token</div>
            <div><kbd className="px-2 py-1 bg-white rounded border">Space</kbd> Separate tokens</div>
            <div>Operators: <kbd className="px-1 py-0.5 bg-white rounded border text-xs">+ - * / ^ ( )</kbd></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormulaInput