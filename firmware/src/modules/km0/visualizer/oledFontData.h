#pragma once

#include "km0/types.h"

#if !defined(KM0_OLED_DISPLAY__DEFAULT_FONT_SQUARE) && !defined(KM0_OLED_DISPLAY__DEFAULT_FONT_ROUND)
#define KM0_OLED_DISPLAY__DEFAULT_FONT_SQUARE
#endif

#ifdef KM0_OLED_DISPLAY__DEFAULT_FONT_SQUARE
//square font
const uint8_t oledFontWidth = 5;
const uint8_t oledFontLetterSpacing = 1;
__flash const uint8_t oledFontData[] = {
  0x00, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x5e, 0x00, 0x00,
  0x00, 0x06, 0x00, 0x06, 0x00,
  0x24, 0x7e, 0x24, 0x7e, 0x24,
  0x00, 0x2e, 0x7a, 0x2f, 0x3a,
  0x00, 0x66, 0x16, 0x68, 0x66,
  0x00, 0x36, 0x49, 0x49, 0x36,
  0x00, 0x06, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x3e, 0x41, 0x00,
  0x00, 0x00, 0x41, 0x3e, 0x00,
  0x08, 0x2a, 0x1c, 0x2a, 0x08,
  0x08, 0x08, 0x3e, 0x08, 0x08,
  0x00, 0x40, 0x20, 0x00, 0x00,
  0x00, 0x08, 0x08, 0x08, 0x08,
  0x00, 0x00, 0x20, 0x00, 0x00,
  0x00, 0x30, 0x0c, 0x03, 0x00,
  0x00, 0x7f, 0x41, 0x41, 0x7f,
  0x00, 0x00, 0x41, 0x7f, 0x40,
  0x00, 0x79, 0x49, 0x49, 0x4f,
  0x00, 0x49, 0x49, 0x49, 0x7f,
  0x00, 0x0f, 0x08, 0x08, 0x7f,
  0x00, 0x4f, 0x49, 0x49, 0x79,
  0x00, 0x7f, 0x49, 0x49, 0x79,
  0x00, 0x01, 0x71, 0x09, 0x07,
  0x00, 0x7f, 0x49, 0x49, 0x7f,
  0x00, 0x4f, 0x49, 0x49, 0x7f,
  0x00, 0x00, 0x24, 0x00, 0x00,
  0x00, 0x00, 0x40, 0x24, 0x00,
  0x00, 0x08, 0x14, 0x22, 0x00,
  0x00, 0x14, 0x14, 0x14, 0x14,
  0x00, 0x00, 0x22, 0x14, 0x08,
  0x00, 0x02, 0x01, 0x59, 0x06,
  0x00, 0x7f, 0x5d, 0x55, 0x7d,
  0x00, 0x7f, 0x11, 0x11, 0x7f,
  0x00, 0x7f, 0x49, 0x49, 0x7e,
  0x00, 0x7f, 0x41, 0x41, 0x41,
  0x00, 0x7f, 0x41, 0x41, 0x3e,
  0x00, 0x7f, 0x49, 0x49, 0x49,
  0x00, 0x7f, 0x09, 0x09, 0x09,
  0x00, 0x7f, 0x41, 0x49, 0x79,
  0x00, 0x7f, 0x08, 0x08, 0x7f,
  0x00, 0x41, 0x7f, 0x41, 0x00,
  0x00, 0x40, 0x40, 0x41, 0x3f,
  0x00, 0x7f, 0x08, 0x36, 0x41,
  0x00, 0x7f, 0x40, 0x40, 0x40,
  0x7f, 0x01, 0x7f, 0x01, 0x7f,
  0x7f, 0x03, 0x1c, 0x60, 0x7f,
  0x00, 0x7f, 0x41, 0x41, 0x7f,
  0x00, 0x7f, 0x09, 0x09, 0x0f,
  0x00, 0x7f, 0x41, 0x21, 0x5f,
  0x00, 0x7f, 0x19, 0x29, 0x4f,
  0x00, 0x4f, 0x49, 0x49, 0x79,
  0x01, 0x01, 0x7f, 0x01, 0x01,
  0x00, 0x7f, 0x40, 0x40, 0x7f,
  0x00, 0x7f, 0x40, 0x20, 0x1f,
  0x7f, 0x40, 0x7f, 0x40, 0x7f,
  0x00, 0x63, 0x1c, 0x1c, 0x63,
  0x03, 0x04, 0x78, 0x04, 0x03,
  0x00, 0x61, 0x51, 0x4d, 0x43,
  0x00, 0x00, 0x7f, 0x41, 0x00,
  0x00, 0x03, 0x0c, 0x30, 0x40,
  0x00, 0x00, 0x41, 0x7f, 0x00,
  0x00, 0x04, 0x02, 0x04, 0x00,
  0x00, 0x20, 0x20, 0x20, 0x20,
  0x00, 0x04, 0x02, 0x00, 0x00,
  0x00, 0x74, 0x54, 0x54, 0x7c,
  0x00, 0x7f, 0x44, 0x44, 0x7c,
  0x00, 0x7c, 0x44, 0x44, 0x44,
  0x00, 0x7c, 0x44, 0x44, 0x7f,
  0x00, 0x7c, 0x54, 0x54, 0x5c,
  0x00, 0x04, 0x7f, 0x05, 0x00,
  0x00, 0xbc, 0xa4, 0xa4, 0xfc,
  0x00, 0x7f, 0x04, 0x04, 0x7c,
  0x00, 0x00, 0x00, 0x7d, 0x00,
  0x00, 0x00, 0x80, 0xfd, 0x00,
  0x00, 0x7f, 0x10, 0x28, 0x44,
  0x00, 0x00, 0x7f, 0x40, 0x00,
  0x7c, 0x04, 0x7c, 0x04, 0x7c,
  0x00, 0x7c, 0x04, 0x04, 0x7c,
  0x00, 0x7c, 0x44, 0x44, 0x7c,
  0x00, 0xfc, 0x24, 0x24, 0x3c,
  0x00, 0x3c, 0x24, 0x24, 0xfc,
  0x00, 0x00, 0x7c, 0x04, 0x04,
  0x00, 0x5c, 0x54, 0x54, 0x74,
  0x00, 0x04, 0x7f, 0x44, 0x00,
  0x00, 0x7c, 0x40, 0x40, 0x7c,
  0x00, 0x7c, 0x40, 0x20, 0x1c,
  0x7c, 0x40, 0x7c, 0x40, 0x7c,
  0x00, 0x44, 0x38, 0x38, 0x44,
  0x00, 0x9c, 0xa0, 0x40, 0x3c,
  0x00, 0x44, 0x64, 0x54, 0x4c,
  0x00, 0x04, 0x02, 0x00, 0x00,
  0x00, 0x08, 0x7f, 0x41, 0x00,
  0x00, 0x00, 0x00, 0x7f, 0x00,
  0x00, 0x00, 0x41, 0x7f, 0x08
};
#endif

