'use client';

import React, { useState } from 'react';
import { Icon } from '../../Icon';
import { twMerge } from 'tailwind-merge';
import { Action as ActionUI } from './Action';

type ButtonColors = {
  [key: string]: string;
};

interface ActionButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  variant?:
    | 'advanced'
    | 'all'
    | 'article'
    | 'custom'
    | 'hub'
    | 'image'
    | 'link'
    | 'mode'
    | 'minus'
    | 'menu'
    | 'music'
    | 'plus'
    | 'podcast'
    | 'posts'
    | 'reach'
    | 'sort'
    | 'video';
  size?: 'small' | 'medium' | 'large';
  label?: string;
  counter?: number;
  icon?: React.ReactNode;
  disabled?: boolean;
  active?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const Action = ({
  variant = 'article',
  size = 'medium',
  label,
  counter = 0,
  icon,
  disabled = false,
  active = false,
  children,
  ...rest
}: ActionButtonProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const sizes = {
    small: {
      iconSize: '12px',
      sizeClasses: counter ? 'w-auto h-8 p-2' : 'w-8 h-8 p-2',
      labelClasses: counter ? 'px-3 mt-8' : 'w-8 mt-8',
      labelSize: 'text-[10px]',
      counterSize: 'text-[13px]'
    },
    medium: {
      iconSize: '20px',
      sizeClasses: counter ? 'w-auto h-12 p-3' : 'w-12 h-12 p-3',
      labelClasses: counter ? 'px-5 mt-12' : 'w-12 mt-12',
      labelSize: 'text-[13px]',
      counterSize: 'text-[15px]'
    },
    large: {
      iconSize: '32px',
      sizeClasses: counter ? 'w-auto h-16 p-6' : 'w-16 h-16 p-6',
      labelClasses: counter ? 'px-8 mt-16' : 'w-16 mt-16',
      labelSize: 'text-[15px]',
      counterSize: 'text-[17px]'
    }
  };

  const { iconSize, sizeClasses, labelClasses, labelSize, counterSize } = sizes[size];

  const color = disabled ? 'text-white/50' : 'text-white';
  const colorIcon = disabled ? 'grey' : undefined;
  const gap = counter && 'gap-1';

  const defaultBg = 'bg-white bg-opacity-10';
  const stateButtonDisabled = 'bg-opacity-10 cursor-auto';
  const defaultStateButton = disabled ? stateButtonDisabled : 'hover:bg-opacity-20';

  const buttonColors: ButtonColors = {
    all: 'white',
    posts: 'white',
    article: 'yellow-400',
    link: 'cyan-400',
    image: 'green-500',
    music: 'blue-600',
    video: 'red-600',
    podcast: 'amber-500',
    menu: 'white'
  };

  const buttonIcons: Record<string, { icon: React.ReactNode }> = {
    all: { icon: <Icon.Stack size={iconSize} color={colorIcon} /> },
    posts: { icon: <Icon.NoteBlank size={iconSize} color={colorIcon} /> },
    article: { icon: <Icon.Newspaper size={iconSize} color={colorIcon} /> },
    link: { icon: <Icon.LinkSimple size={iconSize} color={colorIcon} /> },
    image: { icon: <Icon.ImageSquare size={iconSize} color={colorIcon} /> },
    music: {
      icon: <Icon.MusicNotesSimple size={iconSize} color={colorIcon} />
    },
    video: { icon: <Icon.Play size={iconSize} color={colorIcon} /> },
    podcast: { icon: <Icon.Podcast size={iconSize} color={colorIcon} /> },
    mode: { icon: <Icon.DotsNine size={iconSize} color={colorIcon} /> },
    sort: { icon: <Icon.Clock size={iconSize} color={colorIcon} /> },
    reach: { icon: <Icon.UserPlus size={iconSize} color={colorIcon} /> },
    hub: { icon: <Icon.Stack size={iconSize} color={colorIcon} /> },
    advanced: {
      icon: <Icon.SlidersHorizontal size={iconSize} color={colorIcon} />
    },
    plus: { icon: <Icon.Plus size={iconSize} color={colorIcon} /> },
    minus: { icon: <Icon.Minus size={iconSize} color={colorIcon} /> },
    menu: { icon: icon as React.ReactElement },
    custom: { icon: icon as React.ReactElement }
  };

  const generateButtonProps = (
    variant: string,
    active: boolean,
    disabled: boolean
  ): { icon: React.ReactNode; background?: string; state?: string } => {
    const baseButton = buttonIcons[variant];
    const background = active ? `bg-${buttonColors[variant]} bg-opacity-[0.16]` : defaultBg;
    const state = disabled ? stateButtonDisabled : `hover:bg-${buttonColors[variant]} hover:bg-opacity-[0.16]`;
    return { ...baseButton, background, state };
  };

  const { icon: iconComponent, background, state } = generateButtonProps(variant, active, disabled);

  const cssClasses = `${sizeClasses} ${background || defaultBg} ${state || defaultStateButton} ${gap}`;

  return (
    <ActionUI.Root>
      <ActionUI.Button
        {...rest}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={twMerge(cssClasses, rest.className)}
      >
        {iconComponent}
        {counter > 0 && <ActionUI.Counter className={twMerge(counterSize, color)}>{counter}</ActionUI.Counter>}
        {children}
      </ActionUI.Button>
      {isHovered && label && (
        <ActionUI.LabelRoot className={labelClasses}>
          <ActionUI.Label
            className={twMerge('text-white text-opacity-100 font-normal tracking-normal', labelSize, color)}
          >
            {label}
          </ActionUI.Label>
        </ActionUI.LabelRoot>
      )}
    </ActionUI.Root>
  );
};
