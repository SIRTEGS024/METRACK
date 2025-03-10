import { Button } from "@/components/ui/button";
import { Id } from "../../../../convex/_generated/dataModel"
import useGetMember from "../api/use-get-member";
import { AlertTriangle, ChevronDownIcon, Loader, MailIcon, XIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@radix-ui/react-dropdown-menu";
import Link from "next/link";
import { UseUpdateMember } from "../api/use-update-member";
import { UseWorkspaceId } from "@/hooks/use-workspace-id";
import useCurrentMember from "../api/use-current-members";
import { toast } from "sonner";
import { UseRemoveMember } from "../api/use-remove-member";
import useConfirm from "@/hooks/use-confirm";
import { useRouter } from "next/navigation";
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";


interface ProfileProps {
  memberId: Id<"members">;
  onClose: () => void
}

const Profile = ({ memberId, onClose }: ProfileProps) => {
  const router = useRouter();
  const workspaceId = UseWorkspaceId();
  const { data: currentMember, isLoading: isLoadingCurrentMember } = useCurrentMember({ workspaceId });
  const { data: member, isLoading: isLoadingMember } = useGetMember({ id: memberId });
  const { mutate: updateMember, isPending: isUpdatingMember } = UseUpdateMember();
  const { mutate: removeMember, isPending: isRemovingMember } = UseRemoveMember();
  
  const pending = isUpdatingMember || isRemovingMember;
  const [LeaveDialog, confirmLeave] = useConfirm("Leave workspace", "Are you sure you want to leave this workspace?");

  const [RemoveDialog, confirmRemove] = useConfirm("Remove member", "Are you sure you want to remove this member?");

  const [UpdateDialog, confirmUpdate] = useConfirm("Change role", "Are you sure you want to change this member's role?");

  const onRemove = async () => {
    const ok = await confirmRemove();
    if (!ok) return;
    removeMember({ id: memberId }, {
      onSuccess: () => {
        router.replace("/");
        toast.success("Member removed");
      },
      onError: () => {
        toast.success("Failed to remove member");
      }
    })
  }

  const onLeave = async () => {
    const ok = await confirmLeave();
    if (!ok) return;
    removeMember({ id: memberId }, {
      onSuccess: () => {
        router.replace("/");
        toast.success("You left the workspace");
      },
      onError: () => {
        toast.success("Failed to leave the workspace");
      }
    })
  }

  const onUpdate = async (role: "admin" | "member") => {
    const ok = await confirmUpdate();
    if (!ok) return;
    updateMember({ id: memberId, role }, {
      onSuccess: () => {
        toast.success("Role chaned");
      },
      onError: () => {
        toast.success("Failed to change role");
      }
    })
  }

  if (isLoadingMember || isLoadingCurrentMember) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex h-[49px] justify-between items-center px-4 border-b">
          <p className="text-lg font-bold">Profile</p>
          <Button onClick={onClose} size="iconSm" variant="ghost">
            <XIcon className="size-5  stroke-[1.5]" />
          </Button>
        </div>
        <div className="flex h-full items-center justify-center">
          <Loader className="size-5 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }
  if (!member) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex h-[49px] justify-between items-center px-4 border-b">
          <p className="text-lg font-bold">Profile not found</p>
          <Button onClick={onClose} size="iconSm" variant="ghost">
            <XIcon className="size-5  stroke-[1.5]" />
          </Button>
        </div>
        <div className="flex flex-col gap-y-2 h-full items-center justify-center">
          <AlertTriangle className="size-5 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Message not found</p>
        </div>
      </div>
    );
  }
  const avatarFallBack = member.user.name?.[0].toUpperCase() ?? "M";
  return (
    <>
      <LeaveDialog />
      <RemoveDialog />
      <UpdateDialog />
      <div className="h-full flex flex-col">
        <div className="flex h-[49px] justify-between items-center px-4 border-b">
          <p className="text-lg font-bold">Profile</p>
          <Button onClick={onClose} size="iconSm" variant="ghost">
            <XIcon className="size-5  stroke-[1.5]" />
          </Button>
        </div>
        <div className="flex p-4 items-center justify-center">
          <Avatar className="max-w-[256px] max-h-[256px] size-full">
            <AvatarImage src={member.user.image} />
            <AvatarFallback className="aspect-square text-6xl">
              {avatarFallBack}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="flex flex-col p-4">
          <p className="text-xl font-bold">{member.user.name}</p>
          {(currentMember?.role === "admin" && currentMember?._id !== memberId) ? (
            <div className="flex items-center gap-2 mt-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button disabled={pending} variant="outline" className="w-full capitalize">
                    {member.role} <ChevronDownIcon className="size-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full">
                  <DropdownMenuRadioGroup
                    value={member.role}
                    onValueChange={(role) => onUpdate(role as "admin" | "member")}
                  >
                    <DropdownMenuRadioItem value="admin">
                      Admin
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="member">
                      Member
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button disabled={pending} onClick={onRemove} variant="outline" className="w-full">Remove</Button>
            </div>
          ) : currentMember?.role !== "admin" && currentMember?._id === memberId ? (
            <div className="mt-4">
              <Button disabled={pending} onClick={onLeave} variant="outline" className="w-full">Leave</Button>
            </div>
          ) : null}
        </div>
        <Separator />
        <div className="flex flex-col p-4">
          <p className="text-sm font-bold mb-4">Contact information</p>
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center bg-muted size-9 rounded-md">
              <MailIcon className="size-4" />
            </div>
            <div className="flex flex-col">
              <p className="text-[13px] text-muted-foreground font-semibold"></p>
              <Link
                className="text-sm hover:underline text-[#1264a3]"
                href={`mailto:${member.user.email}`}
              >
                {member.user.email}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Profile