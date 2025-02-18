"use client";
"use client";
// import jsPDF from "jspdf";

import heic2any from "heic2any";
import { useRef } from "react";

export default function UploadImage() {
  const refFileInput = useRef<HTMLInputElement>(null);

  const handleOnChangeFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "image/heic") {
      try {
        // Convert the HEIC file to a regular image (e.g., PNG)
        const result = await heic2any({ blob: file, toType: "image/jpeg" });
        console.log("result", result);
        // Create an object URL and display the converted image
        const imageUrl = URL.createObjectURL(result as Blob);
        console.log("imageUrl", imageUrl);
        const getdocuementId = document?.getElementById(
          "outputImage"
        ) as HTMLImageElement;
        if (getdocuementId) {
          getdocuementId.src = imageUrl;
        }
      } catch (error) {
        console.error("Error converting HEIC file:", error);
      }
    } else {
      alert("Please select a valid HEIC file.");
    }
    // if (!file) return;
    // setImageUploaded(file);
    // const reader = new FileReader();

    // reader.onload = function (event) {
    //   const base64String = event?.target?.result;
    //   if (typeof base64String !== "string") return;
    //   setCurrentImage(base64String);
    // };

    // reader.readAsDataURL(file);
  };

  const handleOpenGallery = () => {
    refFileInput?.current?.click();
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
        capture="environment"
        onChange={handleOnChangeFile}
      />

      <img
        id="outputImage"
        style={{ maxWidth: "100%", maxHeight: "100%" }}
        alt="representation of the image"
      />
    </div>
  );
}
