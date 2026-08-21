'use client';

import React, { useState, useEffect } from 'react';
import { UserPlus, X, UploadCloud, Mail, Lock, Loader2, Edit3, DollarSign, Calendar } from 'lucide-react';
import Swal from 'sweetalert2';
import { APIStudent } from './student-management/StudentTable';
import { uploadImageToImgBB } from '@/lib/imgUpload';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: any) => Promise<void>;
  editStudent: APIStudent | null;
}

export default function StudentFormModal({ isOpen, onClose, onSubmit, editStudent }: ModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    className: '10',
    batchYear: '2028',
    group: 'science',
    institution: '',
    guradianName: '',
    monthlyFee: '2000',
    admissionDate: new Date().toISOString().split('T')[0], // YYYY-MM-DD
    photo: '',
  });

  const showGroupAndBatch = ['9', '10', '11', '12'].includes(formData.className);

  useEffect(() => {
    if (editStudent) {
      const isAdvancedClass = ['9', '10', '11', '12'].includes(editStudent.className);
      let extractedYear = '2028';

      if (editStudent.batch) {
        const parts = editStudent.batch.split('-');
        extractedYear = parts[1] || parts[0] || '2028';
      }

      setFormData({
        name: editStudent.name || '',
        email: editStudent.email || '',
        password: '',
        phone: editStudent.phone || '',
        className: editStudent.className || '10',
        batchYear: extractedYear,
        group: isAdvancedClass ? editStudent.group || 'science' : 'science',
        institution: editStudent.institution || '',
        guradianName: editStudent.guradianName || '',
        monthlyFee: String(editStudent.monthlyFee || '2000'),
        admissionDate: editStudent.admissionDate
          ? new Date(editStudent.admissionDate).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
        photo: editStudent.photo || '',
      });
      setPhotoPreview(editStudent.photo || null);
    } else {
      setFormData({
        name: '',
        email: '',
        password: '',
        phone: '',
        className: '10',
        batchYear: '2028',
        group: 'science',
        institution: '',
        guradianName: '',
        monthlyFee: '2000',
        admissionDate: new Date().toISOString().split('T')[0],
        photo: '',
      });
      setPhotoPreview(null);
    }
  }, [editStudent, isOpen]);

  if (!isOpen) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let imageUrl = formData.photo;

      // 1. Upload Photo if selected
      if (selectedFile) {
        imageUrl = await uploadImageToImgBB(selectedFile);
      }

      // 2. Class, Batch, and Group formatting logic
      const cls = Number(formData.className);
      let formattedBatch: string | undefined = undefined;
      let finalGroup: string | undefined = undefined;

      if (cls >= 9 && cls <= 12) {
        const prefix = cls === 9 || cls === 10 ? 'SSC' : 'HSC';
        formattedBatch = `${prefix}-${formData.batchYear}`;
        finalGroup = formData.group;
      }

      // 3. Construct Payload
      const payload: any = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        className: formData.className,
        institution: formData.institution,
        guradianName: formData.guradianName,
        monthlyFee: Number(formData.monthlyFee),
        admissionDate: formData.admissionDate ? new Date(formData.admissionDate).toISOString() : new Date().toISOString(),
      };

      if (formattedBatch) payload.batch = formattedBatch;
      if (finalGroup) payload.group = finalGroup;

      if (editStudent) {
        payload.photoUrl = imageUrl;
      } else {
        payload.photo = imageUrl;
        payload.password = formData.password;
      }

      await onSubmit(payload);

      // SweetAlert2 Success Notification
      Swal.fire({
        icon: 'success',
        title: editStudent ? 'Student Updated!' : 'Student Created!',
        text: editStudent
          ? 'Student details have been updated successfully.'
          : 'New student account has been created successfully.',
        background: '#0b1326',
        color: '#fff',
        confirmButtonColor: '#2563eb',
        customClass: {
          popup: 'border border-white/10 rounded-2xl shadow-2xl',
        },
      });

      onClose();
    } catch (error: any) {
      console.error('Submission failed:', error);

      // SweetAlert2 Error Notification
      Swal.fire({
        icon: 'error',
        title: 'Operation Failed',
        text: error?.response?.data?.message || error?.message || 'Something went wrong. Please try again.',
        background: '#0b1326',
        color: '#fff',
        confirmButtonColor: '#ef4444',
        customClass: {
          popup: 'border border-white/10 rounded-2xl shadow-2xl',
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-[#0b1326] border border-white/15 p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            {editStudent ? <Edit3 className="w-5 h-5 text-blue-400" /> : <UserPlus className="w-5 h-5 text-blue-400" />}
            {editStudent ? 'Update Student Details' : 'Create Student Account'}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg text-white/50 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl border border-dashed border-white/20 flex items-center justify-center bg-white/5 overflow-hidden shrink-0">
              {photoPreview ? (
                <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <UploadCloud className="w-5 h-5 text-white/30" />
              )}
            </div>
            <div>
              <label className="px-3 py-1.5 bg-white/10 hover:bg-white/15 text-xs text-white rounded-xl cursor-pointer transition-colors border border-white/10 inline-block">
                Upload Photo
                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </label>
              <p className="text-[11px] text-white/40 mt-1">Image hosted via CDN/ImgBB</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-white/60 mb-1 block">Full Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-xs text-white/60 mb-1 block">Email Address *</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type="email"
                  required
                  disabled={!!editStudent}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500 disabled:opacity-50"
                />
              </div>
            </div>

            {!editStudent && (
              <div>
                <label className="text-xs text-white/60 mb-1 block">Password *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                  <input
                    type="password"
                    required={!editStudent}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs text-white/60 mb-1 block">Phone Number *</label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-xs text-white/60 mb-1 block">Class Name *</label>
              <select
                value={formData.className}
                onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                className="w-full px-3 py-2 bg-[#0b1326] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                {['6', '7', '8', '9', '10', '11', '12'].map((cls) => (
                  <option key={cls} value={cls}>Class {cls}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-white/60 mb-1 block">Monthly Fee (BDT) *</label>
              <div className="relative">
                <DollarSign className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.monthlyFee}
                  onChange={(e) => setFormData({ ...formData, monthlyFee: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-white/60 mb-1 block">Admission Date *</label>
              <div className="relative">
                <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type="date"
                  required
                  value={formData.admissionDate}
                  onChange={(e) => setFormData({ ...formData, admissionDate: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500 [color-scheme:dark]"
                />
              </div>
            </div>

            {showGroupAndBatch && (
              <>
                <div>
                  <label className="text-xs text-white/60 mb-1 block">Group</label>
                  <select
                    value={formData.group}
                    onChange={(e) => setFormData({ ...formData, group: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0b1326] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value="science">Science</option>
                    <option value="commerce">Commerce</option>
                    <option value="humanities">Humanities</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-white/60 mb-1 block">
                    Batch Year ({['9', '10'].includes(formData.className) ? 'SSC' : 'HSC'})
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.batchYear}
                    onChange={(e) => setFormData({ ...formData, batchYear: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
                    placeholder="e.g. 2028"
                  />
                </div>
              </>
            )}

            <div>
              <label className="text-xs text-white/60 mb-1 block">Institution *</label>
              <input
                type="text"
                required
                value={formData.institution}
                onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-xs text-white/60 mb-1 block">Guardian Name *</label>
              <input
                type="text"
                required
                value={formData.guradianName}
                onChange={(e) => setFormData({ ...formData, guradianName: e.target.value })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-white/70 hover:text-white rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm rounded-xl transition-colors shadow-lg shadow-blue-600/30 cursor-pointer disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {editStudent ? 'Update Student' : 'Create Student'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}