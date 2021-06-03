import { useState } from "react";
import { auth, storage, STATE_CHANGED } from "@lib/firebase";
import Loader from "@components/Loader";

export default function ImageUploader() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadURL, setDownloadURL] = useState(null);

  const uploadFile = async (e) => {
    //Get file to array
    const file = Array.from(e.target.files)[0];
    const extension = file.type.split("/")[1];

    //Make reference to the storage buckket location
    const ref = storage.ref(
      `uploads/${auth.currentUser.uid}/${Date.now()}.${extension}`
    );
    setUploading(true);

    //strart uploading
    const task = ref.put(file);

    //isten to updates to upload task
    task.on(STATE_CHANGED, (snapshot) => {
      const percentage = (
        (snapshot.bytesTransferred / snapshot.totalBytes) *
        100
      ).toFixed(0);

      //get downloadURL After task resolve (Note:this is not a native Promise can't use async await)
      task
        .then((d) => ref.getDownloadURL())
        .then((url) => {
          setDownloadURL(url);
          setUploading(false);
        });
    });
  };

  return (
    <div>
      <Loader show={uploading} />
      {uploading && <h3>{progress}%</h3>}

      {!uploading && (
        <>
          <label>
            📷Upload Img
            <input
              type="file"
              onChange={uploadFile}
              accept="image/x-png,image/gif,image/jpeg"
            />
          </label>
        </>
      )}

      {downloadURL && <code>{`![alt](${downloadURL})`}</code>}
    </div>
  );
}
