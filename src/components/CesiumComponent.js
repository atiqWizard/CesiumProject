import React, { useEffect, useRef, useState } from "react";
import {
  Viewer,
  Entity,
  EllipseGraphics,
  BillboardGraphics,
  LabelGraphics,
} from "resium";
import * as Cesium from "cesium";
import locationsData from "./locations.json";
const dropPin = `${process.env.PUBLIC_URL}/assets/svg/drop-pin.svg`;

export default function CesiumComponent() {
  const viewerRef = useRef(null);
  const [tokenLoaded, setTokenLoaded] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [locations, setLocations] = useState(locationsData.user1);

  useEffect(() => {
    try {
      const token = process.env.REACT_APP_CESIUM_ION_TOKEN;
      if (token) {
        Cesium.Ion.defaultAccessToken = token;
        setTokenLoaded(true);
      } else {
        console.error("Cesium ion access token is missing.");
      }
    } catch (error) {
      console.error("Error setting Cesium token:", error);
    }
  }, []);

  if (!tokenLoaded) return <div>Loading...</div>;

  const handleEntityClick = (location) => {
    setSelectedLocation(location);
    const viewer = viewerRef.current?.cesiumElement;
    if (viewer) {
      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(
          location.longitude,
          location.latitude,
          3000
        ),
        duration: 2,
      });
    }
  };

  const handleUserChange = (userKey) => {
    setLocations(locationsData[userKey]);
    setSelectedLocation(null);
  };

  return (
    <>
      <div
        style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          zIndex: 10,
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          padding: "10px",
          borderRadius: "5px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
        }}
      >
        <button onClick={() => handleUserChange("user1")}>User 1</button>
        <button onClick={() => handleUserChange("user2")}>User 2</button>
        <button onClick={() => handleUserChange("user3")}>User 3</button>
      </div>

      <Viewer
        ref={viewerRef}
        full
        animation={false}
        timeline={false}
        homeButton={false}
        sceneModePicker={false}
        navigationHelpButton={false}
        fullscreenButton={false}
        geocoder={false}
        navigationInstructionsInitiallyVisible={false}
        infoBox={false}
      >
        {locations.map((location) => (
          <Entity
            key={location.key}
            name={location.name}
            position={Cesium.Cartesian3.fromDegrees(
              location.longitude,
              location.latitude
            )}
            onClick={() => handleEntityClick(location)}
          >
            <BillboardGraphics
              image={dropPin}
              verticalOrigin={Cesium.VerticalOrigin.BOTTOM}
              heightReference={Cesium.HeightReference.CLAMP_TO_GROUND}
              scale={0.2}
            />

            {/* <BillboardGraphics
              image={new Cesium.PinBuilder()
                .fromColor(Cesium.Color.RED, 20)
                .toDataURL()}
              verticalOrigin={Cesium.VerticalOrigin.BOTTOM}
              heightReference={Cesium.HeightReference.CLAMP_TO_GROUND}
            /> */}
            <LabelGraphics
              text={location.name}
              font="14pt sans-serif"
              fillColor={Cesium.Color.BLACK}
              outlineColor={Cesium.Color.WHITE}
              outlineWidth={2}
              style={Cesium.LabelStyle.FILL_AND_OUTLINE}
              pixelOffset={new Cesium.Cartesian2(0, -40)}
            />
          </Entity>
        ))}

        {selectedLocation && (
          <>
            <Entity
              position={Cesium.Cartesian3.fromDegrees(
                selectedLocation.longitude,
                selectedLocation.latitude
              )}
            >
              <EllipseGraphics
                height={0}
                semiMajorAxis={selectedLocation.largeRadius}
                semiMinorAxis={selectedLocation.largeRadius}
                material={Cesium.Color.GREEN.withAlpha(0.2)}
                outline={true}
                outlineColor={Cesium.Color.GREEN}
              />
            </Entity>
            <Entity
              position={Cesium.Cartesian3.fromDegrees(
                selectedLocation.longitude,
                selectedLocation.latitude
              )}
            >
              <EllipseGraphics
                height={0}
                semiMajorAxis={selectedLocation.mediumRadius}
                semiMinorAxis={selectedLocation.mediumRadius}
                material={Cesium.Color.YELLOW.withAlpha(0.3)}
                outline={true}
                outlineColor={Cesium.Color.YELLOW}
              />
            </Entity>
            <Entity
              position={Cesium.Cartesian3.fromDegrees(
                selectedLocation.longitude,
                selectedLocation.latitude
              )}
            >
              <EllipseGraphics
                height={0}
                semiMajorAxis={selectedLocation.shortRadius}
                semiMinorAxis={selectedLocation.shortRadius}
                material={Cesium.Color.RED.withAlpha(0.5)}
                outline={true}
                outlineColor={Cesium.Color.RED}
              />
            </Entity>
          </>
        )}
      </Viewer>
    </>
  );
}