#ifdef KM0_OLED_DISPLAY__DEFAULT_FONT_ROUND
//round font
const uint8_t oledFontWidth = 5;
const uint8_t oledFontLetterSpacing = 1;
__flash const uint8_t oledFontData[] = {
  0x00, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x5e, 0x00, 0x00,
  0x00, 0x06, 0x00, 0x06, 0x00,
  0x24, 0x7e, 0x24, 0x7e, 0x24,
  0x00, 0x2e, 0x7a, 0x2f, 0x3a,
  0x00, 0x66, 0x16, 0x68, 0x66,
  0x00, 0x36, 0x49, 0x49, 0x36,
  0x00, 0x06, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x3e, 0x41, 0x00,
  0x00, 0x00, 0x41, 0x3e, 0x00,
  0x08, 0x2a, 0x1c, 0x2a, 0x08,
  0x08, 0x08, 0x3e, 0x08, 0x08,
  0x00, 0x40, 0x20, 0x00, 0x00,
  0x00, 0x08, 0x08, 0x08, 0x08,
  0x00, 0x00, 0x20, 0x00, 0x00,
  0x00, 0x30, 0x0c, 0x03, 0x00,
  0x00, 0x3e, 0x41, 0x41, 0x3e,
  0x00, 0x00, 0x41, 0x7f, 0x40,
  0x00, 0x62, 0x51, 0x49, 0x46,
  0x00, 0x22, 0x49, 0x49, 0x36,
  0x10, 0x18, 0x16, 0x7f, 0x10,
  0x00, 0x2f, 0x45, 0x45, 0x39,
  0x00, 0x3e, 0x49, 0x49, 0x32,
  0x00, 0x03, 0x61, 0x19, 0x07,
  0x00, 0x36, 0x49, 0x49, 0x36,
  0x00, 0x26, 0x49, 0x49, 0x3e,
  0x00, 0x00, 0x24, 0x00, 0x00,
  0x00, 0x00, 0x40, 0x24, 0x00,
  0x00, 0x08, 0x14, 0x22, 0x00,
  0x00, 0x14, 0x14, 0x14, 0x14,
  0x00, 0x00, 0x22, 0x14, 0x08,
  0x02, 0x01, 0x51, 0x09, 0x06,
  0x00, 0x7f, 0x5d, 0x55, 0x7d,
  0x00, 0x7e, 0x11, 0x11, 0x7e,
  0x00, 0x7f, 0x49, 0x49, 0x36,
  0x00, 0x3e, 0x41, 0x41, 0x22,
  0x00, 0x7f, 0x41, 0x41, 0x3e,
  0x00, 0x7f, 0x49, 0x49, 0x41,
  0x00, 0x7f, 0x09, 0x09, 0x01,
  0x00, 0x3e, 0x41, 0x49, 0x3a,
  0x00, 0x7f, 0x08, 0x08, 0x7f,
  0x00, 0x41, 0x7f, 0x41, 0x00,
  0x00, 0x30, 0x40, 0x41, 0x3f,
  0x00, 0x7f, 0x08, 0x36, 0x41,
  0x00, 0x7f, 0x40, 0x40, 0x40,
  0x7f, 0x06, 0x18, 0x06, 0x7f,
  0x7f, 0x03, 0x1c, 0x60, 0x7f,
  0x00, 0x3e, 0x41, 0x41, 0x3e,
  0x00, 0x7f, 0x09, 0x09, 0x06,
  0x00, 0x3e, 0x41, 0x21, 0x5e,
  0x00, 0x7f, 0x09, 0x19, 0x66,
  0x00, 0x26, 0x49, 0x49, 0x32,
  0x01, 0x01, 0x7f, 0x01, 0x01,
  0x00, 0x3f, 0x40, 0x40, 0x3f,
  0x03, 0x1c, 0x60, 0x1c, 0x03,
  0x3f, 0x40, 0x3e, 0x40, 0x3f,
  0x00, 0x63, 0x1c, 0x1c, 0x63,
  0x03, 0x04, 0x78, 0x04, 0x03,
  0x00, 0x61, 0x51, 0x4d, 0x43,
  0x00, 0x00, 0x7f, 0x41, 0x00,
  0x00, 0x03, 0x0c, 0x30, 0x40,
  0x00, 0x00, 0x41, 0x7f, 0x00,
  0x00, 0x04, 0x02, 0x04, 0x00,
  0x00, 0x20, 0x20, 0x20, 0x20,
  0x00, 0x04, 0x02, 0x00, 0x00,
  0x00, 0x20, 0x54, 0x54, 0x78,
  0x00, 0x7f, 0x44, 0x44, 0x38,
  0x00, 0x38, 0x44, 0x44, 0x44,
  0x00, 0x38, 0x44, 0x44, 0x7f,
  0x00, 0x38, 0x54, 0x54, 0x58,
  0x00, 0x04, 0x7f, 0x05, 0x00,
  0x00, 0x18, 0xa4, 0xa4, 0x78,
  0x00, 0x7f, 0x04, 0x04, 0x78,
  0x00, 0x00, 0x00, 0x7d, 0x00,
  0x00, 0x00, 0x80, 0x7d, 0x00,
  0x00, 0x7f, 0x10, 0x28, 0x44,
  0x00, 0x00, 0x7f, 0x00, 0x00,
  0x7c, 0x04, 0x7c, 0x04, 0x7c,
  0x00, 0x7c, 0x04, 0x04, 0x78,
  0x00, 0x38, 0x44, 0x44, 0x38,
  0x00, 0xfc, 0x24, 0x24, 0x18,
  0x00, 0x18, 0x24, 0x24, 0xfc,
  0x00, 0x00, 0x7c, 0x08, 0x04,
  0x00, 0x48, 0x54, 0x54, 0x24,
  0x00, 0x04, 0x3f, 0x44, 0x00,
  0x00, 0x7c, 0x40, 0x40, 0x3c,
  0x00, 0x7c, 0x40, 0x20, 0x1c,
  0x3c, 0x40, 0x3c, 0x40, 0x3c,
  0x00, 0x44, 0x38, 0x38, 0x44,
  0x00, 0x9c, 0xa0, 0x40, 0x3c,
  0x00, 0x44, 0x64, 0x54, 0x4c,
  0x00, 0x04, 0x02, 0x00, 0x00,
  0x00, 0x08, 0x7f, 0x41, 0x00,
  0x00, 0x00, 0x00, 0x7f, 0x00,
  0x00, 0x00, 0x41, 0x7f, 0x08
};
#endif
