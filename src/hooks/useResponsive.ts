import { useWindowDimensions } from 'react-native';

export const useResponsive = () => {
  const { width, height } = useWindowDimensions();
  
  // Consider 768px as the tablet breakpoint
  const isTablet = width >= 768;
  const isLandscape = width > height;

  return {
    width,
    height,
    isTablet,
    isLandscape,
    // Columns for grids
    numColumns: isTablet ? (isLandscape ? 3 : 2) : 1,
    // Provide split view capability for tablets
    showSplitView: isTablet && isLandscape,
  };
};
