// import jsPDF from "jspdf";
import jsPDF from "jspdf";
import { useState } from "react";

export default function DebugDownload() {
  const [fileBase64, setFileBase64] = useState<string | null>(null);
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

  const handleDownloadWithBase64FromBlob = () => {
    const doc = new jsPDF();

    // Add some content to the PDF
    doc.text("Hello world, this is a PDF downloaded as a Blob.", 10, 10);

    // Generate the PDF as a Blob
    const blob = doc.output("blob");

    const reader = new FileReader();

    reader.onload = function (event) {
      const base64String = event?.target?.result;
      if (typeof base64String !== "string") return;
      setFileBase64(base64String);
    };

    reader.readAsDataURL(blob);
  };

  const downloadFile = () => {
    if (fileBase64 === null) return;
    const link = document.createElement("a");
    link.href = fileBase64;
    link.download = "downloaded-file.pdf"; // You can specify any filename you want

    // Trigger a click event on the link to initiate the download
    link.click();
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
      <br />
      Solution:
      <br />
      <button
        style={{
          background: "aquamarine",
          padding: "10px",
          borderRadius: "5px",
          marginBottom: "10px",
          color: "#000",
          marginRight: "10px",
        }}
        onClick={handleDownloadWithBase64FromBlob}
      >
        convert blob to base64
      </button>
      {fileBase64 && (
        <button
          style={{
            background: "aquamarine",
            padding: "10px",
            borderRadius: "5px",
            marginBottom: "10px",
            color: "#000",
          }}
          onClick={downloadFile}
        >
          Download File
        </button>
      )}
    </div>
  );
}
