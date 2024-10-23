import { useGetFollowingAccounts } from "@/hooks/useGetFollowingAccounts";
import SuggestedUserCard from "@/components/SuggestedUserCard";
import { Spinner } from "@/components/ui/spinner";

interface User {
  id: number;
  fullname: string;
  email: string;
  image?: string;
  googleImage?: string;
}

const Following = () => {
  const { followingAccounts, loading, error } = useGetFollowingAccounts();

  if (loading) return <Spinner />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <>
      <div className="text-xl font-semibold mb-4">
        Accounts you are following
      </div>
      {followingAccounts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {followingAccounts.map((user: User) => (
            <SuggestedUserCard
              key={user.id}
              user={{
                ...user,
                createdAt: new Date(), // Adjust if you have actual timestamps
                updatedAt: new Date(),
              }}
            />
          ))}
        </div>
      ) : (
        <div className="text-center text-muted-foreground">
          You are not following any users.
        </div>
      )}
    </>
  );
};

export default Following;
