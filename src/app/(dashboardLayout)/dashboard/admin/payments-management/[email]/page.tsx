import StudentPaymentHistory from "@/components/dashboard/common/StPaymentHistory";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function Page({ params }: Props) {
    const { id } = await params;
  console.log("Student ID:", id);
  return <StudentPaymentHistory studentId={id} />;
}
