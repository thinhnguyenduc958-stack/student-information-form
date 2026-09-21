import React from 'react';
import { StudentRecord } from '../types.ts';
import { CheckCircle2, User, Calendar, GraduationCap, ArrowLeft, Edit2, Clock, Hash } from 'lucide-react';

interface StudentCardProps {
  student: StudentRecord;
  onReset: () => void;
  onEdit: () => void;
  onViewList?: () => void;
  totalSavedCount?: number;
}

export const StudentCard: React.FC<StudentCardProps> = ({
  student,
  onReset,
  onEdit,
  onViewList,
  totalSavedCount = 0,
}) => {
  return (
    <div id="student-success-view" className="space-y-5 animate-in fade-in zoom-in-95 duration-200">
      <div className="text-center pb-2 border-b border-gray-100">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mb-2">
          <CheckCircle2 className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold text-gray-800">Đăng ký thành công!</h3>
        <p className="text-xs text-gray-500 mt-0.5">Thông tin sinh viên đã được ghi nhận</p>
      </div>

      {/* Student Badge Card */}
      <div
        id={`student-badge-${student.id}`}
        className="bg-gradient-to-br from-blue-50/70 via-white to-indigo-50/50 border border-blue-100 rounded-xl p-4 shadow-sm space-y-3"
      >
        <div className="flex items-center justify-between border-b border-blue-100/80 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#4285f4] text-white flex items-center justify-center font-bold text-sm shadow-xs">
              SV
            </div>
            <div>
              <span className="text-[11px] font-semibold tracking-wider text-blue-600 uppercase block">
                Thẻ sinh viên
              </span>
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <Hash className="w-3 h-3 text-gray-400" />
                {student.id}
              </span>
            </div>
          </div>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
            {student.major.toUpperCase()}
          </span>
        </div>

        <div className="space-y-2.5 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-500 flex items-center gap-1.5 text-xs">
              <User className="w-3.5 h-3.5 text-gray-400" />
              Họ và tên
            </span>
            <span className="font-bold text-gray-800 text-right">{student.fullName}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-500 flex items-center gap-1.5 text-xs">
              <Calendar className="w-3.5 h-3.5 text-gray-400" />
              Năm sinh (Tuổi)
            </span>
            <span className="font-medium text-gray-700">
              {student.birthYear} ({student.age} tuổi)
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-500 flex items-center gap-1.5 text-xs">
              <GraduationCap className="w-3.5 h-3.5 text-gray-400" />
              Ngành học
            </span>
            <span className="font-semibold text-[#4285f4] text-right">{student.majorName}</span>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-dashed border-gray-200 text-[11px] text-gray-400">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Thời gian
            </span>
            <span>{student.createdAt}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2 pt-1">
        <button
          id="btn-register-new"
          type="button"
          onClick={onReset}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#4285f4] hover:bg-[#3367d6] text-white font-bold rounded-lg text-[15px] cursor-pointer transition-colors shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Nhập hồ sơ mới</span>
        </button>

        <div className="flex gap-2">
          <button
            id="btn-edit-student"
            type="button"
            onClick={onEdit}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold rounded-lg text-sm cursor-pointer transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5 text-gray-500" />
            <span>Sửa thông tin</span>
          </button>

          {onViewList && totalSavedCount > 1 && (
            <button
              id="btn-view-all-students"
              type="button"
              onClick={onViewList}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 border border-blue-200 bg-blue-50/50 hover:bg-blue-100/50 text-[#4285f4] font-semibold rounded-lg text-sm cursor-pointer transition-colors"
            >
              <span>Xem tất cả ({totalSavedCount})</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
