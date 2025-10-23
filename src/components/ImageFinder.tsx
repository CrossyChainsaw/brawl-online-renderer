import React, { useState, useMemo } from "react";

// Dynamically import all images recursively from src/assets
const allImages: Record<string, string> = import.meta.glob(
  "../assets/**/*.{png,jpg,jpeg}",
  { eager: true, as: "url" }
);

const ImageFinder: React.FC = () => {
  const [selectedLegend, setSelectedLegend] = useState("");
  const [selectedSkin, setSelectedSkin] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  // Extract legends dynamically from folder names
  const legends = useMemo(() => {
    return Array.from(
      new Set(
        Object.keys(allImages).map((path) => {
          const parts = path.split("/");
          return parts[2]; // folder after ../assets/ = legend
        })
      )
    );
  }, []);

  // Extract skins dynamically based on selected legend
  const skins = useMemo(() => {
    if (!selectedLegend) return [];
    return Array.from(
      new Set(
        Object.keys(allImages)
          .filter((path) => path.includes(`/${selectedLegend}/`))
          .map((path) => {
            const parts = path.split("/");
            return parts[3] || "Default"; // folder after legend = skin
          })
      )
    );
  }, [selectedLegend]);

  // Extract colors dynamically based on selected legend + skin
// Extract colors dynamically based on selected legend + skin
const colors = useMemo(() => {
  if (!selectedLegend || !selectedSkin) return [];

  const imagesForSkin = Object.keys(allImages).filter(
    (path) => path.includes(`/${selectedLegend}/${selectedSkin}/`)
  );

  return Array.from(
    new Set(
      imagesForSkin.map((path) => {
        const filename = path.split("/").pop() || "";
        const parts = filename.split("_"); // ["ADA", "VixenAda", "Green", "01.png"]
        return parts[2] || "Unknown"; // 3rd part = color
      })
    )
  );
}, [selectedLegend, selectedSkin]);


  // Filter images based on selections
  const filteredImages = useMemo(() => {
    return Object.entries(allImages)
      .filter(([path]) => {
        return (
          (!selectedLegend || path.includes(`/${selectedLegend}/`)) &&
          (!selectedSkin || path.includes(`/${selectedSkin}/`)) &&
          (!selectedColor ||
            path.toLowerCase().includes(selectedColor.toLowerCase()))
        );
      })
      .map(([path, url]) => ({ path, url }));
  }, [selectedLegend, selectedSkin, selectedColor]);

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      {/* Legend Dropdown */}
      <div style={{ marginBottom: "1rem" }}>
        <label>Legend: </label>
        <select
          value={selectedLegend}
          onChange={(e) => {
            setSelectedLegend(e.target.value);
            setSelectedSkin("");
            setSelectedColor("");
          }}
        >
          <option value="">--Select Legend--</option>
          {legends.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
      </div>

      {/* Skin Dropdown */}
      {selectedLegend && skins.length > 0 && (
        <div style={{ marginBottom: "1rem" }}>
          <label>Skin: </label>
          <select
            value={selectedSkin}
            onChange={(e) => {
              setSelectedSkin(e.target.value);
              setSelectedColor("");
            }}
          >
            <option value="">--Select Skin--</option>
            {skins.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Color Dropdown */}
      {selectedLegend && colors.length > 0 && (
        <div style={{ marginBottom: "1rem" }}>
          <label>Color: </label>
          <select
            value={selectedColor}
            onChange={(e) => setSelectedColor(e.target.value)}
          >
            <option value="">--Select Color--</option>
            {colors.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Display Images */}
      <div
        style={{
          marginTop: "2rem",
          display: "flex",
          gap: "1rem",
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        {filteredImages.length > 0 ? (
          filteredImages.map(({ path, url }, i) => {
            const filename = path.split("/").pop() || `image_${i}.png`;
            return (
              <a key={i} href={url} download={filename}>
                <img
                  src={url}
                  alt="Legend Skin"
                  style={{
                    width: "150px",
                    height: "150px",
                    objectFit: "contain",
                    cursor: "pointer",
                  }}
                />
              </a>
            );
          })
        ) : (
          <p>No image found</p>
        )}
      </div>
    </div>
  );
};

export default ImageFinder;
