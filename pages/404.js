import Link from "next/link";

export default function Custom404() {
  return (
    <div className="center container">
      <h1>404 - Page not exists . . .</h1>
      <iframe
        src="https://giphy.com/embed/l2QE3oVEP88zGMTPa"
        width="480"
        height="480"
        frameBorder="0"
        allowFullScreen
      />
      <Link href="/">
        <button className="btn btn-primary">Back to Home</button>
      </Link>
    </div>
  );
}
