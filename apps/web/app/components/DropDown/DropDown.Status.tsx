'use client';

import { useEffect, useState } from 'react';
import { DropDown as DropDownUI } from '@social/ui-shared';
import { DropDown } from '../../components';
import { useClientContext } from '../../../contexts/client';

interface Status {
  subtitle?: string;
}

export default function Status({ subtitle }: Status) {
  const { status, updateStatus } = useClientContext();
  const [openDropdown, setOpenDropdown] = useState(false);

  const labels = {
    available: 'Available',
    away: 'Away',
    vacationing: 'Vacationing',
    working: 'Working',
    traveling: 'Traveling',
    celebrating: 'Celebrating',
    sick: 'Sick',
    noStatus: 'No Status',
    loading: 'loading',
  };

  const emojis = {
    available: '👋',
    away: '🕓',
    vacationing: '🌴',
    working: '👨‍💻',
    traveling: '✈️',
    celebrating: '🥂',
    sick: '🤒',
    noStatus: '💭',
    loading: '⏳',
  };

  const [dropdownValue, setDropdownValue] = useState({
    value: 'noStatus',
    textOption: labels.loading,
    iconText: emojis.loading,
  });

  useEffect(() => {
    setDropdownValue({
      value: status ? status : 'noStatus',
      textOption: status ? labels[status] : labels.noStatus,
      iconText: status ? emojis[status] : emojis.noStatus,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <DropDown
      open={openDropdown}
      setOpen={setOpenDropdown}
      value={dropdownValue}
      labelIcon="Sort"
      type={'text'}
      subtitle={subtitle}
    >
      <DropDownUI.Content
        title="Status"
        subtitle="Set your current status"
        isOpen={openDropdown}
        className="right-0 bottom-0"
      >
        <DropDownUI.Item
          label="Available"
          value="available"
          selected={dropdownValue.value === 'available'}
          icon={'😃'}
          onClick={() => {
            setDropdownValue({
              value: 'available',
              textOption: 'Available',
              iconText: '😃',
            });
            updateStatus('available');
            setOpenDropdown(false);
          }}
        />
        <DropDownUI.Item
          label="Away"
          value="away"
          selected={dropdownValue.value === 'away'}
          icon={'🕓'}
          onClick={() => {
            setDropdownValue({
              value: 'away',
              textOption: 'Away',
              iconText: '🕓',
            });
            updateStatus('away');
            setOpenDropdown(false);
          }}
        />
        <DropDownUI.Item
          label="Vacationing"
          value="vacationing"
          selected={dropdownValue.value === 'vacationing'}
          icon={'🌴'}
          onClick={() => {
            setDropdownValue({
              value: 'vacationing',
              textOption: 'Vacationing',
              iconText: '🌴',
            });
            updateStatus('vacationing');
            setOpenDropdown(false);
          }}
        />
        <DropDownUI.Item
          label="Working"
          value="working"
          selected={dropdownValue.value === 'working'}
          icon={'👨‍💻'}
          onClick={() => {
            setDropdownValue({
              value: 'working',
              textOption: 'Working',
              iconText: '👨‍💻',
            });
            updateStatus('working');
            setOpenDropdown(false);
          }}
        />
        <DropDownUI.Item
          label="Traveling"
          value="traveling"
          selected={dropdownValue.value === 'traveling'}
          icon={'✈️'}
          onClick={() => {
            setDropdownValue({
              value: 'traveling',
              textOption: 'Traveling',
              iconText: '✈️',
            });
            updateStatus('traveling');
            setOpenDropdown(false);
          }}
        />
        <DropDownUI.Item
          label="Celebrating"
          value="celebrating"
          selected={dropdownValue.value === 'celebrating'}
          icon={'🥂'}
          onClick={() => {
            setDropdownValue({
              value: 'celebrating',
              textOption: 'Celebrating',
              iconText: '🥂',
            });
            updateStatus('celebrating');
            setOpenDropdown(false);
          }}
        />
        <DropDownUI.Item
          label="Sick"
          value="sick"
          selected={dropdownValue.value === 'sick'}
          icon={'🤒'}
          onClick={() => {
            setDropdownValue({
              value: 'sick',
              textOption: 'Sick',
              iconText: '🤒',
            });
            updateStatus('sick');
            setOpenDropdown(false);
          }}
        />
        <DropDownUI.Item
          label="No Status"
          value="noStatus"
          selected={dropdownValue.value === 'noStatus'}
          icon={'💭'}
          onClick={() => {
            setDropdownValue({
              value: 'noStatus',
              textOption: 'No Status',
              iconText: '💭',
            });
            updateStatus('noStatus');
            setOpenDropdown(false);
          }}
        />
      </DropDownUI.Content>
    </DropDown>
  );
}
