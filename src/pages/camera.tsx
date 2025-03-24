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
      <div>
        <h3>image/*, .pdf</h3>
        <input
          type="file"
          accept="image/*, .pdf"
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
          onChange={handleCapture}
          style={{ display: "block", margin: "10px auto" }}
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
