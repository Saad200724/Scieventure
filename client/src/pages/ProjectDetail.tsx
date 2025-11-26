import { useState, useRef } from "react";
import { useRoute } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/providers/LanguageProvider";
import { Send, Users, MessageSquare, Star, Clock, MapPin, Share2 } from "lucide-react";

interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: Date;
  avatar: string;
}

interface Participant {
  id: string;
  name: string;
  role: string;
  avatar: string;
  joinedAt: Date;
}

export default function ProjectDetail() {
  const [, params] = useRoute("/projects/:id");
  const { t } = useLanguage();
  const [comments, setComments] = useState<Comment[]>([
    {
      id: "1",
      author: "Maliha Hasan",
      content: "Great project! I'm interested in contributing to this initiative.",
      timestamp: new Date(Date.now() - 3600000),
      avatar: "🧬",
    },
  ]);
  const [participants, setParticipants] = useState<Participant[]>([
    { id: "1", name: "Rahman Siddiqui", role: "Lead", avatar: "👨‍🔬", joinedAt: new Date(Date.now() - 86400000) },
    { id: "2", name: "Maliha Hasan", role: "Contributor", avatar: "👩‍🔬", joinedAt: new Date() },
  ]);
  const [commentInput, setCommentInput] = useState("");

  // Mock project data
  const project = {
    id: params?.id || "1",
    title: "Climate Monitoring Bangladesh",
    description: "Monitor temperature, rainfall, and air quality across Bangladesh regions to contribute to climate research.",
    subject: "Environmental Science",
    participationType: "Group",
    difficulty: 2,
    location: "All Bangladesh",
    endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    participants: 24,
    status: "Active",
    image: "☁️",
  };

  const addComment = () => {
    if (!commentInput.trim()) return;
    const newComment: Comment = {
      id: String(Date.now()),
      author: "Current User",
      content: commentInput,
      timestamp: new Date(),
      avatar: "👤",
    };
    setComments([...comments, newComment]);
    setCommentInput("");
  };

  const joinProject = () => {
    alert("You have joined the project!");
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="text-6xl">{project.image}</div>
            <div>
              <h1 className="text-4xl font-bold mb-2">{project.title}</h1>
              <div className="flex gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" /> {project.location}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" /> 
                  Ends {project.endDate.toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
          <Button className="bg-gradient-to-r from-blue-500 to-cyan-500" onClick={joinProject}>
            Join Project
          </Button>
        </div>

        <Card className="p-6 bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
          <p className="text-lg text-gray-700">{project.description}</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Comments Section */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <MessageSquare className="w-6 h-6" />
              Collaboration Discussion
            </h2>

            {/* Comment Input */}
            <div className="mb-6 pb-6 border-b">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white text-lg">
                  👤
                </div>
                <div className="flex-1">
                  <textarea
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    placeholder="Share your thoughts or updates about this project..."
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={3}
                  />
                  <div className="flex justify-end gap-2 mt-2">
                    <Button variant="outline">Cancel</Button>
                    <Button
                      onClick={addComment}
                      disabled={!commentInput.trim()}
                      className="bg-blue-500 hover:bg-blue-600"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Post Comment
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Comments List */}
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-lg flex-shrink-0">
                    {comment.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{comment.author}</span>
                      <span className="text-xs text-gray-500">
                        {comment.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-gray-700 mt-1">{comment.content}</p>
                    <div className="flex gap-4 mt-2 text-sm">
                      <button className="text-gray-500 hover:text-blue-500">👍 Like</button>
                      <button className="text-gray-500 hover:text-blue-500">💬 Reply</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Project Details */}
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4">Project Details</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Subject</p>
                <p className="font-semibold">{project.subject}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Type</p>
                <p className="font-semibold">{project.participationType}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Difficulty</p>
                <p className="font-semibold flex items-center gap-2">
                  {Array(project.difficulty).fill("⭐")}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                  {project.status}
                </span>
              </div>
            </div>
          </Card>

          {/* Participants */}
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Team Members ({participants.length})
            </h3>
            <div className="space-y-3">
              {participants.map((participant) => (
                <div key={participant.id} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-lg">
                    {participant.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{participant.name}</p>
                    <p className="text-xs text-gray-600">{participant.role}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              View All Members
            </Button>
          </Card>

          {/* Share */}
          <Card className="p-6">
            <Button variant="outline" className="w-full">
              <Share2 className="w-4 h-4 mr-2" />
              Share Project
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
