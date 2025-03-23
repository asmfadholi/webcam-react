import { ChangeEvent, useState } from "react";

export default function CameraCapture() {
  const [image, setImage] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState<boolean>(false);

  const handleCapture = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event?.target?.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <input
        type="file"
        accept={showCamera ? "image/*" : ".txt,.pdf"}
        onChange={handleCapture}
        style={{ display: "block", margin: "10px auto" }}
      />
      <button onClick={() => setShowCamera((prev) => !prev)}>change it</button>
      <div>isshowCamera: {showCamera ? "true" : "false"}</div>
      {image && (
        <img
          src={image}
          alt="Captured"
          style={{ maxWidth: "100%", marginTop: "10px" }}
        />
      )}
    </div>
  );
}
