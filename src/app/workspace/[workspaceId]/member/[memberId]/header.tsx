import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { ChevronDown } from "lucide-react";



interface HeaderProps {
  memberName?: string;
  memberImage?: string;
  onClick?: () => void;
}

const Header = ({ memberImage, memberName = "Member", onClick }: HeaderProps) => {
  const avatarFallback = memberName.charAt(0).toUpperCase()

  return (
    <div className="bg-white border-b h-[49px] flex items-center px-4 overflow-hidden">
      <Button variant="ghost" size="sm" className="text-lg font-semibold px-2 overflow-hidden w-auto" onClick={onClick}>
        <Avatar className="size-6 mr-2">
          <AvatarImage src={memberImage} />
          <AvatarFallback>
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
        <span className="truncate">{memberName}</span>
        <ChevronDown className="size-2.5 ml-2"/>
      </Button>
    </div>
  );
};

export default Header;
