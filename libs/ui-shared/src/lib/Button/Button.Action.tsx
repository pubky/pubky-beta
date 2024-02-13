'use client';

import React, { useState } from 'react';
import { Icon } from '../Icon';
import { Typography } from '../Typography';

type ActionButtonProps = {
  variant?:
    | 'posts'
    | 'article'
    | 'link'
    | 'image'
    | 'music'
    | 'video'
    | 'podcast'
    | 'mode'
    | 'sort'
    | 'reach'
    | 'hub'
    | 'advanced'
    | 'plus'
    | 'minus'
    | 'custom';
  size?: 'small' | 'medium' | 'large';
  label?: string;
  counter?: number;
  svg?: React.ReactNode;
  disable?: boolean;
  active?: boolean;
  styles?: string;
  className?: string;
};

export const Action = ({
  variant = 'article',
  size = 'medium',
  label,
  counter,
  svg,
  disable = false,
  active = false,
  styles = '',
  ...props
}: ActionButtonProps) => {
  const [isHovered, setIsHovered] = useState(false);
  let sizeClasses;
  let iconSize;
  let labelClasses;
  let fontSize;

  switch (size) {
    case 'small':
      iconSize = '12px';
      sizeClasses = counter ? 'w-11 h-8 p-2' : 'w-8 h-8 p-2';
      labelClasses = counter ? 'px-3 py-1' : 'px-1.5 py-1';
      fontSize = 'text-[10px]';
      break;
    case 'medium':
      iconSize = '20px';
      sizeClasses = counter ? 'w-16 h-12 p-3' : 'w-12 h-12 p-3';
      labelClasses = counter ? 'px-5 py-1' : 'px-3 py-1';
      fontSize = 'text-[13px]';
      break;
    case 'large':
      iconSize = '32px';
      sizeClasses = counter ? 'w-24 h-16 p-6' : 'w-16 h-16 p-6';
      labelClasses = counter ? 'px-9 py-2' : 'px-4 py-2';
      fontSize = 'text-[15px]';
  }

  const color = disable ? 'text-gray-500' : 'text-white';
  const colorIcon = disable ? 'grey' : undefined;
  const gap = counter ? 'gap-1.5' : '';

  let icon = <Icon.Clipboard size={iconSize} color={colorIcon} />;
  let disabled = disable ? 'bg-opacity-10 cursor-auto' : 'hover:bg-opacity-20';
  let background = 'bg-white bg-opacity-10';

  switch (variant) {
    case 'posts':
      icon = <Icon.NoteBlank size={iconSize} color={colorIcon} />;
      disabled = disable
        ? 'bg-opacity-10 cursor-auto'
        : 'hover:bg-fuchsia-500 hover:bg-opacity-30';
      background = active
        ? 'bg-fuchsia-500 bg-opacity-30 border-t border-fuchsia-500'
        : background;
      break;
    case 'article':
      icon = <Icon.Newspaper size={iconSize} color={colorIcon} />;
      disabled = disable
        ? 'bg-opacity-10 cursor-auto'
        : 'hover:bg-yellow-400 hover:bg-opacity-30';
      background = active
        ? 'bg-yellow-400 bg-opacity-30 border-t border-yellow-400'
        : background;
      break;

    case 'link':
      icon = <Icon.LinkSimple size={iconSize} color={colorIcon} />;
      disabled = disable
        ? 'bg-opacity-10 cursor-auto'
        : 'hover:bg-cyan-400 hover:bg-opacity-30';
      background = active
        ? 'bg-cyan-400 bg-opacity-30 border-t border-cyan-400'
        : background;
      break;

    case 'image':
      icon = <Icon.ImageSquare size={iconSize} color={colorIcon} />;
      disabled = disable
        ? 'bg-opacity-10 cursor-auto'
        : 'hover:bg-green-500 hover:bg-opacity-30';
      background = active
        ? 'bg-green-500 bg-opacity-30 border-t border-green-500'
        : background;
      break;

    case 'music':
      icon = <Icon.MusicNotesSimple size={iconSize} color={colorIcon} />;
      disabled = disable
        ? 'bg-opacity-10 cursor-auto'
        : 'hover:bg-blue-600 hover:bg-opacity-30';
      background = active
        ? 'bg-blue-600 bg-opacity-30 border-t border-blue-600'
        : background;
      break;

    case 'video':
      icon = <Icon.Play size={iconSize} color={colorIcon} />;
      disabled = disable
        ? 'bg-opacity-10 cursor-auto'
        : 'hover:bg-red-600 hover:bg-opacity-30';
      background = active
        ? 'bg-red-600 bg-opacity-30 border-t border-red-600'
        : background;
      break;

    case 'podcast':
      icon = <Icon.Podcast size={iconSize} color={colorIcon} />;
      disabled = disable
        ? 'bg-opacity-10 cursor-auto'
        : 'hover:bg-amber-500 hover:bg-opacity-30';
      background = active
        ? 'bg-amber-500 bg-opacity-30 border-t border-amber-500'
        : background;
      break;

    case 'mode':
      icon = <Icon.DotsNine size={iconSize} color={colorIcon} />;
      break;

    case 'sort':
      icon = <Icon.Clock size={iconSize} color={colorIcon} />;
      break;

    case 'reach':
      icon = <Icon.UserPlus size={iconSize} color={colorIcon} />;
      break;

    case 'hub':
      icon = <Icon.Stack size={iconSize} color={colorIcon} />;
      break;

    case 'advanced':
      icon = <Icon.SlidersHorizontal size={iconSize} color={colorIcon} />;
      break;

    case 'plus':
      icon = <Icon.Plus size={iconSize} color={colorIcon} />;
      break;

    case 'minus':
      icon = <Icon.Minus size={iconSize} color={colorIcon} />;
      break;

    case 'custom':
      icon = svg as React.ReactElement;
      break;
  }

  const cssClasses = `${sizeClasses} ${background} rounded-[48px] backdrop-blur-[20px] justify-center items-center inline-flex ${disabled}`;

  return (
    <div className="relative">
      <button
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`${cssClasses} ${styles}`}
        {...props}
      >
        <div className={`justify-center items-center inline-flex ${gap}`}>
          {icon}
          <Typography.Caption
            fontSize={fontSize}
            styles="text-opacity-50"
            variant="bold"
          >
            {counter ? counter : ''}
          </Typography.Caption>
        </div>
      </button>
      {isHovered && label && (
        <div className={`${labelClasses} justify-center items-center`}>
          <Typography.Caption
            fontSize={fontSize}
            styles="text-opacity-50"
            variant="bold"
            color={color}
          >
            {label}
          </Typography.Caption>
        </div>
      )}
    </div>
  );
};
