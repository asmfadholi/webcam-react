import jsPDF from "jspdf";
import Image from "next/image";
import { useRef, useState } from "react";

const RESOLUTIONS = [
  {
    value: "QVGA",
    label: "320x240 (QVGA)",
  },
  {
    value: "VGA",
    label: "640x480 (VGA)",
  },
  {
    value: "HD",
    label: "1280x720 HD (720p)",
  },
  {
    value: "Full_HD",
    label: "1920x1080 Full HD (1080p)",
  },
  {
    value: "2K",
    label: "2560x1440	(2K)",
  },
  {
    value: "4K",
    label: "3840x2160 (4K)",
  },
] as const;

const pixelDetail = {
  QVGA: {
    height: 240,
    width: 320,
  },
  VGA: {
    height: 480,
    width: 640,
  },
  HD: {
    height: 720,
    width: 1280,
  },
  Full_HD: {
    height: 1080,
    width: 1920,
  },
  "2K": {
    height: 1440,
    width: 2560,
  },
  "4K": {
    height: 2160,
    width: 3840,
  },
};

const getResolutionList = (input: { maxWidth: number; maxHeight: number }) => {
  const { maxWidth, maxHeight } = input;
  const resolutions = [];
  for (const res of RESOLUTIONS) {
    const { width, height } = pixelDetail[res.value];
    if (width <= maxWidth && height <= maxHeight) {
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
  const refFileInput = useRef<HTMLInputElement>(null);

  const handleOpenDevice = async (
    fMode = facingMode,
    newResolution = currentResolution
  ) => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
      alert("devices not supported");
      return false;
    }
    const resUserMedia = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: fMode,
        width: newResolution
          ? pixelDetail[newResolution].width
          : pixelDetail.HD.width,
        height: newResolution
          ? pixelDetail[newResolution].height
          : pixelDetail.HD.height,
      },
    });
    const videoTrack = resUserMedia.getVideoTracks()[0];
    const capabilities = videoTrack.getCapabilities();
    setCurrentCapabilities(capabilities);

    if (currentResolution === null) {
      setCurrentResolution("HD");
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

  const handleChangeResolution = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newResolution = e.target.value as PixelString;
    setCurrentResolution(newResolution || null);
    handleCloseDevice();

    await handleOpenDevice(facingMode, newResolution);
  };

  const handleOpenGallery = () => {
    if (!refFileInput.current) return;
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
      handleCloseCamera();
    };

    reader.readAsDataURL(file);
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
            "&::WebkitMediaControls": {
              display:
                "none !important" /* Webkit-based browsers (Chrome, Safari) */,
            },

            "&::MozMediaControls": {
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
                width: "80px",
                height: "60px",
                color: "#000",
              }}
            >
              Flip
            </button>

            <div>
              <input
                ref={refFileInput}
                type="file"
                id="fileInput"
                style={{ display: "none" }}
                accept="image/*"
                capture="user"
                onChange={handleOnChangeFile}
              />

              <button
                onClick={handleOpenGallery}
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
                  width: "80px",
                  height: "60px",
                  color: "#000",
                }}
              >
                Gallery
              </button>
            </div>

            <button
              onClick={handleCloseCamera}
              style={{
                background: "red",
                borderRadius: "5px",
                zIndex: 3,
                transition: "150ms",
                position: "fixed",
                top: "0",
                bottom: "0",
                right: "0",
                left: "300px",
                margin: "auto",
                outline: "none",
                cursor: "pointer",
                marginTop: "20px",
                width: "30px",
                height: "30px",
                color: "#fff",
                textAlign: "center",
              }}
            >
              x
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
          value={currentResolution || ""}
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
