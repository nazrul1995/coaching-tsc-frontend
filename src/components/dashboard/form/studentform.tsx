'use client';

import Image from "next/image";

type Props = {
  formData: any;
  setFormData: any;
  preview: string | null;
  setPreview: (val: string | null) => void;
};

const StudentForm = ({ formData, setFormData, preview, setPreview }: Props) => {
  const isStudentClass = ["9", "10", "11", "12"].includes(formData.className);

  return (
    <div className="space-y-4">

      <input
        placeholder="Student Name"
        value={formData.name}
        onChange={(e) =>
          setFormData({ ...formData, name: e.target.value })
        }
        className="input"
      />

      <input value={formData.email} disabled className="input opacity-70" />

      <input
        placeholder="Guardian Phone"
        value={formData.phone}
        onChange={(e) =>
          setFormData({ ...formData, phone: e.target.value })
        }
        className="input"
      />

      <select
        value={formData.className}
        onChange={(e) =>
          setFormData({ ...formData, className: e.target.value })
        }
        className="input"
      >
        <option value="">Select Class</option>
        {[...Array(12)].map((_, i) => (
          <option key={i} value={String(i + 1)}>
            Class {i + 1}
          </option>
        ))}
      </select>

      {isStudentClass && (
        <input
          placeholder="Batch"
          value={formData.batch}
          onChange={(e) =>
            setFormData({ ...formData, batch: e.target.value })
          }
          className="input"
        />
      )}

      {/* Image Upload */}
      <div>
        <input
          type="file"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              setFormData({ ...formData, profilePic: file });
              setPreview(URL.createObjectURL(file));
            }
          }}
        />

        {preview && (
          <Image
            src={preview}
            alt="preview"
            width={100}
            height={100}
            className="mt-3 rounded-xl"
          />
        )}
      </div>
    </div>
  );
};

export default StudentForm;