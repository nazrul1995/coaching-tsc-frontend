'use client';

import Image from "next/image";

type Props = {
  formData: any;
  setFormData: any;
  preview: string | null;
  setPreview: (val: string | null) => void;
};

const TeacherForm = ({ formData, setFormData, preview, setPreview }: Props) => {
  return (
    <div className="space-y-4">

      <input
        placeholder="Full Name"
        value={formData.name}
        onChange={(e) =>
          setFormData({ ...formData, name: e.target.value })
        }
        className="input"
      />

      <input value={formData.email} disabled className="input opacity-70" />

      <input
        placeholder="Phone Number"
        value={formData.phone}
        onChange={(e) =>
          setFormData({ ...formData, phone: e.target.value })
        }
        className="input"
      />

      <input
        placeholder="Subject"
        value={formData.subject}
        onChange={(e) =>
          setFormData({ ...formData, subject: e.target.value })
        }
        className="input"
      />

      <input
        placeholder="Experience (years)"
        value={formData.experience}
        onChange={(e) =>
          setFormData({ ...formData, experience: e.target.value })
        }
        className="input"
      />

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

export default TeacherForm;