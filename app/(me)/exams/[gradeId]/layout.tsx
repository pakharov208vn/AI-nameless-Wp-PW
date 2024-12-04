export async function generateMetadata({ params }: { params: { gradeId: string } }) {
  const { gradeId } = await params
  return {
    title: `Bài thi Khối ${gradeId}`,
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
