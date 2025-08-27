interface Task {
  id: number;
  title: string;
  completed: boolean;
}

let tasks: Task[] = [
  {
    id: 1,
    title: "Learn Next.js",
    completed: false,
  },
  {
    id: 2,
    title: "Build a project",
    completed: true,
  },
];

export async function GET() {
  return Response.json(tasks);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.title) {
      return Response.json({ error: "Title is required" }, { status: 400 });
    }

    const newTask: Task = {
      id: tasks.length + 1,
      title: body.title,
      completed: false,
    };
    tasks.push(newTask);
    return Response.json(newTask, { status: 201 });
  } catch (error) {
    throw new Error("Error in creating Task");
  }
}
