import jsPDF from "jspdf";
import ImageNext from "next/image";
import { useRef, useState } from "react";

function getDeviceType() {
  // @ts-expect-error: Unreachable code error
  const userAgent = navigator.userAgent || navigator.vendor || window?.opera;

  // Check for iOS (iPhone, iPad, iPod)
  if (/iPhone|iPad|iPod/i.test(userAgent)) {
    return "iOS";
  }

  // Check for Android
  if (/android/i.test(userAgent)) {
    return "Android";
  }

  // Default to 'Other' if neither is found
  return "Other";
}

export default function Alternative() {
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [ratioImage, setRatioImage] = useState<number | null>(null);

  const refFileInput = useRef<HTMLInputElement>(null);

  const downloadPdf = () => {
    if (!currentImage || !refFileInput.current || !ratioImage) return;
    console.log(currentImage, "currentImage");

    const doc = new jsPDF();
    // Add the base64 image to the PDF

    const A4_WIDTH = 210 - 10;
    const A4_HEIGHT = 297 - 10;
    let scaledWidth = A4_WIDTH;
    let scaledHeight = A4_WIDTH / ratioImage;

    if (scaledHeight > A4_HEIGHT) {
      scaledHeight = A4_HEIGHT;
      scaledWidth = A4_HEIGHT * ratioImage;
    }
    // Parameters: base64 string, 'PNG', x, y, width, height
    doc.addImage(currentImage, "PNG", 5, 5, scaledWidth, scaledHeight);

    // Save the PDF
    doc.save("image.pdf");
  };

  const handleOpenGallery = () => {
    if (!refFileInput.current) return;
    const deviceType = getDeviceType();
    if (deviceType === "iOS") {
      refFileInput.current.click();
      return;
    }
    refFileInput.current.click();
  };

  const handleRationBase64 = (base64String: string) => {
    const img = new Image();

    // When the image is loaded, calculate the aspect ratio
    img.onload = function () {
      const width = img.width;
      const height = img.height;

      // Calculate the aspect ratio
      const aspectRatio = width / height;

      setRatioImage(aspectRatio);
    };

    // Set the image source to the base64 string
    img.src = base64String;
  };

  const handleOnChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (event) {
      const base64String = event?.target?.result;
      if (typeof base64String !== "string") return;
      setCurrentImage(base64String);
      handleRationBase64(base64String);
    };

    reader.readAsDataURL(file);
  };

  return (
    <div>
      <button
        onClick={handleOpenGallery}
        style={{
          width: "100px",
          height: "100px",
          zIndex: 0,
          background: "beige",
          padding: "10px",
          borderRadius: "5px",
          marginBottom: "10px",
          position: "fixed",
          top: "0",
          bottom: "0",
          right: "0",
          left: "0",
          margin: "auto",
          color: "#000",
        }}
      >
        Open
      </button>

      <input
        ref={refFileInput}
        type="file"
        id="fileInput"
        style={{ display: "none" }}
        accept="image/*"
        capture="environment"
        onChange={handleOnChangeFile}
      />

      {currentImage && (
        <div
          style={{
            transition: "150ms",
            position: "fixed",
            top: "320px",
            bottom: "0",
            right: "0",
            left: "0",
            margin: "auto",
            outline: "none",
            cursor: "pointer",
            width: "100px",
            height: "200px",
            textAlign: "center",
          }}
        >
          <p>Result photo:</p>
          <ImageNext
            src={currentImage}
            alt="result"
            objectFit="contain"
            width={100}
            height={100}
          />
          <button
            id="start-button"
            onClick={downloadPdf}
            style={{
              background: "aquamarine",
              padding: "10px",
              borderRadius: "5px",
              marginBottom: "10px",
              color: "#000",
            }}
          >
            Download
          </button>
        </div>
      )}
    </div>
  );
}
