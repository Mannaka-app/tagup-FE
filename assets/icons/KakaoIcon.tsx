import * as React from 'react';
import Svg, { Path, G, Defs, ClipPath, Rect } from 'react-native-svg';

interface KakaoIconProps {
  size?: number;
  color?: string;
}

export const KakaoIcon: React.FC<KakaoIconProps> = ({
  size = 24,
  color = 'black',
}) => (
  <Svg width={size} height={size} viewBox='0 0 16 16' fill='none'>
    <G clipPath='url(#clip0_81_28)'>
      <Path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M8.00005 0.533325C3.5815 0.533325 0 3.3004 0 6.71313C0 8.83557 1.38525 10.7066 3.4947 11.8195L2.60715 15.0618C2.52873 15.3483 2.85638 15.5766 3.10798 15.4106L6.99856 12.8428C7.32688 12.8745 7.66054 12.893 8.00005 12.893C12.4182 12.893 16 10.126 16 6.71313C16 3.3004 12.4182 0.533325 8.00005 0.533325Z'
        fill={color}
      />
    </G>
    <Defs>
      <ClipPath id='clip0_81_28'>
        <Rect width='16' height='16' fill='white' />
      </ClipPath>
    </Defs>
  </Svg>
);
