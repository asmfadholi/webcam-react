"use client";
import dynamic from "next/dynamic";
// import jsPDF from "jspdf";
import ImageNext from "next/image";
import { useRef, useState } from "react";

const UploadImageLazy = dynamic(
  () => import("@/components/pages/dul/UploadImage"),
  { ssr: false }
);

export default function Dul() {
  const [currentImage] = useState<string | null>(null);
  const [imageUploaded] = useState<File | null>(null);

  const refFileInput = useRef<HTMLInputElement>(null);
  const refImage = useRef<HTMLImageElement>(null);

  const downloadPdf = () => {
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

  return (
    <div>
      <UploadImageLazy />

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

          <div>format: {imageUploaded?.type}</div>
        </div>
      )}
    </div>
  );
}
