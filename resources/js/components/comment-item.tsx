import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import React, { useState } from "react";
import { MessageCircle, Send, Reply } from "lucide-react";

export type CommentType = {
  id?: string;
  content: string;
  created_at?: string;
  user?: { name?: string };
  replies?: CommentType[];
  parent_comment_id?: string;
};

// Reply Form Component
interface ReplyFormProps {
  onSubmit: (content: string) => void;
  onCancel: () => void;
  placeholder?: string;
}

export function ReplyForm({ onSubmit, onCancel, placeholder = "Skriv dit svar..." }: ReplyFormProps) {
  const [content, setContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onSubmit(content.trim());
      setContent("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        className="min-h-[60px] resize-none border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-xs"
        autoFocus
      />
      <div className="flex gap-2 justify-end">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onCancel}
          className="px-3 h-7 text-xs"
        >
          Annuller
        </Button>
        <Button
          type="submit"
          size="sm"
          disabled={!content.trim()}
          className="px-3 h-7 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-xs"
        >
          <Send className="w-3 h-3 mr-1" />
          Send
        </Button>
      </div>
    </form>
  );
}

// Comment Item Component
interface CommentItemProps {
  comment: CommentType;
  depth?: number;
  onReply?: (parentCommentId: string, content: string) => void;
}

export function CommentItem({ comment, depth = 0, onReply }: CommentItemProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const maxDepth = 3; // Limit nesting depth

  const handleReply = (content: string) => {
    if (onReply && comment.id) {
      onReply(comment.id, content);
      setShowReplyForm(false);
    }
  };

  // Check parent_comment_id to determine if it's a reply
  const isReply = !!comment.parent_comment_id;

  return (
    <div className={`${isReply ? 'ml-8 pl-4 border-l-2 border-blue-200' : ''}`}>
      {/* Comment bubble */}
      <div className={`rounded-lg p-3 border ${
        isReply
          ? 'bg-blue-50 border-blue-200'
          : 'bg-white border-gray-200'
      }`}>
        {/* Comment header */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium ${
              isReply
                ? 'bg-blue-500'
                : 'bg-green-500'
            }`}>
              {comment.user?.name?.charAt(0)?.toUpperCase() || '?'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900">
                  {comment.user?.name || 'Ukendt bruger'}
                </span>
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
                  isReply 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-green-100 text-green-700'
                }`}>
                  {isReply ? 'Svar' : 'Original'}
                </span>
              </div>
              <span className="text-xs text-gray-500">
                {comment.created_at ? new Date(comment.created_at).toLocaleString('da-DK', {
                  hour: '2-digit',
                  minute: '2-digit',
                  day: 'numeric',
                  month: 'short'
                }) : ''}
              </span>
            </div>
          </div>
          {depth < maxDepth && onReply && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="text-gray-500 hover:text-gray-700 h-6 px-2 text-xs"
            >
              <Reply className="w-3 h-3 mr-1" />
              Svar
            </Button>
          )}
        </div>

        {/* Comment content */}
        <div className="text-xs text-gray-800 mb-2 leading-relaxed">
          {comment.content}
        </div>

        {/* Reply form */}
        {showReplyForm && (
          <div className="border-t pt-2 mt-2">
            <ReplyForm
              onSubmit={handleReply}
              onCancel={() => setShowReplyForm(false)}
            />
          </div>
        )}
      </div>

      {/* Nested replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-3 space-y-3">
          {comment.replies.map((reply, idx) => (
            <CommentItem
              key={reply.id || idx}
              comment={reply}
              depth={depth + 1}
              onReply={onReply}
            />
          ))}
        </div>
      )}
    </div>
  );
}