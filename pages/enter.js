import { auth, googleAuthProvider, firestore } from "@lib/firebase";
import { useCallback, useContext, useEffect, useState } from "react";
import { UserContext } from "@lib/context";
import debounce from "lodash.debounce";

export default function Enter() {
  const { user, username } = useContext(UserContext);

  //   1. user sigen out <SignInButton/>
  //   2. user signed in, but missing username <UsernameForm />
  //   3.user signed in, has username <SignOutButton/>
  return (
    <main>
      {user ? (
        !username ? (
          <UsernameForm />
        ) : (
          <SignOutButton />
        )
      ) : (
        <SignInButton />
      )}
    </main>
  );
}

// Sign in with google
function SignInButton() {
  const signInWithGoogle = async () => {
    await auth.signInWithPopup(googleAuthProvider);
  };

  return (
    <button className="btn" onClick={signInWithGoogle}>
      <img
        src={"/google.png"}
        style={{ width: "1rem", height: "1rem" }}
        alt=""
      />{" "}
      Sign in with Google
    </button>
  );
}

// Sign out button
function SignOutButton() {
  return (
    <button onClick={() => auth.signOut()} className="btn btn-secondary">
      Sign Out
    </button>
  );
}

function UsernameForm() {
  const [formValue, setFormValue] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);

  const { user, username } = useContext(UserContext);

  useEffect(() => {
    checkUsername(formValue);
  }, [formValue]);

  const onChange = (e) => {
    const val = e.target.value.toLowerCase();
    const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

    if (val.length < 3) {
      setFormValue(val);
      setLoading(false);
      setIsValid(false);
    }

    if (re.test(val)) {
      setFormValue(val);
      setLoading(true);
      setIsValid(false);
    }
  };

  const checkUsername = useCallback(
    debounce(async (username) => {
      if (username.length >= 3) {
        const ref = firestore.doc(`usernames/${username}`);
        const { exists } = await ref.get();
        console.log("FireStore read exec");
        setIsValid(!exists);
        setLoading(false);
      }
    }, 500),
    []
  );

  const onSubmit = async (e) => {
    e.preventDefault();

    //Create Ref for documents
    const userDoc = firestore.doc(`users/${user.uid}`);
    const usernameDoc = firestore.doc(`usernames/${formValue}`);

    //commit both docs together as a batch write.
    const batch = firestore.batch();
    batch.set(userDoc, {
      username: formValue,
      photoURL: user.photoURL,
      displayName: user.displayName,
    });
    batch.set(usernameDoc, { uid: user.uid });
    await batch.commit();
  };

  return (
    !username && (
      <section>
        <h3>Chosose Username</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="username"
            placeholder="username"
            value={formValue}
            onChange={onChange}
          />

          <UsernameMessage
            username={formValue}
            isValid={isValid}
            loading={loading}
          />

          <button
            type="submit"
            className="btn btn-secondary"
            disabled={!isValid}
          >
            Choose
          </button>

          <h3>Debug State</h3>
          <div>
            Username: {formValue}
            <br />
            Loading: {loading.toString()}
            <br />
            Username isValid: {isValid.toString()}
          </div>
        </form>
      </section>
    )
  );
}

function UsernameMessage({ username, isValid, loading }) {
  if (loading) {
    return <p>Checking ...</p>;
  } else if (isValid) {
    return <p>{username} is available</p>;
  } else if (username && !isValid) {
    return <p>That username has taken</p>;
  } else {
    return <p></p>;
  }
}
