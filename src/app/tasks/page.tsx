import TaskList from "@src/components/task/listTasks";

export default function RootTask() {
  return (
    <div className="min-h-screen bg-[#d7baa5] px-4 py-8 md:px-8 lg:px-12">
      <TaskList />
    </div>
  );
}
