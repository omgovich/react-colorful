import { useRef, useEffect } from "react";

const useFaviconColor = (color) => {
  const canvas = useRef();

  const favSize = 64;
  const outlineRadius = 28;
  const pointerRadius = 22;

  // init canvas only once
  if (!canvas.current) {
    canvas.current = document.createElement("canvas");
    canvas.current.width = favSize;
    canvas.current.height = favSize;
  }

  useEffect(() => {
    const ctx = canvas.current.getContext("2d");

    // wipe out the canvas
    ctx.clearRect(0, 0, favSize, favSize);

    // draw an outline with shadow
    ctx.save();
    ctx.beginPath();
    ctx.arc(favSize * 0.5, favSize * 0.5, outlineRadius, 0, 2 * Math.PI, false);
    ctx.closePath();

    ctx.shadowColor = "rgba(0, 0, 0, 0.4)";
    ctx.shadowOffsetY = 1;
    ctx.shadowBlur = 6;
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.restore();

    // draw a pointer
    ctx.beginPath();
    ctx.arc(favSize * 0.5, favSize * 0.5, pointerRadius, 0, 2 * Math.PI, false);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();

    const link = document.createElement("link");
    link.id = "fav-pointer";
    link.rel = "shortcut icon";
    link.href = canvas.current.toDataURL("image/x-icon");

    // remove the old favicon from the document
    const prevFavicon = document.getElementById("fav-pointer");
    if (prevFavicon) document.head.removeChild(prevFavicon);

    document.head.appendChild(link);
  }, [color]);
};

export default useFaviconColor;
