import { useGetSuggestedAccounts } from "@/hooks/useGetSuggestedAccounts";
import SuggestedUserCard from "@/components/SuggestedUserCard";

const Suggested = () => {
  const { suggestedAccounts, loading, error } = useGetSuggestedAccounts();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <>
      <div className="text-xl font-semibold mb-4">
        Suggested accounts to follow
      </div>
      {suggestedAccounts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {suggestedAccounts.map((user) => (
            <SuggestedUserCard
              key={user.id}
              user={{
                ...user,
                createdAt: new Date(),
                updatedAt: new Date(),
              }}
            />
          ))}
        </div>
      ) : (
        <div className="text-center text-muted-foreground">
          No suggested users
        </div>
      )}
    </>
  );
};

export default Suggested;
