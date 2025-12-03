import { useTheme } from '../src/store/themeContext';
import Colors from '../constants/Colors';

export function useThemeColor(
  props,
  colorName
) {
  const { theme } = useTheme();
  const colorFromProps = props?.[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}
