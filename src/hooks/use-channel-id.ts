import { useParams } from 'next/navigation'
import { Id } from '../../convex/_generated/dataModel';


export const UsechannelId = () => {
  const params = useParams();
  return params.channelId as Id<"channels"> ;
}