import { BlackHex, WhiteHex } from "../_constants/colors.constants";

function isLightHex(hex: string): boolean {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);

  const brightness = Math.round((r * 299 + g * 587 + b * 114) / 1000);
  return brightness > 125;
}

function getTextColor(backgroundColorHex: string): string {
  return isLightHex(backgroundColorHex) ? BlackHex : WhiteHex;
}

export { getTextColor };
