import ReactMarkdown from "react-markdown";
import Link from "next/link";
import ReactTimeAgo from "react-time-ago";
import TimeAgo from "javascript-time-ago";

import en from "javascript-time-ago/locale/en";
TimeAgo.addLocale(en);

export default function PostContent({ post }) {
  const createdAt =
    typeof post?.createdAt === "number"
      ? new Date(post.createdAt)
      : new Date(post.createdAt.toMillis());
  return (
    <div className="card">
      <h1>{post?.title}</h1>
      <span className="text-sm">
        {" "}
        Written by{" "}
        <Link href={`/${post.username}`}>
          <a className="text-info">@{post.username}</a>
        </Link>
      </span>{" "}
      on <ReactTimeAgo date={createdAt} locale="en" />
      <ReactMarkdown>{post?.content}</ReactMarkdown>
    </div>
  );
}
