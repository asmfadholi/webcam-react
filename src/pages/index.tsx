import jsPDF from "jspdf";
import Image from "next/image";
import { useRef, useState } from "react";

export default function Home() {
  const [facingMode, setFacingMode] = useState<"user" | "environment">(
    "environment"
  );
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [currentCapabilities, setCurrentCapabilities] =
    useState<MediaTrackCapabilities | null>(null);
  const refVideo = useRef<HTMLVideoElement>(null);
  const refCanvas = useRef<HTMLCanvasElement>(null);

  const handleCheckResolution = () => {
    alert(
      `Current max resolution: ${currentCapabilities?.width?.max}x${currentCapabilities?.height?.max}`
    );
  };

  const handleOpenDevice = async (fMode = facingMode) => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
      alert("devices not supported");
      return false;
    }
    const resUserMedia = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: fMode,
        width: { ideal: 3264 },
        height: { ideal: 2448 },
      },
    });
    const videoTrack = resUserMedia.getVideoTracks()[0];
    const capabilities = videoTrack.getCapabilities();
    setCurrentCapabilities(capabilities);
    if (refVideo.current) {
      refVideo.current.srcObject = resUserMedia;
      refVideo.current.play();
    }
  };

  const handleCloseDevice = async () => {
    if (!refVideo.current) return;
    const srcObj = refVideo.current.srcObject as MediaStream;
    srcObj?.getTracks().forEach(function (track) {
      track.stop();
    });
    refVideo.current.srcObject = null;
  };

  const takePicture = () => {
    if (!refCanvas.current || !refVideo.current) return;
    const context = refCanvas.current.getContext("2d");
    const width = refVideo.current.videoWidth;
    const height = refVideo.current.videoHeight;
    if (width && height && context) {
      refCanvas.current.width = width;
      refCanvas.current.height = height;
      context.drawImage(refVideo.current, 0, 0, width, height);

      const data = refCanvas.current.toDataURL("image/png");
      setCurrentImage(data);
    }
  };

  const downloadPdf = () => {
    if (!currentImage || !refCanvas.current) return;

    const doc = new jsPDF();
    // Add the base64 image to the PDF
    const aspectRatio = refCanvas.current.width / refCanvas.current.height;
    const A4_WIDTH = 210 - 10;
    const A4_HEIGHT = 297 - 10;
    let scaledWidth = A4_WIDTH;
    let scaledHeight = A4_WIDTH / aspectRatio;

    if (scaledHeight > A4_HEIGHT) {
      scaledHeight = A4_HEIGHT;
      scaledWidth = A4_HEIGHT * aspectRatio;
    }
    // Parameters: base64 string, 'PNG', x, y, width, height
    doc.addImage(currentImage, "PNG", 5, 5, scaledWidth, scaledHeight);

    // Save the PDF
    doc.save("image.pdf");
  };

  const handleFlipCamera = async () => {
    const newFMode = facingMode === "user" ? "environment" : "user";
    setFacingMode(newFMode);
    handleCloseDevice();
    await handleOpenDevice(newFMode);
  };

  return (
    <div>
      <button
        onClick={() => handleOpenDevice()}
        style={{
          background: "beige",
          padding: "10px",
          borderRadius: "5px",
          marginBottom: "10px",
        }}
      >
        Start Camera
      </button>
      <br />
      <button
        onClick={handleCloseDevice}
        style={{
          background: "pink",
          padding: "10px",
          borderRadius: "5px",
          marginBottom: "10px",
        }}
      >
        Close
      </button>
      <br />
      <button
        onClick={handleFlipCamera}
        style={{
          background: "burlywood",
          padding: "10px",
          borderRadius: "5px",
          marginBottom: "10px",
        }}
      >
        Flip Camera
      </button>
      <div className="camera">
        <video
          id="video"
          ref={refVideo}
          style={{
            height: "100vh",
            width: "100vw",
            position: "fixed",
            top: 0,
            zIndex: -1,
          }}
        >
          Video stream not available.
        </video>
      </div>

      <button
        id="start-button"
        onClick={takePicture}
        style={{
          background: "aqua",
          padding: "10px",
          borderRadius: "5px",
          marginBottom: "10px",
        }}
      >
        Take photo
      </button>
      <canvas ref={refCanvas} style={{ display: "none" }}></canvas>
      {currentImage && (
        <>
          <p>Result photo:</p>
          <Image
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
            }}
          >
            Download
          </button>
        </>
      )}
      <br />
      {currentCapabilities && (
        <button
          id="start-button"
          onClick={handleCheckResolution}
          style={{
            background: "aquamarine",
            padding: "10px",
            borderRadius: "5px",
            marginBottom: "10px",
          }}
        >
          Check Resolution
        </button>
      )}
    </div>
  );
}
