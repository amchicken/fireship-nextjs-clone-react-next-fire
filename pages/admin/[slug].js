import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import ImageUploader from "@components/ImageUploader";

import { useDocumentData } from "react-firebase-hooks/firestore";
import { useForm } from "react-hook-form";
import ReactMarkdown from "react-markdown";
import AuthCheck from "@components/AuthCheck";
import toast from "react-hot-toast";
import { firestore, auth, serverTimeStamp } from "@lib/firebase";

export default function AdminPostEdit() {
  return (
    <AuthCheck>
      <PostManager />
    </AuthCheck>
  );
}

function PostManager() {
  const [preview, setPreview] = useState(false);

  const router = useRouter();
  const { slug } = router.query;
  const postRef = firestore
    .collection("users")
    .doc(auth.currentUser.uid)
    .collection("posts")
    .doc(slug);

  const [post] = useDocumentData(postRef);
  // const [post] = useDocumentDataOnce(postRef);

  return (
    <main className="container">
      {post && (
        <>
          <section>
            <h1>{post.title}</h1>
            <p>ID: {post.slug}</p>
            <PostForm
              postRef={postRef}
              defaultValues={post}
              preview={preview}
            />
          </section>
          <aside>
            <h3>Tools</h3>
            <button onClick={() => setPreview(!preview)}>
              {preview ? "Edit" : "Preview"}
            </button>
            <Link href={`/${post.username}/${post.slug}`}>
              <button className="btn btn-secondary">Live view</button>
            </Link>
          </aside>
        </>
      )}
    </main>
  );
}

function PostForm({ defaultValues, postRef, preview }) {
  console.log(defaultValues);
  const { register, handleSubmit, reset, watch, formState, errors } = useForm({
    defaultValues,
    mode: "onChange",
  });

  const { isValid, isDirty } = formState;

  const updatePost = async ({ content, published }) => {
    await postRef.update({
      content,
      published: Boolean(published),
      updatedAt: serverTimeStamp(),
    });

    console.log(content, published);

    reset({ content, published });
    toast.success("Update sucess");
  };

  return (
    <form onSubmit={handleSubmit(updatePost)}>
      {preview && (
        <div className="card">
          <ReactMarkdown>{watch("content")}</ReactMarkdown>
        </div>
      )}
      <div className={preview ? "hidden" : null}>
        <ImageUploader />
        <textarea
          ref={register({
            maxLength: { value: 20000, message: "content is too long" },
            minLength: { value: 10, message: "content is too short" },
            required: { value: true, message: "content is required" },
          })}
          name="content"
        ></textarea>
        {errors.content && <p>{errors.content.message}</p>}
        <fieldset>
          <input type="checkbox" ref={register} name="published" />
          <label>Published</label>
        </fieldset>
        <button
          type="submit"
          className={
            !isDirty || !isValid
              ? "btn btn-primary btn-disabled"
              : "btn btn-primary"
          }
          disabled={!isDirty || !isValid}
        >
          Save Changes
        </button>
      </div>
    </form>
  );
}
