// import jsPDF from "jspdf";
import jsPDF from "jspdf";

export default function DebugDownload() {
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
