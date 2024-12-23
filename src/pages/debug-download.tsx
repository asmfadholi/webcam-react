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
  const handleDownloadWithBase64 = () => {
    // Create a new jsPDF instance
    const doc = new jsPDF();

    // Add some content to the PDF
    doc.text("Hello world, this is a PDF downloaded as a DataUri.", 10, 10);

    // Generate the PDF as a Blob
    const dataUriString = doc.output("datauristring");
    try {
      // Create an invisible download link
      const link = document.createElement("a");
      link.href = dataUriString;
      link.download = "downloaded-file.pdf"; // You can specify any filename you want

      // Trigger a click event on the link to initiate the download
      link.click();
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div>
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
        Download with Blob
      </button>

      <br />

      <button
        style={{
          background: "aquamarine",
          padding: "10px",
          borderRadius: "5px",
          marginBottom: "10px",
          color: "#000",
        }}
        onClick={handleDownloadWithBase64}
      >
        Download with Base64
      </button>
    </div>
  );
}
