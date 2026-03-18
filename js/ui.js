export function initUI({
  onModeChange,
  onCreatePlanet,
  onToggleTerrain,
  onSave,
  onLoad,
  onToggleFluid,
  onSpawnLight,
  onZoomIn,
  onZoomOut,
  onOpenTerrainStudio,
  onCloseTerrainStudio
}) {
  const sandboxBtn = document.getElementById("openSandbox");
  const creatorBtn = document.getElementById("openCreator");
  const sandboxInfo = document.getElementById("sandboxInfo");
  const creatorPanel = document.getElementById("creatorPanel");
  const fluidBtn = document.getElementById("toggleFluid");
  const terrainBtn = document.getElementById("toggleTerrain");
  const studioScreen = document.getElementById("terrainStudioScreen");

  let fluidOn = false;
  let terrainOn = false;

  const setMode = (mode) => {
    const sandbox = mode === "sandbox";
    sandboxBtn.classList.toggle("active", sandbox);
    creatorBtn.classList.toggle("active", !sandbox);
    sandboxInfo.classList.toggle("hidden", !sandbox);
    creatorPanel.classList.toggle("hidden", sandbox);
    onModeChange(mode);
  };

  sandboxBtn.onclick = () => setMode("sandbox");
  creatorBtn.onclick = () => setMode("creator");

  document.getElementById("createPlanet").onclick = () => {
    const payload = {
      name: document.getElementById("planetName").value,
      mass: Number(document.getElementById("planetMass").value),
      radius: Number(document.getElementById("planetRadius").value),
      distance: Number(document.getElementById("planetDistance").value),
      surfaceGravity: Number(document.getElementById("planetGravity").value)
    };
    onCreatePlanet(payload);
  };

  fluidBtn.onclick = () => {
    fluidOn = !fluidOn;
    fluidBtn.textContent = fluidOn ? "Disable Fluid" : "Enable Fluid";
    onToggleFluid();
  };

  terrainBtn.onclick = () => {
    terrainOn = !terrainOn;
    terrainBtn.textContent = terrainOn ? "Disable Terrain Sculpt" : "Enable Terrain Sculpt";
    onToggleTerrain();
  };

  document.getElementById("saveBtn").onclick = onSave;
  document.getElementById("loadBtn").onclick = onLoad;
  document.getElementById("spawnLight").onclick = onSpawnLight;
  document.getElementById("zoomInBtn").onclick = onZoomIn;
  document.getElementById("zoomOutBtn").onclick = onZoomOut;

  document.getElementById("openTerrainStudio").onclick = () => {
    studioScreen.classList.remove("hidden");
    onOpenTerrainStudio();
  };

  document.getElementById("studioEnableSculpt").onclick = () => {
    terrainOn = true;
    terrainBtn.textContent = "Disable Terrain Sculpt";
    onToggleTerrain(true);
  };

  document.getElementById("closeTerrainStudio").onclick = () => {
    studioScreen.classList.add("hidden");
    onCloseTerrainStudio();
  };

  setMode("sandbox");
}

export function setInfo(text) {
  document.getElementById("infoBox").textContent = text;
}

export function setTerrainStudioTitle(text) {
  document.getElementById("terrainStudioTitle").textContent = text;
}
