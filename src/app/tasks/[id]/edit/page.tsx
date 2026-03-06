import { Id } from "@/convex/_generated/dataModel";
import EditTaskComp from "@src/components/task/editTaskComp";

export default async function EditPage({
  params,
}: {
  params: { id: Id<"tasks"> };
}) {
  const { id } = await params;
  return <EditTaskComp taskId={id} />;
}
