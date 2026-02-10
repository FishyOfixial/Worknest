import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/client";

export default function TaskDetailPage() {
  const { taskId } = useParams();

  const [task, setTask] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    fetchTask();
    fetchComments();
  }, [taskId]);

  const fetchTask = async () => {
    const res = await api.get(`/tasks/${taskId}/`);
    setTask(res.data);
  };

  const fetchComments = async () => {
    const res = await api.get(`/tasks/${taskId}/comments/`);
    setComments(res.data);
  };

  const sendComment = async () => {
    if (!newComment.trim()) return;

    await api.post(`/tasks/${taskId}/comments/`, {
      content: newComment,
    });

    setNewComment("");
    fetchComments();
  };

  if (!task) return <div>Loading...</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">

      <h1 className="text-3xl font-bold mb-2">{task.title}</h1>
      <p className="text-gray-600 mb-6">{task.description}</p>

      {/* COMMENTS */}
      <div className="border rounded-xl p-4">

        <h2 className="text-xl font-semibold mb-4">Comments</h2>

        <div className="space-y-3 mb-4">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="bg-gray-100 p-3 rounded-lg"
            >
              <div className="text-sm text-gray-500">
                {comment.author_email}
              </div>
              <div>{comment.content}</div>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="border rounded-lg px-3 py-2 w-full"
            placeholder="Write a comment..."
          />

          <button
            onClick={sendComment}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Send
          </button>
        </div>

      </div>
    </div>
  );
}
