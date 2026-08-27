'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  UserPlus, 
  Filter, 
  GraduationCap, 
  CheckCircle2, 
  AlertCircle, 
  UploadCloud, 
  X, 
  Phone, 
  Trash2,
  Building2,
  Mail,
  Lock,
  RefreshCw
} from 'lucide-react';

// --- API RESPONSE DATA TYPES ---
export interface APIStudent {
  _id: string;
  name: string;
  email: string;
  guradianName: string; // Matches API payload field name
  phone: string;
  institution: string;
  className: string;
  batch?: string;
  group?: string;
  photo?: string;
  createdAt?: string;
  updatedAt?: string;
}

// --- DUMMY FALLBACK DATA (API Payload Format) ---
const INITIAL_STUDENTS: APIStudent[] = [
  {
    _id: "6a873cb1b1b59c631abefb3c",
    name: "Sumaiya Ahmed",
    email: "sumaiya@student.com",
    guradianName: "Karim Ahmed",
    phone: "017000023000",
    institution: "ABC School",
    className: "10",
    batch: "2026",
    group: "science",
    photo: "https://assets.globalpartnership.org/s3fs-public/styles/standard_blog_banner/public/bangladesh_2_with_credit.jpg",
    createdAt: "2026-08-20T17:43:13.478Z",
    updatedAt: "2026-08-20T17:43:13.478Z"
  },
  {
    _id: "6a873cb1b1b59c631abefb3d",
    name: "Tanvir Hossain",
    email: "tanvir@student.com",
    guradianName: "Rafiqul Islam",
    phone: "01711223344",
    institution: "Chittagong Collegiate School",
    className: "12",
    batch: "2026",
    group: "science",
    photo: "",
    createdAt: "2026-08-19T10:20:00.000Z",
  }
];

