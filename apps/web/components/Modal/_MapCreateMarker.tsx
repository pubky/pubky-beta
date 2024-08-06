'use client';

import { useEffect, useRef } from 'react';
import { MapContainer, Marker, TileLayer } from 'react-leaflet';
import { Button, Icon, Modal, Typography } from '@social/ui-shared';
import { useMapEvents } from 'react-leaflet';
import { LatLng } from 'leaflet';

interface MapModalProps extends React.HTMLAttributes<HTMLDivElement> {
  marker: LatLng | undefined;
  setMarker: React.Dispatch<React.SetStateAction<LatLng | undefined>>;
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  center: LatLng | undefined;
  setCenter: React.Dispatch<React.SetStateAction<LatLng | undefined>>;
}

function ClickableMap({
  setShowModal,
  setMarker,
  setCenter,
}: {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  setMarker:
    | React.Dispatch<React.SetStateAction<LatLng>>
    | ((value: LatLng) => void);
  setCenter: React.Dispatch<React.SetStateAction<LatLng | undefined>>;
}) {
  useMapEvents({
    click: (e) => {
      setMarker(e.latlng);
      setCenter(e.latlng);
      setShowModal(true);
    },
  });

  return null;
}

export default function MapModal({
  marker,
  setMarker,
  showModal,
  setShowModal,
  center = new LatLng(0, 0),
  setCenter,
}: MapModalProps) {
  const modalTagRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutsideModalTag = (event: MouseEvent) => {
      if (
        modalTagRef.current &&
        !modalTagRef.current.contains(event.target as Node)
      ) {
        setShowModal(false);
        setCenter(marker || center);
      }
    };
    document.addEventListener('mousedown', handleClickOutsideModalTag);

    return () => {
      document.removeEventListener('mousedown', handleClickOutsideModalTag);
    };
  }, [center, marker, modalTagRef, setCenter, setShowModal]);

  return (
    <Modal.Root
      modalRef={modalTagRef}
      show={showModal}
      closeModal={() => {
        setShowModal(false);
        setCenter(marker || center);
      }}
      className="w-full"
    >
      <Modal.CloseAction onClick={() => setShowModal(false)} />
      <div className="w-full items-stretch flex-col inline-flex gap-6 -mt-6">
        <Modal.Header title="Map Marker" />
        <Modal.Content className="flex flex-row w-[720px]">
          <div className="w-full flex-col inline-flex">
            <Typography.Body variant="small" className="text-white">
              Click on the map to set the location for your post:
            </Typography.Body>
            <div className="flex flex-row w-full mt-4">
              <div className="w-full flex overflow-hidden rounded-[10px]">
                <MapContainer
                  center={center}
                  zoom={3}
                  scrollWheelZoom={true}
                  className="h-[500px] flex w-full"
                  markerZoomAnimation={true}
                >
                  <TileLayer
                    className="display-none"
                    attribution=""
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {marker && <Marker position={marker} />}
                  <ClickableMap
                    setShowModal={setShowModal}
                    setMarker={setMarker}
                    setCenter={setCenter}
                  />
                </MapContainer>
              </div>
            </div>
          </div>
        </Modal.Content>
        <Button.Transparent
          icon={<Icon.Check />}
          onClick={() => {
            setMarker(undefined);
          }}
          className="mt-0"
        >
          Reset Marker
        </Button.Transparent>
        <Modal.SubmitAction
          icon={<Icon.Check />}
          onClick={() => {
            setShowModal(false);
          }}
          className="mt-0"
          disabled={!marker}
        >
          Set Location
        </Modal.SubmitAction>
      </div>
    </Modal.Root>
  );
}
