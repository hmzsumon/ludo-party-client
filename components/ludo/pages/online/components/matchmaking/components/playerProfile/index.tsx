import Avatar from "@/components/ludo/avatar";
import Loading from "@/components/ludo/loading";

interface PlayerProfileProps {
  photo?: string;
  name: string;
  isBot?: boolean;
}

const PlayerProfile = ({
  photo = "",
  name = "",
  isBot = false,
}: PlayerProfileProps) => {
  const searching = !name;

  return (
    <div className="page-matchmaking-avatar">
      <div className="page-matchmaking-image-wrapper">
        {searching && (
          <div className="page-matchmaking-image-loading">
            <Loading />
          </div>
        )}
        <Avatar photo={photo} name={name} className="page-matchmaking-image" />
      </div>
      <span className="page-matchmaking-avatar-name">
        {!searching ? `${name}${isBot ? " 🤖" : ""}` : "Searching..."}
      </span>
    </div>
  );
};

export default PlayerProfile;
