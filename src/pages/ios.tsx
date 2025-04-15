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
        {image && (
          // eslint-disable-next-line @next/next/no-img-element
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
