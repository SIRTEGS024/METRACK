"use client";

import useGetChannels from "@/features/channels/api/use-get-channels";
import useCreateChannelModal from "@/features/channels/store/use-create-channel-modal";
import useCurrentMember from "@/features/members/api/use-current-members";
import useGetWorkspace from "@/features/workspaces/api/use-get-workspace";
import { UseWorkspaceId } from "@/hooks/use-workspace-id";
import { Loader, TriangleAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";

const WorkspaceIdPage = () => {
  const router = useRouter();
  const workspaceId = UseWorkspaceId();
  const [open, setOpen] = useCreateChannelModal();
  const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({
    id: workspaceId,
  });
  const { data: channels, isLoading: channelsLoading } = useGetChannels({
    workspaceId,
  });
  const { data: member, isLoading: memberLoading } = useCurrentMember({
    workspaceId,
  });
  const channelId = useMemo(() => channels?.[0]?._id, [channels]);
  const isAdmin = useMemo(()=>member?.role === "admin", [member?.role]);

  useEffect(() => {
    if (workspaceLoading || channelsLoading ||!member || memberLoading || !workspace) return;
    if (channelId) {
      router.push(`/workspace/${workspaceId}/channel/${channelId}`);
    } else if (!open && isAdmin) {
      setOpen(true);
    }
  }, [
    memberLoading,
    member,
    isAdmin,
    workspace,
    channelId,
    workspaceLoading,
    channelsLoading,
    router,
    workspaceId,
    open,
    setOpen,
  ]);

  if (workspaceLoading || channelsLoading || memberLoading) {
    return (
      <div className="h-full flex flex-col flex-1 justify-center items-center gap-2">
        <Loader className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }
  if (!workspace || !member) {
    return (
      <div className="h-full flex flex-col flex-1 justify-center items-center gap-2">
        <TriangleAlert className="size-6  text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Workspace not found</span>
      </div>
     
    );
  }
  return (
    <div className="h-full flex flex-col flex-1 justify-center items-center gap-2">
      <TriangleAlert className="size-6  text-muted-foreground" />
      <span className="text-sm text-muted-foreground">No channel found</span>
    </div>
   
  );;
};

export default WorkspaceIdPage;
