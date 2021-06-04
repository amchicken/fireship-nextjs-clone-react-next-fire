import HeartButton from "@components/HeartButton";
import PostContent from "@components/PostContent";
import { getUserWithUsername, postToJSON, firestore } from "@lib/firebase";
import { useDocumentData } from "react-firebase-hooks/firestore";
import AuthCheck from "@components/AuthCheck";
import Link from "next/link";

export async function getStaticProps({ params }) {
  const { username, slug } = params;
  const userDoc = await getUserWithUsername(username);

  let post;
  let path;
  if (userDoc) {
    const postRef = userDoc.ref.collection("posts").doc(slug);
    post = postToJSON(await postRef.get());
    path = postRef.path;
  } else {
    //if user or document not found redirect 404
    return {
      notFound: true,
    };
  }

  return {
    props: {
      post,
      path,
    },
    //set time for get new data (milliseconds)
    revalidate: 5000,
  };
}

export async function getStaticPaths() {
  //select emty docs
  const snapshot = await firestore.collection("posts").get();
  const paths = snapshot.docs.map((doc) => {
    const { slug, username } = doc.data();
    return {
      params: { username, slug },
    };
  });

  return {
    //MUST BE IN THIS FORMAT:
    /**
     * paths:[
     *  {
     *    params:{username,slug}
     *  }
     * ]
     */
    paths,
    //Fallback blocking = when user query not match to database we can redirect to 404 page
    fallback: "blocking",
  };
}

export default function Post(props) {
  const postRef = firestore.doc(props.path);
  const [realtimePost] = useDocumentData(postRef);

  const post = realtimePost || props.post;

  return (
    <main className="container">
      <section>
        <PostContent post={post} />
      </section>
      <aside className="card">
        <p>
          <strong>{post.heartCount || 0}💗</strong>
        </p>
        <AuthCheck
          fallback={
            <Link href="/enter">
              <button>💗 Sign Up</button>
            </Link>
          }
        >
          <HeartButton postRef={postRef} />
        </AuthCheck>
      </aside>
    </main>
  );
}
