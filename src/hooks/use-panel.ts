import useProfileMemberId from "@/features/members/store/use-profile-member-id";
import useParentMessageId from "@/features/messages/store/use-parent-message-id"


const usePanel = () => {
  const [parentMessageId, setParentMessageId] = useParentMessageId();
  const [profileMemberId, setProfileMemberId] = useProfileMemberId();

  const onOpenMessage = (messageId: string) => {
    setParentMessageId(messageId);
    setProfileMemberId(null);
  }

  const onOpenProfile = (memberId: string) => {
    setProfileMemberId(memberId);
    setParentMessageId(null);
  }

  const onClose = () => {
    setParentMessageId(null);
    setProfileMemberId(null);
  }

  return {
    profileMemberId,
    parentMessageId,
    onOpenProfile,
    onOpenMessage,
    onClose
  }
}

export default usePanel