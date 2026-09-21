import React, { useState } from 'react';
import { MAJORS, AIStudentRequest, AIAdvisoryResult, StudentRecord } from '../types.ts';
import {
  Sparkles,
  User,
  Calendar,
  GraduationCap,
  Target,
  Code2,
  HelpCircle,
  Loader2,
  AlertCircle,
  Wand2,
} from 'lucide-react';

interface AIStudentFormProps {
  onSuccess: (result: AIAdvisoryResult) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  existingStudents?: StudentRecord[];
}

export const AIStudentForm: React.FC<AIStudentFormProps> = ({
  onSuccess,
  isLoading,
  setIsLoading,
  existingStudents = [],
}) => {
  const [formData, setFormData] = useState<AIStudentRequest>({
    fullName: '',
    birthYear: '',
    major: '',
    studyGoal: '',
    currentSkills: '',
    aiRequest: '',
  });

  const [validationError, setValidationError] = useState<string | null>(null);

  const handleInputChange = (
    field: keyof AIStudentRequest,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (validationError) setValidationError(null);
  };

  // Quick fill sample data to easily test
  const handleFillSample = () => {
    setFormData({
      fullName: 'Nguyễn Minh Quân',
      birthYear: 2006,
      major: 'ai',
      studyGoal: 'Trở thành Kỹ sư Trí tuệ nhân tạo (AI/ML Engineer) và tham gia nghiên cứu mô hình ngôn ngữ lớn.',
      currentSkills: 'Lập trình Python cơ bản, toán cao cấp, đã tìm hiểu qua thư viện NumPy, Pandas và tiếng Anh IELTS 6.5.',
      aiRequest: 'Tư vấn lộ trình học tập chuyên sâu trong 2 năm tới, các môn học trọng tâm và 3 dự án thực tế nên làm để bổ sung vào CV.',
    });
    setValidationError(null);
  };

  // Quick sync from the latest registered student
  const handleSyncFromRegistered = () => {
    if (existingStudents.length > 0) {
      const latest = existingStudents[0];
      setFormData((prev) => ({
        ...prev,
        fullName: latest.fullName,
        birthYear: latest.birthYear,
        major: latest.major,
      }));
      setValidationError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Validate 6 mandatory fields
    if (!formData.fullName.trim()) {
      setValidationError('Vui lòng nhập Họ và tên.');
      return;
    }

    const yearNum = Number(formData.birthYear);
    if (!formData.birthYear || isNaN(yearNum) || yearNum < 1900 || yearNum > 2026) {
      setValidationError('Vui lòng nhập Năm sinh hợp lệ (từ 1900 đến 2026).');
      return;
    }

    if (!formData.major) {
      setValidationError('Vui lòng chọn Ngành đăng ký.');
      return;
    }

    if (!formData.studyGoal.trim()) {
      setValidationError('Vui lòng nhập Mục tiêu học tập.');
      return;
    }

    if (!formData.currentSkills.trim()) {
      setValidationError('Vui lòng nhập Kỹ năng hiện tại.');
      return;
    }

    if (!formData.aiRequest.trim()) {
      setValidationError('Vui lòng nhập Câu hỏi hoặc yêu cầu muốn AI hỗ trợ.');
      return;
    }

    setIsLoading(true);

    try {
      const selectedMajor = MAJORS.find((m) => m.value === formData.major);
      const majorLabel = selectedMajor ? selectedMajor.label : formData.major;

      const response = await fetch('/api/ai/student-advisory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.fullName.trim(),
          birthYear: yearNum,
          major: majorLabel,
          studyGoal: formData.studyGoal.trim(),
          currentSkills: formData.currentSkills.trim(),
          aiRequest: formData.aiRequest.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Có lỗi xảy ra khi liên lạc với AI.');
      }

      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now
        .getMinutes()
        .toString()
        .padStart(2, '0')} - ${now.getDate().toString().padStart(2, '0')}/${(
        now.getMonth() + 1
      )
        .toString()
        .padStart(2, '0')}/${now.getFullYear()}`;

      onSuccess({
        content: data.content,
        modelUsed: data.modelUsed || 'gemini-3.8-flash',
        isMockFallback: data.isMockFallback,
        timestamp: timeStr,
        studentName: formData.fullName.trim(),
        majorName: majorLabel,
      });
    } catch (err: any) {
      setValidationError(err?.message || 'Không thể kết nối với dịch vụ AI. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="ai-student-form-section" className="space-y-4">
      {/* Quick helper shortcuts */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-1 border-b border-gray-100 text-xs">
        <span className="text-gray-500 font-medium flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-[#4285f4]" />
          Tư vấn cá nhân hóa cùng Gemini
        </span>
        <div className="flex items-center gap-2">
          {existingStudents.length > 0 && (
            <button
              type="button"
              onClick={handleSyncFromRegistered}
              className="text-[#4285f4] hover:underline cursor-pointer font-medium"
            >
              Lấy từ hồ sơ trước
            </button>
          )}
          <button
            type="button"
            onClick={handleFillSample}
            className="inline-flex items-center gap-1 text-gray-500 hover:text-[#4285f4] hover:underline cursor-pointer"
          >
            <Wand2 className="w-3 h-3" />
            <span>Mẫu ví dụ</span>
          </button>
        </div>
      </div>

      {validationError && (
        <div
          id="ai-form-error-alert"
          className="flex items-start gap-2 p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg"
        >
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      <form id="ai-information-form" onSubmit={handleSubmit} className="space-y-4">
        {/* 1. Họ và tên */}
        <div className="form-group">
          <label
            htmlFor="ai-fullname"
            className="flex items-center gap-1.5 text-sm font-bold text-[#444] mb-2"
          >
            <User className="w-4 h-4 text-[#4285f4]" />
            <span>1. Họ và tên <span className="text-red-500 font-normal">*</span></span>
          </label>
          <input
            type="text"
            id="ai-fullname"
            value={formData.fullName}
            onChange={(e) => handleInputChange('fullName', e.target.value)}
            placeholder="Nhập họ và tên đầy đủ"
            disabled={isLoading}
            required
            className="w-full px-3.5 py-3 border border-[#ccc] rounded-lg text-[15px] outline-none transition-colors focus:border-[#4285f4] focus:ring-2 focus:ring-[#4285f4]/15 bg-white text-gray-800 placeholder:text-gray-400 disabled:bg-gray-50"
          />
        </div>

        {/* Grid for Năm sinh & Ngành đăng ký on desktop / tablets */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* 2. Năm sinh */}
          <div className="form-group">
            <label
              htmlFor="ai-birthyear"
              className="flex items-center gap-1.5 text-sm font-bold text-[#444] mb-2"
            >
              <Calendar className="w-4 h-4 text-[#4285f4]" />
              <span>2. Năm sinh <span className="text-red-500 font-normal">*</span></span>
            </label>
            <input
              type="number"
              id="ai-birthyear"
              value={formData.birthYear}
              onChange={(e) =>
                handleInputChange(
                  'birthYear',
                  e.target.value === '' ? '' : Number(e.target.value)
                )
              }
              placeholder="Ví dụ: 2007"
              min="1900"
              max="2026"
              disabled={isLoading}
              required
              className="w-full px-3.5 py-3 border border-[#ccc] rounded-lg text-[15px] outline-none transition-colors focus:border-[#4285f4] focus:ring-2 focus:ring-[#4285f4]/15 bg-white text-gray-800 placeholder:text-gray-400 disabled:bg-gray-50"
            />
          </div>

          {/* 3. Ngành đăng ký */}
          <div className="form-group">
            <label
              htmlFor="ai-major"
              className="flex items-center gap-1.5 text-sm font-bold text-[#444] mb-2"
            >
              <GraduationCap className="w-4 h-4 text-[#4285f4]" />
              <span>3. Ngành đăng ký <span className="text-red-500 font-normal">*</span></span>
            </label>
            <div className="relative">
              <select
                id="ai-major"
                value={formData.major}
                onChange={(e) => handleInputChange('major', e.target.value)}
                disabled={isLoading}
                required
                className="w-full px-3.5 py-3 border border-[#ccc] rounded-lg text-[15px] outline-none transition-colors focus:border-[#4285f4] focus:ring-2 focus:ring-[#4285f4]/15 bg-white text-gray-800 cursor-pointer appearance-none pr-10 disabled:bg-gray-50"
              >
                <option value="">-- Chọn ngành --</option>
                {MAJORS.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label} ({m.code})
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-gray-500">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Mục tiêu học tập */}
        <div className="form-group">
          <label
            htmlFor="ai-studygoal"
            className="flex items-center gap-1.5 text-sm font-bold text-[#444] mb-2"
          >
            <Target className="w-4 h-4 text-[#4285f4]" />
            <span>4. Mục tiêu học tập <span className="text-red-500 font-normal">*</span></span>
          </label>
          <textarea
            id="ai-studygoal"
            rows={2}
            value={formData.studyGoal}
            onChange={(e) => handleInputChange('studyGoal', e.target.value)}
            placeholder="Ví dụ: Đạt GPA giỏi, du học thạc sĩ, hoặc trở thành Software Engineer tại công ty quốc tế..."
            disabled={isLoading}
            required
            className="w-full px-3.5 py-2.5 border border-[#ccc] rounded-lg text-[15px] outline-none transition-colors focus:border-[#4285f4] focus:ring-2 focus:ring-[#4285f4]/15 bg-white text-gray-800 placeholder:text-gray-400 disabled:bg-gray-50 resize-y"
          />
        </div>

        {/* 5. Kỹ năng hiện tại */}
        <div className="form-group">
          <label
            htmlFor="ai-currentskills"
            className="flex items-center gap-1.5 text-sm font-bold text-[#444] mb-2"
          >
            <Code2 className="w-4 h-4 text-[#4285f4]" />
            <span>5. Kỹ năng hiện tại <span className="text-red-500 font-normal">*</span></span>
          </label>
          <textarea
            id="ai-currentskills"
            rows={2}
            value={formData.currentSkills}
            onChange={(e) => handleInputChange('currentSkills', e.target.value)}
            placeholder="Ví dụ: C/C++, Python cơ bản, toán logic, kỹ năng tin học văn phòng, tiếng Anh cơ bản..."
            disabled={isLoading}
            required
            className="w-full px-3.5 py-2.5 border border-[#ccc] rounded-lg text-[15px] outline-none transition-colors focus:border-[#4285f4] focus:ring-2 focus:ring-[#4285f4]/15 bg-white text-gray-800 placeholder:text-gray-400 disabled:bg-gray-50 resize-y"
          />
        </div>

        {/* 6. Câu hỏi hoặc yêu cầu muốn AI hỗ trợ */}
        <div className="form-group">
          <label
            htmlFor="ai-request"
            className="flex items-center gap-1.5 text-sm font-bold text-[#444] mb-2"
          >
            <HelpCircle className="w-4 h-4 text-[#4285f4]" />
            <span>6. Câu hỏi hoặc yêu cầu muốn AI hỗ trợ <span className="text-red-500 font-normal">*</span></span>
          </label>
          <textarea
            id="ai-request"
            rows={3}
            value={formData.aiRequest}
            onChange={(e) => handleInputChange('aiRequest', e.target.value)}
            placeholder="Ví dụ: Cần học thêm ngôn ngữ gì trước khi vào năm 2? Có nên học thêm chứng chỉ AWS không? Lộ trình thực tập ra sao?..."
            disabled={isLoading}
            required
            className="w-full px-3.5 py-2.5 border border-[#ccc] rounded-lg text-[15px] outline-none transition-colors focus:border-[#4285f4] focus:ring-2 focus:ring-[#4285f4]/15 bg-white text-gray-800 placeholder:text-gray-400 disabled:bg-gray-50 resize-y"
          />
        </div>

        {/* Submit button with loading state */}
        <button
          id="btn-ai-submit"
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-[#4285f4] hover:bg-[#3367d6] disabled:bg-[#4285f4]/70 text-white font-bold rounded-lg text-base cursor-pointer disabled:cursor-not-allowed transition-all shadow-sm hover:shadow active:scale-[0.99] mt-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Đang xử lý...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Gửi thông tin cho AI</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
