import { useQuery } from "convex/react"
import { api } from "../../../../convex/_generated/api"


const useGetWorkspaces = () => {
  const data = useQuery(api.workspaces.get);
  const isLoading = data === undefined;

  return {data, isLoading}
}

export default useGetWorkspaces