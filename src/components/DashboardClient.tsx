"use client";

import { useState } from "react";
import { createProject, deleteProject, createTask, updateTaskStatus, deleteTask } from "@/app/actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { format, isPast } from "date-fns";
import { Trash2 } from "lucide-react";

type User = { id: string; name: string | null; email: string | null };
type Task = { id: string; title: string; description: string | null; status: string; dueDate: Date | null; assigneeId: string | null; projectId: string };
type Project = { id: string; name: string; description: string | null; ownerId: string; tasks: Task[] };

export default function DashboardClient({ projects, users, currentUser }: { projects: Project[], users: User[], currentUser: any }) {
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");

  const isAdmin = currentUser.role === "ADMIN";

  const allTasks = projects.flatMap(p => p.tasks);
  const overdueTasks = allTasks.filter(t => t.dueDate && isPast(new Date(t.dueDate)) && t.status !== "DONE");

  const handleCreateProject = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    await createProject({ name: formData.get("name") as string, description: formData.get("description") as string });
    setProjectDialogOpen(false);
  };

  const handleCreateTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const dueDateStr = formData.get("dueDate") as string;
    await createTask({
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      projectId: selectedProjectId,
      assigneeId: formData.get("assigneeId") as string || undefined,
      dueDate: dueDateStr ? new Date(dueDateStr) : undefined,
    });
    setTaskDialogOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allTasks.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{overdueTasks.length}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end gap-2">
        {isAdmin && (
          <Dialog open={projectDialogOpen} onOpenChange={setProjectDialogOpen}>
            <DialogTrigger render={<Button />}>Create Project</DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>New Project</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateProject} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Project Name</Label>
                  <Input id="name" name="name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" name="description" />
                </div>
                <Button type="submit">Create</Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Projects List */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Card key={project.id} className="flex flex-col">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{project.name}</CardTitle>
                  <CardDescription>{project.description}</CardDescription>
                </div>
                {isAdmin && (
                  <Button variant="ghost" size="icon" className="text-red-500 h-8 w-8" onClick={() => deleteProject(project.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold">Tasks</h4>
                  <Dialog open={taskDialogOpen && selectedProjectId === project.id} onOpenChange={(open) => {
                    setTaskDialogOpen(open);
                    if (open) setSelectedProjectId(project.id);
                  }}>
                    <DialogTrigger render={<Button variant="outline" size="sm" />}>Add Task</DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>New Task for {project.name}</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleCreateTask} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="title">Title</Label>
                          <Input id="title" name="title" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="description">Description</Label>
                          <Textarea id="description" name="description" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="assigneeId">Assignee</Label>
                          <Select name="assigneeId">
                            <SelectTrigger><SelectValue placeholder="Select user" /></SelectTrigger>
                            <SelectContent>
                              {users.map(u => (
                                <SelectItem key={u.id} value={u.id}>{u.name || u.email}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="dueDate">Due Date</Label>
                          <Input id="dueDate" name="dueDate" type="datetime-local" />
                        </div>
                        <Button type="submit">Create</Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
                
                {project.tasks.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No tasks yet.</p>
                ) : (
                  <div className="space-y-2">
                    {project.tasks.map(task => (
                      <div key={task.id} className="p-3 border rounded-md space-y-2 bg-card">
                        <div className="flex justify-between items-start">
                          <div className="font-medium text-sm">{task.title}</div>
                          {isAdmin && (
                            <Button variant="ghost" size="icon" className="h-6 w-6 text-red-500" onClick={() => deleteTask(task.id)}>
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                        {task.description && <p className="text-xs text-muted-foreground">{task.description}</p>}
                        <div className="flex items-center justify-between mt-2">
                          <Select
                            defaultValue={task.status}
                            onValueChange={(val) => { if (val) updateTaskStatus(task.id, val); }}
                          >
                            <SelectTrigger className="w-[120px] h-7 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="TODO">To Do</SelectItem>
                              <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                              <SelectItem value="DONE">Done</SelectItem>
                            </SelectContent>
                          </Select>
                          
                          {task.dueDate && (
                            <span className={`text-xs ${isPast(new Date(task.dueDate)) && task.status !== "DONE" ? "text-red-500 font-bold" : "text-muted-foreground"}`}>
                              {format(new Date(task.dueDate), "MMM d")}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
