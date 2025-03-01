import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { UseRemoveChannel } from "@/features/channels/api/use-remove-channel";
import { UseUpdateChannel } from "@/features/channels/api/use-update-channel";
import useCurrentMember from "@/features/members/api/use-current-members";
import { UsechannelId } from "@/hooks/use-channel-id";
import useConfirm from "@/hooks/use-confirm";
import { UseWorkspaceId } from "@/hooks/use-workspace-id";
import { TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { toast } from "sonner";

interface HeaderProps {
  title: string;
}

const Header = ({ title }: HeaderProps) => {
  const router = useRouter();
  const channelId = UsechannelId();
  const workspaceId = UseWorkspaceId();
  const { data: member } = useCurrentMember({ workspaceId });
  const [editOpen, setEditOpen] = useState(false);
  const [value, setValue] = useState(title);

  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure",
    "Channel will be deleted permanently"
  );

  const { mutate: updateChannel, isPending: isUpdatingChannel } =
    UseUpdateChannel();
  const { mutate: removeChannel, isPending: isRemovingChannel } =
    UseRemoveChannel();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s+/g, "-").toLowerCase();
    setValue(value);
  };

  const handleEditOpen = (value: boolean) => {
    if (member?.role !== "admin") return;
    setEditOpen(value);
  };

  const handleEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateChannel(
      {
        id: channelId,
        name: value,
      },
      {
        onSuccess() {
          setEditOpen(false);
          toast.success("Channel updated");
        },
        onError() {
          toast.success("Failed to update channel");
        },
      }
    );
  };
  const handleRemove = async () => {
    const ok = await confirm();
    if (!ok) return;
    removeChannel(
      {
        id: channelId,
      },
      {
        onSuccess() {
          toast.success("Channel deleted");
          router.replace(`/workspace/${workspaceId}`);
        },
        onError() {
          toast.error("Failed to delete channel");
        },
      }
    );
  };

  return (
    <div className="bg-white border-b h-[49px] flex items-center px-4 overflow-hidden">
      <ConfirmDialog />
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="font-semibold text-lg overflow-hidden px-2 w-auto"
          >
            <span className="truncate"># {title}</span>
            <FaChevronDown className="size-2.5 ml-2" />
          </Button>
        </DialogTrigger>
        <DialogContent className="p-0 bg-gray-50 overflow-hidden">
          <DialogHeader className="p-4 border-b bg-white">
            <DialogTitle># {title}</DialogTitle>
          </DialogHeader>
          <div className="px-4 pb-4 flex flex-col gap-y-2">
            <Dialog open={editOpen} onOpenChange={handleEditOpen}>
              <DialogTrigger>
                <div className="px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">Channel name</p>
                    {member?.role === "admin" && (
                      <p className="text-sm text-[#1264a3] font-semibold hover:underline">
                        Edit
                      </p>
                    )}
                  </div>
                  <p className="text-sm text-start"># {title}</p>
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Rename this Channel</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleEdit} className="space-y-4">
                  <Input
                    value={value}
                    disabled={isUpdatingChannel}
                    onChange={handleChange}
                    required
                    autoFocus
                    minLength={3}
                    maxLength={80}
                    placeholder="e.g. plan-budget"
                  />
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline" disabled={isUpdatingChannel}>
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button disabled={isUpdatingChannel}>Save</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            {member?.role === "admin" && (
              <button
                onClick={handleRemove}
                disabled={isRemovingChannel}
                className="flex items-center gap-x-2 px-5 py-4 rounded-lg cursor-pointer bg-white border hover:bg-gray-50 text-rose-600"
              >
                <TrashIcon className="size-4" />
                <p className="text-sm font-semibold">Delete Channel</p>
              </button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Header;
