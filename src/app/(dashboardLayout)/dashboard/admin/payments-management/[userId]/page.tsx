import StudentPaymentHistory from "@/components/dashboard/common/StPaymentHistory";

type Props = {
  params: Promise<{
    userId: string;
  }>;
};

export default async function Page({ params }: Props) {
  const { userId } = await params;
  console.log("Student User ID:", userId);
    return <StudentPaymentHistory studentId={userId} />;
}
