import { Id } from "@/convex/_generated/dataModel";
import EditTaskComp from "@src/components/task/editTaskComp";

export default async function EditPage({
  params,
}: {
  params: { id: Id<"tasks"> };
}) {
  const { id } = await params;
  return (
    <div className="min-h-screen bg-[#d7baa5] px-4 py-8 md:px-8 lg:px-12">
      <EditTaskComp taskId={id} />
    </div>
  );
}
