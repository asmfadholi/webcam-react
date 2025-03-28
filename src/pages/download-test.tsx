// import jsPDF from "jspdf";
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

  const refFileInput = useRef<HTMLInputElement>(null);
  const refImage = useRef<HTMLImageElement>(null);

  const downloadImage = () => {
    if (!currentImage || !refFileInput.current || !refImage.current) return;
    const link = document.createElement("a");

    // If the file is a Data URL (Base64-encoded), use the content directly
    link.href = currentImage;
    link.download = "image"; // Set the file name for download

    // Trigger a click event to download the file
    link.click();

    /* if (!currentImage || !refFileInput.current || !refImage.current) return;

    const doc = new jsPDF();

    const imgWidth = refImage.current.width;
    const imgHeight = refImage.current.height;
    console.log("imgWidth", imgWidth);
    console.log("imgHeight", imgHeight);

    // Define the maximum size for the image on A4 paper (in mm)
    const a4Width = 210 - 10; // A4 width in mm
    const a4Height = 297 - 10; // A4 height in mm

    // Calculate the aspect ratio of the image
    const aspectRatio = imgWidth / imgHeight;

    // Calculate the width and height that maintain the aspect ratio and fit within A4
    let width = a4Width;
    let height = a4Width / aspectRatio;

    // If the height exceeds the A4 height, scale down by height instead
    if (height > a4Height) {
      height = a4Height;
      width = a4Height * aspectRatio;
    }

    // Add the image to the PDF
    doc.addImage(currentImage, "PNG", 5, 5, width, height);

    // Save the generated PDF
    doc.save("image.pdf"); */
  };

  const handleDownloadWithBlob = () => {
    // Create a new jsPDF instance
    const doc = new jsPDF();

    // Add some content to the PDF
    doc.text("Hello world, this is a PDF downloaded as a Blob.", 10, 10);

    // Generate the PDF as a Blob
    const blob = doc.output("blob");
    try {
      // Create a URL for the Blob
      const url = URL.createObjectURL(blob);

      // Create an invisible download link
      const link = document.createElement("a");
      link.href = url;
      link.download = "downloaded-file.pdf"; // You can specify any filename you want

      // Trigger a click event on the link to initiate the download
      link.click();
    } catch (error) {
      alert(error);
    }
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

  const handleOnChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (event) {
      const base64String = event?.target?.result;
      if (typeof base64String !== "string") return;
      setCurrentImage(base64String);
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
        accept="*/*"
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
            ref={refImage}
            src={currentImage}
            alt="result"
            objectFit="contain"
            width={100}
            height={100}
          />
          <button
            id="start-button"
            onClick={downloadImage}
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
          <button
            style={{
              background: "aquamarine",
              padding: "10px",
              borderRadius: "5px",
              marginBottom: "10px",
              color: "#000",
            }}
            onClick={() => alert(currentImage)}
          >
            Check image
          </button>
          <button
            style={{
              background: "aquamarine",
              padding: "10px",
              borderRadius: "5px",
              marginBottom: "10px",
              color: "#000",
            }}
            onClick={handleDownloadWithBlob}
          >
            Download blob
          </button>
        </div>
      )}
    </div>
  );
}
