import jsPDF from "jspdf";
import Image from "next/image";
import { useRef, useState } from "react";

export default function Home() {
  const [isOpened, setIsOpened] = useState(false);
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
      `your max resolution: ${currentCapabilities?.width?.max}x${currentCapabilities?.height?.max}`
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
      setIsOpened(true);
    }
  };

  const handleCloseDevice = async () => {
    if (!refVideo.current) return;
    const srcObj = refVideo.current.srcObject as MediaStream;
    srcObj?.getTracks().forEach(function (track) {
      track.stop();
    });
    refVideo.current.srcObject = null;
    setIsOpened(false);
    setCurrentCapabilities(null);
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
    handleCloseDevice();
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
      {!isOpened && (
        <button
          onClick={() => handleOpenDevice()}
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
          }}
        >
          Start Camera
        </button>
      )}

      <br />

      <br />

      <div className="camera">
        <video
          id="video"
          ref={refVideo}
          autoPlay
          playsinline
          style={{
            position: "fixed",
            top: 0,
            zIndex: 0,
            width: "100%",
            height: "100vh",
            pointerEvents: "none",
            // @ts-expect-error: vendor prefix
            "&::-webkit-media-controls": {
              display:
                "none !important" /* Webkit-based browsers (Chrome, Safari) */,
            },

            "&::-moz-media-controls": {
              display: "none !important" /* Firefox */,
            },
          }}
        >
          Video stream not available.
        </video>
        {isOpened && (
          <>
            <button
              id="start-button"
              onClick={takePicture}
              style={{
                width: "60px",
                height: "60px",
                background: "#fff",
                border: "2px solid #000",
                padding: "10px",
                borderRadius: "100px",
                zIndex: 3,
                transition: "150ms",
                position: "fixed",
                top: "0",
                bottom: "0",
                right: "0",
                left: "0",
                margin: "auto",
                outline: "none",
                cursor: "pointer",
                marginBottom: "15px",
              }}
            ></button>

            <button
              onClick={handleFlipCamera}
              style={{
                background: "burlywood",
                padding: "10px",
                borderRadius: "5px",
                zIndex: 3,
                transition: "150ms",
                position: "fixed",
                top: "0",
                bottom: "0",
                right: "0",
                left: "200px",
                margin: "auto",
                outline: "none",
                cursor: "pointer",
                marginBottom: "15px",
                width: "60px",
                height: "60px",
                color: "white",
              }}
            >
              Flip
            </button>

            <button
              onClick={handleCloseDevice}
              style={{
                background: "pink",
                padding: "10px",
                borderRadius: "5px",
                zIndex: 3,
                transition: "150ms",
                position: "fixed",
                top: "0",
                bottom: "0",
                right: "200px",
                left: "0",
                margin: "auto",
                outline: "none",
                cursor: "pointer",
                marginBottom: "15px",
                width: "60px",
                height: "60px",
                color: "white",
              }}
            >
              Close
            </button>
          </>
        )}
      </div>

      <canvas ref={refCanvas} style={{ display: "none" }}></canvas>
      {currentImage && !isOpened && (
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
        </div>
      )}
      <br />
      {currentCapabilities && (
        <button
          id="start-button"
          onClick={handleCheckResolution}
          style={{
            background: "aquamarine",
            padding: "5px",
            borderRadius: "5px",
            marginBottom: "10px",
            width: "200px",
            height: "50px",
            zIndex: 0,
            position: "fixed",
            top: "0",
            bottom: "0",
            right: "0",
            left: "0",
            margin: "auto",
            marginTop: "15px",
            color: "#000",
          }}
        >
          Check Resolution
        </button>
      )}
    </div>
  );
}
