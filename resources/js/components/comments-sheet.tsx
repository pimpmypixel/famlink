import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import React, { Dispatch, SetStateAction } from "react";

export type CommentType = {
  id?: string;
  content: string;
  created_at?: string;
  user?: { name?: string };
};

export interface CommentsSheetProps {
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  comments: CommentType[];
}

export function CommentsSheet({ open, onOpenChange, comments }: CommentsSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="max-w-md w-full h-full flex flex-col">
        <SheetHeader>
          <SheetTitle>Kommentarer</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto p-4">
          {Array.isArray(comments) && comments.length > 0 ? (
            <ul className="space-y-4">
              {comments.map((comment, idx) => (
                <li key={comment.id || idx} className="border-b pb-2">
                  <div className="text-xs text-muted-foreground mb-1">
                    {comment.user?.name} <span className="ml-2 text-[10px]">{comment.created_at ? new Date(comment.created_at).toLocaleString() : ''}</span>
                  </div>
                  <div className="text-sm">{comment.content}</div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center text-muted-foreground">Ingen kommentarer endnu.</div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
