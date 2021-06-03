import Metatags from "@components/Metatags";
import AuthCheck from "@components/AuthCheck";
import PostFeed from "@components/PostFeed";
import { firestore, auth, serverTimeStamp } from "@lib/firebase";
import { useContext, useState } from "react";
import { useRouter } from "next/router";
import kebabCase from "lodash.kebabcase";
import toast from "react-hot-toast";
import { useCollection } from "react-firebase-hooks/firestore";
import { UserContext } from "@lib/context";

export default function AdminPostsPage() {
  return (
    <main className="container">
      <AuthCheck>
        <Metatags title="admin page" />
        <PostList />
        <CreateNewPost />
      </AuthCheck>
    </main>
  );
}

function PostList() {
  const ref = firestore
    .collection("users")
    .doc(auth.currentUser.uid)
    .collection("posts");
  const query = ref.orderBy("createdAt");
  const [querySnapshot] = useCollection(query);
  const posts = querySnapshot?.docs.map((doc) => doc.data());
  return (
    <>
      <h1>Manage your posts</h1>
      <PostFeed posts={posts} />
    </>
  );
}

function CreateNewPost() {
  const router = useRouter();
  const { username } = useContext(UserContext);
  const [title, setTitle] = useState("");
  const slug = encodeURI(kebabCase(title));
  const isValid = title.length > 3 && title.length < 100;

  const createPost = async (e) => {
    e.preventDefault();
    const uid = auth.currentUser.uid;
    const ref = firestore
      .collection("users")
      .doc(uid)
      .collection("posts")
      .doc(slug);

    const data = {
      title,
      slug,
      username,
      published: false,
      content: "#some article",
      createdAt: serverTimeStamp(),
      updatedAt: serverTimeStamp(),
      heartCount: 0,
    };

    await ref.set(data);
    toast.success("Post Created!");

    router.push(`/admin/${slug}`);
  };
  return (
    <form onSubmit={createPost}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Some Article Title"
      />
      <p>
        <strong>Slug:</strong> {slug}
      </p>
      <button type="submit" className="btn btn-primary" disabled={!isValid}>
        Create New Post
      </button>
    </form>
  );
}
