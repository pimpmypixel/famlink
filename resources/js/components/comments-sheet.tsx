import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { TimelineItem } from "@/lib/types";
import React, { Dispatch, SetStateAction, useState } from "react";
import { MessageCircle } from "lucide-react";
import { CommentItem, CommentType, ReplyForm } from "./comment-item";

export interface CommentsSheetProps {
  item: TimelineItem;
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  comments: CommentType[];
  onAddComment?: (content: string, parentCommentId?: string) => void;
}

export function CommentsSheet({ item, open, onOpenChange, comments, onAddComment }: CommentsSheetProps) {
  const [showNewCommentForm, setShowNewCommentForm] = useState(false);

  const handleNewComment = (content: string) => {
    if (onAddComment) {
      onAddComment(content);
      setShowNewCommentForm(false);
    }
  };

  const handleReply = (parentCommentId: string, content: string) => {
    if (onAddComment) {
      onAddComment(content, parentCommentId);
    }
  };

  // Group comments by parent (top-level comments vs replies)
  const topLevelComments = comments.filter(comment => !comment.parent_comment_id);

  // Add replies to their parent comments
  const commentsWithReplies = topLevelComments.map(comment => ({
    ...comment,
    replies: comments.filter(reply => reply.parent_comment_id === comment.id)
  }));

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="max-w-4xl w-full h-full flex flex-col bg-white">
        {/* Header with scaled down elements */}
        <div className="border-b bg-white p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Kommentarer
                </h2>
                <p className="text-xs text-gray-600 truncate max-w-md">
                  {item.title}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowNewCommentForm(!showNewCommentForm)}
              className="px-3 py-1 text-sm"
            >
              <MessageCircle className="w-3 h-3 mr-1" />
              Ny kommentar
            </Button>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-600">
            <span>
              {commentsWithReplies.length} kommentarer
            </span>
            <span>
              {comments.filter(c => c.parent_comment_id).length} svar
            </span>
          </div>
        </div>

        {/* Comments list with scaled down spacing */}
        <div className="flex-1 overflow-y-auto p-4">
          {commentsWithReplies.length > 0 ? (
            <div className="space-y-4">
              {commentsWithReplies.map((comment, idx) => (
                <CommentItem
                  key={comment.id || idx}
                  comment={comment}
                  onReply={handleReply}
                />
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <h3 className="text-base font-medium mb-2">Ingen kommentarer endnu</h3>
              <p className="text-xs">Vær den første til at kommentere på denne hændelse!</p>
            </div>
          )}
        </div>

        {/* New comment form at bottom - scaled down */}
        {showNewCommentForm && (
          <div className="border-t border-gray-200 bg-white p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <MessageCircle className="w-3 h-3 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-700">Ny kommentar</span>
            </div>
            <ReplyForm
              onSubmit={handleNewComment}
              onCancel={() => setShowNewCommentForm(false)}
              placeholder="Skriv din kommentar..."
            />
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
