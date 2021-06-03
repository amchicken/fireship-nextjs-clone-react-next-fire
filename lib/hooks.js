import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { firestore, auth } from "@lib/firebase";

export function useUserData() {
  const [user] = useAuthState(auth);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    //turn off realtime subscription
    let unsubscribe;
    if (user) {
      const ref = firestore.collection("users").doc(user.uid);
      unsubscribe = ref.onSnapshot((doc) => setUsername(doc.data()?.username));
    } else setUsername(null);
  }, [user]);

  return { user, username };
}
