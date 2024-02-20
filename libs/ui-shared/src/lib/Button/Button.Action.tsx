'use client';

import React, { useState } from 'react';
import { Icon } from '../Icon';
import { Typography } from '../Typography';

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
  disable?: boolean;
  active?: boolean;
  styles?: string;
  href?: string;
  className?: string;
  target?: string;
}

export const Action = ({
  variant = 'article',
  size = 'medium',
  label,
  counter,
  icon,
  disable = false,
  active = false,
  styles = '',
  target = '_self',
  href,
  ...rest
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
      labelClasses = counter ? 'px-3 mt-8' : 'w-8 mt-8';
      fontSize = 'text-[10px]';
      break;
    case 'medium':
      iconSize = '20px';
      sizeClasses = counter ? 'w-16 h-12 p-3' : 'w-12 h-12 p-3';
      labelClasses = counter ? 'px-5 mt-12' : 'w-12 mt-12';
      fontSize = 'text-[13px]';
      break;
    case 'large':
      iconSize = '32px';
      sizeClasses = counter ? 'w-24 h-16 p-6' : 'w-16 h-16 p-6';
      labelClasses = counter ? 'px-8 mt-16' : 'w-16 mt-16';
      fontSize = 'text-[15px]';
  }

  const color = disable ? 'text-gray-500' : 'text-white';
  const colorIcon = disable ? 'grey' : undefined;
  const gap = counter ? 'gap-1.5' : '';

  let iconComponent = <Icon.Clipboard size={iconSize} color={colorIcon} />;
  let disabled = disable ? 'bg-opacity-10 cursor-auto' : 'hover:bg-opacity-20';
  let background = 'bg-white bg-opacity-10';

  switch (variant) {
    case 'all':
      iconComponent = <Icon.Stack size={iconSize} color={colorIcon} />;
      disabled = disable
        ? 'bg-opacity-10 cursor-auto'
        : 'hover:bg-fuchsia-500 hover:bg-opacity-30';
      background = active
        ? 'bg-fuchsia-500 bg-opacity-30 border-t border-fuchsia-500'
        : background;
      break;
    case 'posts':
      iconComponent = <Icon.NoteBlank size={iconSize} color={colorIcon} />;
      disabled = disable
        ? 'bg-opacity-10 cursor-auto'
        : 'hover:bg-fuchsia-500 hover:bg-opacity-30';
      background = active
        ? 'bg-fuchsia-500 bg-opacity-30 border-t border-fuchsia-500'
        : background;
      break;
    case 'article':
      iconComponent = <Icon.Newspaper size={iconSize} color={colorIcon} />;
      disabled = disable
        ? 'bg-opacity-10 cursor-auto'
        : 'hover:bg-yellow-400 hover:bg-opacity-30';
      background = active
        ? 'bg-yellow-400 bg-opacity-30 border-t border-yellow-400'
        : background;
      break;

    case 'link':
      iconComponent = <Icon.LinkSimple size={iconSize} color={colorIcon} />;
      disabled = disable
        ? 'bg-opacity-10 cursor-auto'
        : 'hover:bg-cyan-400 hover:bg-opacity-30';
      background = active
        ? 'bg-cyan-400 bg-opacity-30 border-t border-cyan-400'
        : background;
      break;

    case 'image':
      iconComponent = <Icon.ImageSquare size={iconSize} color={colorIcon} />;
      disabled = disable
        ? 'bg-opacity-10 cursor-auto'
        : 'hover:bg-green-500 hover:bg-opacity-30';
      background = active
        ? 'bg-green-500 bg-opacity-30 border-t border-green-500'
        : background;
      break;

    case 'music':
      iconComponent = (
        <Icon.MusicNotesSimple size={iconSize} color={colorIcon} />
      );
      disabled = disable
        ? 'bg-opacity-10 cursor-auto'
        : 'hover:bg-blue-600 hover:bg-opacity-30';
      background = active
        ? 'bg-blue-600 bg-opacity-30 border-t border-blue-600'
        : background;
      break;

    case 'video':
      iconComponent = <Icon.Play size={iconSize} color={colorIcon} />;
      disabled = disable
        ? 'bg-opacity-10 cursor-auto'
        : 'hover:bg-red-600 hover:bg-opacity-30';
      background = active
        ? 'bg-red-600 bg-opacity-30 border-t border-red-600'
        : background;
      break;

    case 'podcast':
      iconComponent = <Icon.Podcast size={iconSize} color={colorIcon} />;
      disabled = disable
        ? 'bg-opacity-10 cursor-auto'
        : 'hover:bg-amber-500 hover:bg-opacity-30';
      background = active
        ? 'bg-amber-500 bg-opacity-30 border-t border-amber-500'
        : background;
      break;

    case 'mode':
      iconComponent = <Icon.DotsNine size={iconSize} color={colorIcon} />;
      break;

    case 'sort':
      iconComponent = <Icon.Clock size={iconSize} color={colorIcon} />;
      break;

    case 'reach':
      iconComponent = <Icon.UserPlus size={iconSize} color={colorIcon} />;
      break;

    case 'hub':
      iconComponent = <Icon.Stack size={iconSize} color={colorIcon} />;
      break;

    case 'advanced':
      iconComponent = (
        <Icon.SlidersHorizontal size={iconSize} color={colorIcon} />
      );
      break;

    case 'plus':
      iconComponent = <Icon.Plus size={iconSize} color={colorIcon} />;
      break;

    case 'minus':
      iconComponent = <Icon.Minus size={iconSize} color={colorIcon} />;
      break;

    case 'custom':
      iconComponent = icon as React.ReactElement;
      break;
  }

  const cssClasses = `${sizeClasses} ${background} rounded-[48px] backdrop-blur-[20px] justify-center items-center inline-flex ${disabled}`;

  return (
    <div className="relative inline-flex">
      <div className="flex">
        <a href={href} target={target}>
          <button
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`${cssClasses} ${styles}`}
            {...rest}
          >
            <div className={`justify-center items-center inline-flex ${gap}`}>
              {iconComponent}
              <Typography.Caption
                fontSize={fontSize}
                styles="text-opacity-50"
                variant="bold"
              >
                {counter ? counter : ''}
              </Typography.Caption>
            </div>
          </button>
        </a>
        {isHovered && label && (
          <div
            className={`${labelClasses} flex absolute text-center justify-center items-center`}
          >
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
    </div>
  );
};
