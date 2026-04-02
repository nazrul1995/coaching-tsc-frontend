export const TeacherProfile = ({ data }: any) => {
  return (
    <div className="max-w-4xl mx-auto bg-white/5 p-8 rounded-3xl">
      <h2 className="text-2xl font-bold">{data.name}</h2>
      <p>{data.email}</p>

      <div className="mt-4">
        <p>Subject: Mathematics</p>
        <p>Experience: 5 years</p>
      </div>
    </div>
  );
};