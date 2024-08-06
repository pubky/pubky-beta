'use client';

import { useEffect, useRef } from 'react';
import { MapContainer, Marker, TileLayer } from 'react-leaflet';
import { Modal } from '@social/ui-shared';
import { useMapEvents } from 'react-leaflet';
import { LatLng } from 'leaflet';

interface MapModalProps extends React.HTMLAttributes<HTMLDivElement> {
  marker: LatLng | undefined;
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

function ClickableMap({
  setShowModal,
}: {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  useMapEvents({
    click: (e) => {
      setShowModal(true);
    },
  });

  return null;
}

export default function MapViewMarker({
  marker,
  showModal,
  setShowModal,
}: MapModalProps) {
  const modalTagRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutsideModalTag = (event: MouseEvent) => {
      if (
        modalTagRef.current &&
        !modalTagRef.current.contains(event.target as Node)
      ) {
        setShowModal(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutsideModalTag);

    return () => {
      document.removeEventListener('mousedown', handleClickOutsideModalTag);
    };
  }, [marker, modalTagRef, setShowModal]);

  return (
    <Modal.Root
      modalRef={modalTagRef}
      show={showModal}
      closeModal={() => {
        setShowModal(false);
      }}
      className="w-full"
    >
      <Modal.CloseAction onClick={() => setShowModal(false)} />
      <div className="w-full items-stretch flex-col inline-flex gap-6 -mt-6">
        <Modal.Header title="Map Marker" />
        <Modal.Content className="flex flex-row w-[720px]">
          <div className="w-full flex-col inline-flex">
            <div className="flex flex-row w-full mt-4">
              <div className="w-full flex overflow-hidden rounded-[10px]">
                <MapContainer
                  center={marker}
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
                  <ClickableMap setShowModal={setShowModal} />
                </MapContainer>
              </div>
            </div>
          </div>
        </Modal.Content>
      </div>
    </Modal.Root>
  );
}