export default function StudentManagementPage() {
  // --- STATE MANAGEMENT ---
  const [students, setStudents] = useState<APIStudent[]>(INITIAL_STUDENTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('ALL');
  const [isLoading, setIsLoading] = useState(false);
  
  // Modal & Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    className: '10',
    batch: '2026',
    group: 'science',
    institution: '',
    guradianName: '',
    photo: '',
  });

  // --- FETCH DATA FROM API ---
  const fetchStudents = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/v1/students');
      const result = await res.json();
      if (result.success && Array.isArray(result.data)) {
        setStudents(result.data);
      }
    } catch (error) {
      console.warn('API Endpoint non-responsive. Falling back to local state:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // --- CLIENT FILTER & SEARCH COMPUTATION ---
  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchesSearch = 
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.phone.includes(searchTerm) ||
        student.institution.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesClass = selectedClass === 'ALL' || student.className === selectedClass;

      return matchesSearch && matchesClass;
    });
  }, [students, searchTerm, selectedClass]);

  // --- CALCULATED STATS ---
  const stats = useMemo(() => {
    const total = students.length;
    const scienceCount = students.filter(s => s.group?.toLowerCase() === 'science').length;
    const commerceCount = students.filter(s => s.group?.toLowerCase() === 'commerce').length;
    return { total, scienceCount, commerceCount };
  }, [students]);

  // --- HANDLERS ---
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setPhotoPreview(base64);
        setFormData((prev) => ({ ...prev, photo: base64 }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Attempting API Call to backend
      const response = await fetch('http://localhost:5000/api/v1/students/create-student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success && result.student) {
        setStudents([result.student, ...students]);
      } else {
        // Fallback Client Update
        const localCreatedStudent: APIStudent = {
          _id: Date.now().toString(),
          name: formData.name,
          email: formData.email,
          guradianName: formData.guradianName,
          phone: formData.phone,
          institution: formData.institution,
          className: formData.className,
          batch: formData.batch,
          group: formData.group,
          photo: photoPreview || formData.photo,
          createdAt: new Date().toISOString(),
        };
        setStudents([localCreatedStudent, ...students]);
      }
    } catch (err) {
      // Offline fallback
      const localCreatedStudent: APIStudent = {
        _id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        guradianName: formData.guradianName,
        phone: formData.phone,
        institution: formData.institution,
        className: formData.className,
        batch: formData.batch,
        group: formData.group,
        photo: photoPreview || formData.photo,
        createdAt: new Date().toISOString(),
      };
      setStudents([localCreatedStudent, ...students]);
    }

    // Reset Form
    setIsModalOpen(false);
    setFormData({
      name: '',
      email: '',
      password: '',
      phone: '',
      className: '10',
      batch: '2026',
      group: 'science',
      institution: '',
      guradianName: '',
      photo: '',
    });
    setPhotoPreview(null);
  };

  const handleDeleteStudent = (id: string) => {
    if (confirm('Are you sure you want to remove this student?')) {
      setStudents(students.filter((s) => s._id !== id));
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-white/60">Total Enrolled</span>
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-white mt-2">{stats.total}</h3>
          <p className="text-xs text-blue-300 mt-1">Active Database Total</p>
        </div>

        <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-white/60">Science Group</span>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-white mt-2">{stats.scienceCount}</h3>
          <p className="text-xs text-emerald-300 mt-1">Science Students</p>
        </div>

        <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-white/60">Commerce Group</span>
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-white mt-2">{stats.commerceCount}</h3>
          <p className="text-xs text-purple-300 mt-1">Commerce Students</p>
        </div>

        <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl flex flex-col justify-between">
          <span className="text-sm font-medium text-white/60">Management</span>
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full mt-2 py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 text-sm"
          >
            <UserPlus className="w-4 h-4" /> Add New Student
          </button>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            type="text"
            placeholder="Search name, email, phone, school..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/40 focus:outline-none focus:border-blue-500/50 transition-colors"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button 
            onClick={fetchStudents}
            className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white/70 hover:text-white transition-colors"
            title="Refetch API"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          <Filter className="w-4 h-4 text-white/50" />
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full sm:w-48 px-3 py-2 bg-[#0b1326] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500/50"
          >
            <option value="ALL">All Classes</option>
            <option value="6">Class 6</option>
            <option value="7">Class 7</option>
            <option value="8">Class 8</option>
            <option value="9">Class 9</option>
            <option value="10">Class 10</option>
            <option value="11">Class 11</option>
            <option value="12">Class 12</option>
          </select>
        </div>
      </div>

      {/* Student Data Table */}
      <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-white/80">
            <thead className="bg-white/5 border-b border-white/10 text-white/50 uppercase text-xs tracking-wider">
              <tr>
                <th className="px-6 py-4">Student Info</th>
                <th className="px-6 py-4">Class & Group</th>
                <th className="px-6 py-4">Institution</th>
                <th className="px-6 py-4">Guardian Details</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-white/40">
                    No matching student records found.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr key={student._id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-white overflow-hidden border border-white/20 shrink-0">
                        {student.photo ? (
                          <img src={student.photo} alt={student.name} className="w-full h-full object-cover" />
                        ) : (
                          student.name.charAt(0)
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-white">{student.name}</div>
                        <div className="text-xs text-white/50 flex items-center gap-1 mt-0.5">
                          <Mail className="w-3 h-3 text-blue-400" /> {student.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-lg text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                          Class {student.className}
                        </span>
                        {student.group && (
                          <span className="text-xs text-white/50 uppercase">{student.group}</span>
                        )}
                      </div>
                      <div className="text-xs text-white/30 mt-1">Batch: {student.batch || '2026'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-white/90 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-white/40 shrink-0" />
                        <span className="truncate max-w-[200px]">{student.institution}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-white/90">{student.guradianName}</div>
                      <div className="text-xs text-white/50 flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3" /> {student.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleDeleteStudent(student._id)}
                        className="p-2 hover:bg-rose-500/20 rounded-lg text-white/50 hover:text-rose-400 transition-colors"
                        title="Delete Student"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 overflow-y-auto">
          <div className="w-full max-w-2xl rounded-2xl bg-[#0b1326] border border-white/15 p-6 shadow-2xl space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-blue-400" /> Create Student Account
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1 hover:bg-white/10 rounded-lg text-white/50 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateStudent} className="space-y-4">
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
                  <p className="text-[11px] text-white/40 mt-1">Image URL or direct upload supported</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-white/60 mb-1 block">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
                    placeholder="e.g. Sumaiya Ahmed"
                  />
                </div>

                <div>
                  <label className="text-xs text-white/60 mb-1 block">Email Address *</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
                      placeholder="student@gmail.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-white/60 mb-1 block">Password *</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                    <input
                      type="password"
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-white/60 mb-1 block">Phone Number *</label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
                    placeholder="01700000000"
                  />
                </div>

                <div>
                  <label className="text-xs text-white/60 mb-1 block">Class Name *</label>
                  <select
                    value={formData.className}
                    onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0b1326] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="6">Class 6</option>
                    <option value="7">Class 7</option>
                    <option value="8">Class 8</option>
                    <option value="9">Class 9</option>
                    <option value="10">Class 10</option>
                    <option value="11">Class 11</option>
                    <option value="12">Class 12</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-white/60 mb-1 block">Batch</label>
                  <input
                    type="text"
                    value={formData.batch}
                    onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
                    placeholder="2026"
                  />
                </div>

                <div>
                  <label className="text-xs text-white/60 mb-1 block">Group</label>
                  <select
                    value={formData.group}
                    onChange={(e) => setFormData({ ...formData, group: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0b1326] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="science">Science</option>
                    <option value="commerce">Commerce</option>
                    <option value="humanities">Humanities</option>
                    <option value="general">General</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-white/60 mb-1 block">Institution *</label>
                  <input
                    type="text"
                    required
                    value={formData.institution}
                    onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
                    placeholder="e.g. ABC School"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs text-white/60 mb-1 block">Guardian Name (guradianName) *</label>
                  <input
                    type="text"
                    required
                    value={formData.guradianName}
                    onChange={(e) => setFormData({ ...formData, guradianName: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
                    placeholder="e.g. Karim Ahmed"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm text-white/70 hover:text-white rounded-xl hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm rounded-xl transition-colors shadow-lg shadow-blue-600/30"
                >
                  Submit & Create Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}