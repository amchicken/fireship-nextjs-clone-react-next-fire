import Link from "next/link";
import { useContext } from "react";
import { UserContext } from "@lib/context";

export default function Navbar() {
  const { user, username } = useContext(UserContext);

  return (
    <nav className="navbar">
      <ul>
        <li>
          <Link href="/">
            <button className="btn btn-primary">FEED</button>
          </Link>
        </li>
      </ul>
      <ul>
        {/* user signed-in and have username */}
        {username && (
          <>
            <li>
              <Link href="/admin">
                <button className="btn btn-secondary">WritePosts</button>
              </Link>
            </li>
            <li>
              <Link href={`/${username}`}>
                <img
                  style={{ cursor: "pointer" }}
                  className="profile-img"
                  src={user?.photoURL}
                  alt=""
                />
              </Link>
            </li>
          </>
        )}

        {/* user is not signed OR has not created username */}
        {!username && (
          <li>
            <Link href="enter">
              <button className="btn btn-secondary">Log in</button>
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}
