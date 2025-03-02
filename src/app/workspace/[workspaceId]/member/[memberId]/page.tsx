"use client"

import { UseCreateOrGetConversation } from "@/features/conversations/api/use-create-or-get-conversation";
import { UsememberId } from "@/hooks/use-member-id";
import { UseWorkspaceId } from "@/hooks/use-workspace-id"
import { Loader, TriangleAlert } from "lucide-react";
import { useEffect, useState } from "react";
import { Id } from "../../../../../../convex/_generated/dataModel";
import { toast } from "sonner";
import Conversation from "./conversation";


const MemberIdPage = () => {
  const workspaceId = UseWorkspaceId();
  const memberId = UsememberId();
  const [conversationId, setConversationId] = useState<Id<"conversations"> | null>(null)
  const { mutate, isPending } = UseCreateOrGetConversation();

  useEffect(() => {
    mutate({
      workspaceId,
      memberId
    }, {
      onSuccess(data) {
        setConversationId(data);
      },
      onError() {
        toast.error("Failed to create or get conversation");
      }
    });
  }, [mutate, workspaceId, memberId])


  if (isPending) {
    return (
      <div className="h-full flex justify-center items-center">
        <Loader className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!conversationId) {
    return (
      <div className="h-full flex flex-col gap-y-2 justify-center items-center">
        <TriangleAlert className="size-6 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Conversation not found</span>
      </div>
    );
  }

  return (
    <Conversation id={conversationId} />
  )
}

export default MemberIdPage