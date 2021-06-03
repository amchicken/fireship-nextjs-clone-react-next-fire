export default function UserProfile({ user }) {
  return (
    <div className="center">
      <img src={user.photoURL} alt="" />
      <p>
        <i>@{user.username}</i>
      </p>
      <h1>{user.displayName}</h1>
    </div>
  );
}
