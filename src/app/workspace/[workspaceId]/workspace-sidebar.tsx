import useCurrentMember from "@/features/members/api/use-current-members";
import useGetWorkspace from "@/features/workspaces/api/use-get-workspace";
import { UseWorkspaceId } from "@/hooks/use-workspace-id";
import {
  AlertTriangle,
  HashIcon,
  Loader,
  MessageSquareText,
  SendHorizonal,
} from "lucide-react";
import WorkspaceHeader from "./workspace-header";
import SidebarItem from "./sidebar-item";
import useGetChannels from "@/features/channels/api/use-get-channels";
import WorkspaceSection from "./workspace-section";
import useGetMembers from "@/features/members/api/use-get-members";
import UserItem from "./user-item";
import useCreateChannelModal from "@/features/channels/store/use-create-channel-modal";
import { UsechannelId } from "@/hooks/use-channel-id";
import { UsememberId } from "@/hooks/use-member-id";

const WorkspaceSidebar = () => {
  const memberId = UsememberId()
  const workspaceId = UseWorkspaceId();
  const channelId = UsechannelId();
  const [_open, setOpen] = useCreateChannelModal();
  const { data: member, isLoading: memberLoading } = useCurrentMember({
    workspaceId,
  });
  const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({
    id: workspaceId,
  });

  const { data: channels } = useGetChannels({
    workspaceId,
  });

  const { data: members } = useGetMembers({
    workspaceId,
  });

  if (workspaceLoading || memberLoading) {
    return (
      <div className="flex flex-col bg-[#5E2C5F] items-center justify-center">
        <Loader className="size-5 animate-spin text-white" />
      </div>
    );
  }
  if (!workspace || !member) {
    return (
      <div className="flex gap-y-2 flex-col bg-[#5E2C5F] h-full items-center justify-center">
        <AlertTriangle className="size-5  text-white" />
        <p className="text-white text-sm">Workspace not found</p>
      </div>
    );
  }
  return (
    <div className="flex gap-y-2 flex-col bg-[#5E2C5F] h-full">
      <WorkspaceHeader
        workspace={workspace}
        isAdmin={member.role === "admin"}
      />
      <div className="flex flex-col px-2 mt-3">
        <SidebarItem label="Threads" icon={MessageSquareText} />
        <SidebarItem label="Drafts & Sent" icon={SendHorizonal} />
      </div>
      <WorkspaceSection
        label="Channels"
        hint="New channels"
        onNew={
          member.role === "admin"
            ? () => {
              setOpen(true);
            }
            : undefined
        }
      >
        {channels?.map((item) => {
          return (
            <SidebarItem
              key={item._id}
              label={item.name}
              icon={HashIcon}
              id={item._id}
              variant={channelId === item._id ? "active" : "default"}
            />
          );
        })}
      </WorkspaceSection>
      <WorkspaceSection
        label="Direct Messages"
        hint="New direct messages"
        onNew={() => { }}
      >
        {members?.map((item) => (
          <UserItem
            key={item._id}
            id={item._id}
            label={item.user.name}
            image={item.user.image}
            variant={item._id === memberId ? "active" : "default"}
          />
        ))}
      </WorkspaceSection>
    </div>
  );
};

export default WorkspaceSidebar;
