#include "km0/common/bitOperations.h"
#include "km0/common/romData.h"
#include "km0/common/utils.h"
#include "km0/deviceIo/boardI2c.h"
#include "km0/deviceIo/boardIo.h"
#include "km0/deviceIo/system.h"
#include "km0/keyboard/keyboardMain.h"
#include "oledCore.h"
#include "oledDisplay.h"
#include <stdio.h>
#include <string.h>

//----------------------------------------------------------------------

static const uint32_t logoData[] ROM_DATA = {
  0x00000000, 0x00000000, 0x00000000, 0x00000000,
  0x07ffff80, 0x07ffff80, 0x07ffff80, 0x07ffff80,
  0x00070000, 0x000f8000, 0x001fc000, 0x003ff000,
  0x007ff800, 0x00fcfc00, 0x01f87e00, 0x03e03f80,
  0x07c00f80, 0x07800780, 0x07000380, 0x06000180,
  0x04000000, 0x00000000, 0x00000000, 0x07ffff80,
  0x07ffff80, 0x07ffff80, 0x07ffff80, 0x07878780,
  0x07878780, 0x07878780, 0x07878780, 0x07878780,
  0x07878780, 0x07878780, 0x07878780, 0x07878780,
  0x07878780, 0x07800780, 0x00000000, 0x00000000,
  0x00000000, 0x00000000, 0x07ffff80, 0x07ffff80,
  0x07ffff80, 0x07ffff80, 0x001e0780, 0x001e0780,
  0x001e0780, 0x001e0780, 0x007e0780, 0x00fe0780,
  0x01ff0f80, 0x07ff9f80, 0x07efff00, 0x078fff00,
  0x0707fe00, 0x0601f800, 0x00000000, 0x00000000,
  0x00000000, 0x07ffff80, 0x07ffff00, 0x07fffe00,
  0x07fff800, 0x0003f000, 0x0007e000, 0x000fc000,
  0x001f8000, 0x007f0000, 0x00fc0000, 0x00fc0000,
  0x007f0000, 0x001f8000, 0x000fc000, 0x0007e000,
  0x0003f000, 0x07fff800, 0x07fffe00, 0x07ffff00,
  0x07ffff80, 0x00000000, 0x00000000, 0x00000000,
  0x00000000, 0x00000000, 0x07ffff80, 0x07ffff80,
  0x07ffff80, 0x07ffff80, 0x00000000, 0x00000000,
  0x00000000, 0x00000780, 0x00000780, 0x00000780,
  0x00000780, 0x00000780, 0x00000780, 0x07ffff80,
  0x07ffff80, 0x07ffff80, 0x07ffff80, 0x00000780,
  0x00000780, 0x00000780, 0x00000780, 0x00000780,
  0x00000780, 0x00000000, 0x07ffff80, 0x07ffff80,
  0x07ffff80, 0x07ffff80, 0x07878780, 0x07878780,
  0x07878780, 0x07878780, 0x07878780, 0x07878780,
  0x07878780, 0x07878780, 0x07878780, 0x07878780,
  0x07800780, 0x00000000, 0x00000000, 0x00000000
};

static const uint8_t fontWidth = 5;
static const uint8_t fontLetterSpacing = 1;
static const uint8_t fontData[] ROM_DATA = {
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

//----------------------------------------------------------------------

static uint8_t getPressedKeyCode(const uint8_t *report) {
  for (int i = 2; i < 8; i++) {
    if (report[i] > 0) {
      return report[i];
    }
  }
  return 0;
}

static char strbuf[8];

#define pm(x) (x > 0 ? '+' : '-')

static void renderStatusView() {
  oledCore_graphics_clear();

  oledCore_graphics_drawText(0, 0, "Status");

  //hid key slots
  const uint8_t *b = exposedState.hidReportBuf;
  sprintf(strbuf, "%c%c%c%c%c%c", pm(b[2]), pm(b[3]), pm(b[4]), pm(b[5]), pm(b[6]), pm(b[7]));
  oledCore_graphics_drawText(0, 15, strbuf);

  //key index
  uint8_t ki = exposedState.pressedKeyIndex;

  if (ki != KEYINDEX_NONE) {
    //keycode
    uint8_t kc = getPressedKeyCode(exposedState.hidReportBuf);
    //modifiers
    uint8_t m = exposedState.hidReportBuf[0];

    sprintf(strbuf, "KI:%d", ki);
    oledCore_graphics_drawText(3, 0, strbuf);
    sprintf(strbuf, "KC:%d", kc);
    oledCore_graphics_drawText(3, 6, strbuf);
    sprintf(strbuf, "M:%x", m);
    oledCore_graphics_drawText(3, 13, strbuf);
  } else {
    sprintf(strbuf, "KI:");
    oledCore_graphics_drawText(3, 0, strbuf);
    sprintf(strbuf, "KC:");
    oledCore_graphics_drawText(3, 6, strbuf);
    sprintf(strbuf, "M:");
    oledCore_graphics_drawText(3, 13, strbuf);
  }

  //layers
  uint8_t lsf = exposedState.layerStateFlags;
  sprintf(strbuf, "L:%x", lsf);
  oledCore_graphics_drawText(3, 18, strbuf);

  oledCore_flushScreen();
}

static void renderKermiteLogo() {
  oledCore_graphics_clear();
  oledCore_graphics_drawFullImage(logoData);
  oledCore_flushScreen();
}

//----------------------------------------------------------------------

void oledDisplay_initialize() {
  oledCore_initialize();
  oledCore_graphics_setFontData(fontData, fontWidth, fontLetterSpacing);
  delayMs(10);
}

static void updateFrame() {
  static int cnt = 60;
  if (cnt > 0) {
    cnt--;
  }
  bool bootComplete = cnt == 0;
  bool isMaster = !exposedState.isSplitSlave;
  if (bootComplete && isMaster) {
    renderStatusView();
  } else {
    renderKermiteLogo();
  }
}

void oledDisplay_update() {
  static uint32_t tick = 0;
  if (++tick % 50 == 0) {
    updateFrame();
  }
}
