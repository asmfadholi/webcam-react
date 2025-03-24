import { ChangeEvent, useState } from "react";

export default function CameraCapture() {
  const [image, setImage] = useState<string | null>(null);

  const handleCapture = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event?.target?.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <div>
        <h3>image/*, .pdf</h3>
        <input
          type="file"
          accept="image/*, .pdf"
          onClick={(e) => {
            e.currentTarget.capture = "";
          }}
          onChange={handleCapture}
          style={{ display: "block", margin: "10px auto" }}
        />
      </div>
      <br />
      <div>
        <h3>image/*, .pdf, capture=false</h3>
        <input
          type="file"
          accept="image/*, .pdf"
          capture={false}
          onClick={(e) => {
            // @ts-expect-error: adasd
            e.currentTarget.capture = null;
          }}
          onChange={handleCapture}
          style={{ display: "block", margin: "10px auto" }}
        />
      </div>

      <br />

      <div>
        <h3>.jpg, .jpeg, .png, .heic, .heif, .pdf</h3>
        <input
          type="file"
          accept=".jpg, .jpeg, .png, .heic, .heif, .pdf"
          onChange={handleCapture}
          style={{ display: "block", margin: "10px auto" }}
        />
      </div>

      <br />

      <div>
        <h3>.jpg, .jpeg, .png, .heic, .heif, .pdf, capture=false</h3>
        <input
          type="file"
          accept=".jpg, .jpeg, .png, .heic, .heif, .pdf"
          capture={false}
          onChange={handleCapture}
          style={{ display: "block", margin: "10px auto" }}
        />
      </div>

      <br />

      <div>
        <h3>.jpg, .jpeg, .png, .heic, .heif, .pdf, capture=environment</h3>
        <input
          type="file"
          accept=".jpg, .jpeg, .png, .heic, .heif, .pdf"
          capture="environment"
          onChange={handleCapture}
          style={{ display: "block", margin: "10px auto" }}
        />
      </div>

      <br />

      <div>
        <h3>.jpg, .jpeg, .png, .heic, .heif, .pdf, capture=user</h3>
        <input
          type="file"
          accept=".jpg, .jpeg, .png, .heic, .heif, .pdf"
          capture="user"
          onChange={handleCapture}
          style={{ display: "block", margin: "10px auto" }}
        />
      </div>

      <br />

      <div>
        <h3>.pdf</h3>
        <input
          type="file"
          accept=".pdf"
          onChange={handleCapture}
          style={{ display: "block", margin: "10px auto" }}
        />
      </div>

      <br />

      <div>
        <button
          onClick={() => {
            document.getElementById("fileInput")?.click();
          }}
        >
          Upload Image
        </button>
        <input
          type="file"
          id="fileInput"
          accept=".jpg,.jpeg,.png,.heic,.heif,.pdf"
          style={{ display: "none" }}
        />
      </div>

      <div>
        {image && (
          <img
            src={image}
            alt="Captured"
            style={{ maxWidth: "100%", marginTop: "10px" }}
          />
        )}
      </div>
    </div>
  );
}
