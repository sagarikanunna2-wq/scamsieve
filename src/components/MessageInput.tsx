import { useState, useRef, useEffect } from 'react';
import type { ChangeEvent, FormEvent, KeyboardEvent } from 'react';
import { Send, Trash2, Loader2, AlertCircle } from 'lucide-react';
import { MAX_INPUT_LENGTH, MIN_INPUT_LENGTH, validateInput } from '../services/analyzeOrchestrator';

interface MessageInputProps {
  onAnalyze: (text: string) => void;
  onClear: () => void;
  isAnalyzing: boolean;
  externalText?: string;
}

export default function MessageInput({
  onAnalyze,
  onClear,
  isAnalyzing,
  externalText,
}: MessageInputProps) {
  const [text, setText] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Sync external text (from sample selection)
  useEffect(() => {
    if (externalText !== undefined && externalText !== text) {
      setText(externalText);
      setValidationError(null);
      // Focus the textarea
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
    // We intentionally only react to externalText changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [externalText]);

  const charCount = text.length;
  const trimmedLength = text.trim().length;
  const isOverLimit = charCount > MAX_INPUT_LENGTH;
  const isEmpty = trimmedLength === 0;
  const isTooShort = trimmedLength > 0 && trimmedLength < MIN_INPUT_LENGTH;
  const canSubmit = !isEmpty && !isOverLimit && !isTooShort && !isAnalyzing;

  function handleChange(e: ChangeEvent<HTMLTextAreaElement>) {
    const value = e.target.value;
    setText(value);
    if (validationError) {
      setValidationError(null);
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const error = validateInput(text);
    if (error) {
      setValidationError(error);
      return;
    }
    setValidationError(null);
    onAnalyze(text.trim());
  }

  function handleClear() {
    setText('');
    setValidationError(null);
    onClear();
    textareaRef.current?.focus();
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    // Ctrl+Enter or Cmd+Enter to submit
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && canSubmit) {
      e.preventDefault();
      handleSubmit(e as unknown as FormEvent);
    }
  }

  return (
    <section id="analyze" className="w-full max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-1">
          Analyze a message
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Paste a suspicious SMS, email, job offer, or any message you want to check.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={text}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="Paste a suspicious SMS, email, or job offer here…"
              rows={6}
              maxLength={MAX_INPUT_LENGTH + 100} // Allow slight over-type for UX
              disabled={isAnalyzing}
              aria-label="Message to analyze"
              aria-describedby="char-counter validation-error"
              className={`w-full px-4 py-3 text-gray-800 bg-gray-50 border rounded-xl resize-y
                placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400
                disabled:opacity-60 disabled:cursor-not-allowed transition-colors
                ${isOverLimit ? 'border-red-400 focus:ring-red-300' : 'border-gray-200'}
                ${validationError ? 'border-red-400' : ''}
              `}
            />
          </div>

          {/* Character counter */}
          <div className="flex items-center justify-between mt-2 px-1">
            <div className="flex items-center gap-2">
              {validationError && (
                <p
                  id="validation-error"
                  className="text-sm text-red-600 flex items-center gap-1"
                  role="alert"
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {validationError}
                </p>
              )}
            </div>
            <p
              id="char-counter"
              className={`text-xs tabular-nums ${
                isOverLimit ? 'text-red-500 font-medium' : 'text-gray-400'
              }`}
            >
              {charCount.toLocaleString()}/{MAX_INPUT_LENGTH.toLocaleString()}
            </p>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-3 mt-4">
            <button
              type="submit"
              disabled={!canSubmit}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold
                transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
                ${
                  canSubmit
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500 shadow-md hover:shadow-lg'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing…
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Analyze Message
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleClear}
              disabled={isEmpty && !isAnalyzing}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium
                text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors
                disabled:opacity-40 disabled:cursor-not-allowed
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
            >
              <Trash2 className="w-4 h-4" />
              Clear
            </button>
          </div>

          <p className="text-xs text-gray-400 mt-3">
            Press <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-xs font-mono">Ctrl+Enter</kbd> to submit
          </p>
        </form>
      </div>
    </section>
  );
}
