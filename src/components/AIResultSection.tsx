import React, { useState } from 'react';
import Markdown from 'react-markdown';
import { AIAdvisoryResult } from '../types.ts';
import {
  Sparkles,
  Copy,
  Check,
  RotateCcw,
  Bot,
  User,
  GraduationCap,
  Clock,
  ArrowUp,
} from 'lucide-react';

interface AIResultSectionProps {
  result: AIAdvisoryResult;
  onClear: () => void;
  onScrollToForm: () => void;
}

export const AIResultSection: React.FC<AIResultSectionProps> = ({
  result,
  onClear,
  onScrollToForm,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback if clipboard API is restricted in iframe
      const textArea = document.createElement('textarea');
      textArea.value = result.content;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      id="ai-result-container"
      className="mt-6 pt-6 border-t-2 border-dashed border-blue-200/80 animate-in fade-in slide-in-from-bottom-3 duration-300"
    >
      {/* Result Header Badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 bg-gradient-to-r from-blue-50/90 to-indigo-50/70 p-3.5 rounded-xl border border-blue-100">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-[#4285f4] text-white flex items-center justify-center shadow-xs">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-gray-800">
                Kết quả tư vấn AI
              </h3>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-100 text-[#4285f4]">
                <Sparkles className="w-2.5 h-2.5" />
                {result.modelUsed}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 mt-0.5">
              <span className="flex items-center gap-1 font-medium text-gray-700">
                <User className="w-3 h-3 text-gray-400" />
                {result.studentName}
              </span>
              <span>&bull;</span>
              <span className="flex items-center gap-1 text-[#4285f4]">
                <GraduationCap className="w-3 h-3" />
                {result.majorName}
              </span>
              <span>&bull;</span>
              <span className="flex items-center gap-1 text-gray-400 text-[11px]">
                <Clock className="w-2.5 h-2.5" />
                {result.timestamp}
              </span>
            </div>
          </div>
        </div>

        {/* Action buttons on header */}
        <div className="flex items-center gap-1.5 ml-auto">
          <button
            id="btn-copy-ai-result"
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-medium transition-colors cursor-pointer shadow-2xs"
            title="Sao chép nội dung"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Đã chép</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-gray-500" />
                <span>Sao chép</span>
              </>
            )}
          </button>

          <button
            id="btn-scroll-top-form"
            type="button"
            onClick={onScrollToForm}
            className="p-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 transition-colors cursor-pointer"
            title="Cuộn lên biểu mẫu"
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Structured Advisory Content */}
      <div
        id="ai-advisory-content"
        className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs text-gray-800 leading-relaxed text-[14.5px]"
      >
        <div className="prose prose-sm max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-h3:text-base prose-h3:mt-3 prose-h3:mb-1.5 prose-h4:text-sm prose-h4:mt-3 prose-h4:mb-1 prose-p:my-2 prose-ul:my-2 prose-ul:pl-5 prose-li:my-0.5 prose-strong:text-gray-900 prose-blockquote:border-l-4 prose-blockquote:border-[#4285f4] prose-blockquote:bg-blue-50/40 prose-blockquote:py-1 prose-blockquote:px-3 prose-blockquote:my-3 prose-blockquote:rounded-r-lg prose-blockquote:text-gray-700">
          <Markdown>{result.content}</Markdown>
        </div>
      </div>

      {/* Footer controls */}
      <div className="flex items-center justify-between mt-3 text-xs text-gray-500 px-1">
        <span>Tư vấn được tối ưu hóa cho sinh viên theo từng chuyên ngành</span>
        <button
          id="btn-reset-ai-result"
          type="button"
          onClick={onClear}
          className="inline-flex items-center gap-1 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Thu gọn kết quả</span>
        </button>
      </div>
    </div>
  );
};
