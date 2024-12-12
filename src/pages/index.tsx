import jsPDF from "jspdf";
import Image from "next/image";
import { useRef, useState } from "react";

const RESOLUTIONS = [
  {
    value: "1mp",
    label: "1280 x 720 px (1MP)",
  },
  {
    value: "2mp",
    label: "1920 x 1080 px (2MP)",
  },
  {
    value: "5mp",
    label: "2592 x 1456 px (5MP)",
  },
  {
    value: "8mp",
    label: "3264 x 1840 px (8MP)",
  },
  {
    value: "12mp",
    label: "4000 x 2250 px (12MP)",
  },
  {
    value: "16mp",
    label: "4608 x 2592 px (16MP)",
  },
  {
    value: "20mp",
    label: "5344 x 3008 px (20MP)",
  },
  {
    value: "48mp",
    label: "8000 x 4500 px (48MP)",
  },
] as const;

const pixelDetail = {
  "1mp": {
    height: 1280,
    width: 720,
  },
  "2mp": {
    height: 1920,
    width: 1080,
  },
  "5mp": {
    height: 2592,
    width: 1456,
  },
  "8mp": {
    height: 3264,
    width: 1840,
  },
  "12mp": {
    height: 4000,
    width: 2250,
  },
  "16mp": {
    height: 4608,
    width: 2592,
  },
  "20mp": {
    height: 5344,
    width: 3008,
  },
  "48mp": {
    height: 8000,
    width: 4500,
  },
};

const getResolutionList = (input: { maxWidth: number; maxHeight: number }) => {
  const { maxWidth, maxHeight } = input;
  const resolutions = [];
  for (const res of RESOLUTIONS) {
    const { width, height } = pixelDetail[res.value];
    if (width <= maxWidth || height <= maxHeight) {
      resolutions.push(res);
    }
  }
  return resolutions;
};

type PixelString = keyof typeof pixelDetail;

export default function Home() {
  const [isOpened, setIsOpened] = useState(false);
  const [facingMode, setFacingMode] = useState<"user" | "environment">(
    "environment"
  );
  const [currentResolution, setCurrentResolution] =
    useState<PixelString | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [currentCapabilities, setCurrentCapabilities] =
    useState<MediaTrackCapabilities | null>(null);
  const refVideo = useRef<HTMLVideoElement>(null);
  const refCanvas = useRef<HTMLCanvasElement>(null);

  const handleOpenDevice = async (fMode = facingMode) => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
      alert("devices not supported");
      return false;
    }
    const resUserMedia = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: fMode,
        width: {
          ideal: currentResolution
            ? pixelDetail[currentResolution].width
            : 1840,
        },
        height: {
          ideal: currentResolution
            ? pixelDetail[currentResolution].height
            : 3264,
        },
      },
    });
    const videoTrack = resUserMedia.getVideoTracks()[0];
    const capabilities = videoTrack.getCapabilities();
    setCurrentCapabilities(capabilities);
    const resolutionList = getResolutionList({
      maxHeight: capabilities.height?.max || 0,
      maxWidth: capabilities.width?.max || 0,
    });

    if (currentResolution === null) {
      setCurrentResolution(
        resolutionList?.[resolutionList.length - 1]?.value || "8mp"
      );
    }

    if (refVideo.current) {
      refVideo.current.srcObject = resUserMedia;
      refVideo.current.playsInline = true;
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
  };

  const handleCloseCamera = () => {
    handleCloseDevice();
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
    setIsOpened(false);
    setCurrentCapabilities(null);
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

  const handleChangeResolution = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentResolution(e.target.value);
    handleCloseDevice();
    handleOpenDevice(facingMode);
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
            color: "#000",
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
          playsInline
          muted
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
                color: "#000",
              }}
            >
              Flip
            </button>

            <button
              onClick={handleCloseCamera}
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
                color: "#000",
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
              color: "#000",
            }}
          >
            Download
          </button>
        </div>
      )}
      <br />
      {currentCapabilities && (
        <select
          name="resolution"
          value={currentResolution}
          onChange={handleChangeResolution}
          style={{
            background: "aquamarine",
            padding: "5px",
            borderRadius: "5px",
            marginBottom: "10px",
            width: "200px",
            height: "40px",
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
          {getResolutionList({
            maxHeight: currentCapabilities.height?.max || 0,
            maxWidth: currentCapabilities.width?.max || 0,
          }).map((res) => (
            <option key={res.value} value={res.value}>
              {res.label}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
