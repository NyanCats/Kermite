#include "hardware/i2c.h"
#include "km0/common/bitOperations.h"
#include "km0/common/utils.h"
#include "km0/deviceIo/boardIo.h"
#include "km0/deviceIo/dio.h"
#include "km0/deviceIo/system.h"
#include "pico/binary_info.h"
#include "pico/stdlib.h"
#include <stdlib.h>
#include <string.h>

//board RPi Pico
//GP25: onboard LED
//GP2 I2C1_SDA <--> OLED SDA
//GP3 I2C2_SCL ---> OLED SCL

//----------------------------------------------------------------------

static struct i2c_inst *i2c_instance = i2c1;
static const uint8_t pin_sda = 2;
static const uint8_t pin_scl = 3;

static uint8_t i2c_slave_address = 0;

void __i2c_initialize(uint32_t freqInHz, uint8_t slaveAddress) {
  i2c_init(i2c_instance, freqInHz);
  gpio_set_function(pin_sda, GPIO_FUNC_I2C);
  gpio_set_function(pin_scl, GPIO_FUNC_I2C);
  gpio_pull_up(pin_sda);
  gpio_pull_up(pin_scl);
  i2c_slave_address = slaveAddress;
}

void __i2c_write(uint8_t *buf, int len) {
  i2c_write_blocking(i2c_instance, i2c_slave_address, buf, len, false);
}

//----------------------------------------------------------------------

static uint8_t commandInitializationBytes[] = {
  0x00,       //Control Byte
  0xAE,       //Display Off
  0xA8, 0x1F, //MUX Ratio
  0xD3, 0x00, //Display Offset
  0x40,       //Display Start Line
  0xA1,       //Segment re-map
  // 0xA0, //Segment re-map
  0xC8, //COM Output Scan Direction
  // 0xC0, //COM Output Scan Direction
  0xDA, 0x02, //COM Pins hadware configuration
  // 0x81, 0x8F, //Contrast Control
  0x81, 0x3F, //Contrast Control
  0xA4,       //Disable Entire Display On
  0xA6,       //Normal Display
  0xD5, 0x80, //Osc Frequency
  0x8D, 0x14, //Enable charge pump regulator
  // 0xD9, 0xF1, //pre charge
  // 0xDB, 0x40, //vcom detect
  // 0x2E, //deactivate scroll
  // 0x20, 0x00,   //Memory Addressing Mode, Horizontal
  0x20, 0x01, //Memory Addressing Mode, Vertical
  0xAF        //Display On
};

static uint8_t commandResetPositionBytes[] = {
  0x00,             //Control Byte
  0x22, 0x00, 0x03, //Page Start Address
  0x21, 0x00, 0x7F, //Column Start Address
  // 0x22, 0x00, 0x00, //Page Start Address
  // 0x21, 0x00, 0x00, //Column Start Address
};

void __oled_initialize() {
  __i2c_initialize(400000, 0x3C);
  __i2c_write(commandInitializationBytes, sizeof(commandInitializationBytes));
  delayMs(10);
}

static uint8_t txbuf[513];

void __oled_flushScreenPixels(uint8_t *pPixelsBuf512) {
  __i2c_write(commandResetPositionBytes, sizeof(commandResetPositionBytes));
  txbuf[0] = 0x40;
  memcpy(txbuf + 1, pPixelsBuf512, 512);
  __i2c_write(txbuf, 513);
}

//----------------------------------------------------------------------

#define NumScanLine 128

static uint32_t scanLines[NumScanLine];

void __gr_clearScreen() {
  memset(scanLines, 0, NumScanLine * sizeof(uint32_t));
}

void __gr_putPixel(int x, int y) {
  bit_on(scanLines[x], y);
}

void __gr_drawLine(int x0, int y0, int x1, int y1) {
  int dx = x1 - x0;
  int dy = y1 - y0;
  int dd = utils_max(abs(dx), abs(dy));
  int ax = (dx << 8) / dd;
  int ay = (dy << 8) / dd;
  int px = x0 << 8;
  int py = y0 << 8;
  // __gr_putPixel(x0, y0);
  // __gr_putPixel(x1, y1);
  for (int i = 0; i < dd; i++) {
    __gr_putPixel(px >> 8, py >> 8);
    px += ax;
    py += ay;
  }
}

void __gr_drawFullImage(uint32_t *pLineBuffers128) {
  memcpy(scanLines, pLineBuffers128, 512);
}

void __gr_flush() {
  __oled_flushScreenPixels((uint8_t *)scanLines);
}

//----------------------------------------------------------------------

void initLcd() {
  __oled_initialize();
  __gr_clearScreen();
  __oled_flushScreenPixels((uint8_t *)scanLines);
}

void runMainLoop(void (*updateFunc)(void)) {
  uint32_t cnt = 0;
  while (true) {
    if (cnt % 50 == 0) {
      if (updateFunc) {
        updateFunc();
      }
    }
    if (cnt % 1000 == 0) {
      boardIo_toggleLed1();
    }
    cnt++;
    delayMs(1);
  }
}

//----------------------------------------------------------------------
//scene lineart
typedef struct {
  float x;
  float y;
  float vx;
  float vy;
} Ball;

#define NumBalls 4

Ball balls[NumBalls];

float getRandomValue() {
  return (float)rand() / RAND_MAX;
}

float getRandomValuePlusMinusOne() {
  return getRandomValue() * 2 - 1;
}

void ball_init(Ball *ball) {
  ball->x = 64;
  ball->y = 16;
  ball->vx = getRandomValuePlusMinusOne() * 3;
  ball->vy = getRandomValuePlusMinusOne() * 3;
}

void ball_move(Ball *ball) {
  ball->x += ball->vx;
  ball->y += ball->vy;
  if (!(0 < ball->x && ball->x < 128)) {
    ball->vx *= -1;
  }
  if (!(0 < ball->y && ball->y < 32)) {
    ball->vy *= -1;
  }
}

void scene1_init() {
  for (int i = 0; i < NumBalls; i++) {
    ball_init(&balls[i]);
  }
}

void scene1_update() {
  __gr_clearScreen();
  // __gr_drawLine(10, 10, 100, 20);

  for (int i = 0; i < NumBalls; i++) {
    ball_move(&balls[i]);
  }

  for (int i = 0; i < NumBalls; i++) {
    Ball *b0 = &balls[i];
    Ball *b1 = &balls[(i + 1) % NumBalls];
    __gr_drawLine(b0->x, b0->y, b1->x, b1->y);
  }

  __oled_flushScreenPixels((uint8_t *)scanLines);
}

void scene1_entry() {
  scene1_init();
  runMainLoop(scene1_update);
}

//----------------------------------------------------------------------

uint32_t logoData[] = {
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

void scene2_entry() {
  __gr_clearScreen();
  __gr_drawFullImage(logoData);
  __gr_flush();
  runMainLoop(NULL);
}

//----------------------------------------------------------------------

static const uint8_t fontWidth = 5;
static const uint8_t fontLetterSpacing = 1;
static const uint8_t fontData[] = {
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
  0x7f, 0x02, 0x1c, 0x20, 0x7f,
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
  0x00, 0x7e, 0x48, 0x48, 0x78,
  0x00, 0x78, 0x48, 0x48, 0x48,
  0x00, 0x78, 0x48, 0x48, 0x7e,
  0x00, 0x7c, 0x54, 0x54, 0x5c,
  0x00, 0x08, 0x7e, 0x0a, 0x00,
  0x00, 0xb8, 0xa8, 0xa8, 0xf8,
  0x00, 0x7e, 0x08, 0x08, 0x78,
  0x00, 0x00, 0x00, 0x7a, 0x00,
  0x00, 0x00, 0x80, 0xfa, 0x00,
  0x00, 0x7e, 0x10, 0x28, 0x44,
  0x00, 0x00, 0x7e, 0x40, 0x00,
  0x78, 0x08, 0x78, 0x08, 0x78,
  0x00, 0x78, 0x08, 0x08, 0x78,
  0x00, 0x78, 0x48, 0x48, 0x78,
  0x00, 0xf8, 0x48, 0x48, 0x78,
  0x00, 0x78, 0x48, 0x48, 0xf8,
  0x00, 0x00, 0x78, 0x08, 0x00,
  0x00, 0x5c, 0x54, 0x54, 0x74,
  0x00, 0x08, 0x7e, 0x48, 0x00,
  0x00, 0x78, 0x40, 0x40, 0x78,
  0x00, 0x78, 0x40, 0x20, 0x18,
  0x78, 0x40, 0x78, 0x40, 0x78,
  0x00, 0x48, 0x30, 0x30, 0x48,
  0x00, 0x18, 0xa0, 0x40, 0x38,
  0x00, 0x48, 0x68, 0x58, 0x48,
  0x00, 0x04, 0x02, 0x00, 0x00,
  0x00, 0x08, 0x7f, 0x41, 0x00,
  0x00, 0x00, 0x00, 0x7f, 0x00,
  0x00, 0x00, 0x41, 0x7f, 0x08
};

void drawChar(int caretY, int caretX, char chr) {
  int px = caretX * (fontWidth + fontLetterSpacing);
  int fontIndexBase = (chr - 32) * fontWidth;
  for (int i = 0; i < fontWidth; i++) {
    uint8_t *ptr = (uint8_t *)&scanLines[px + i];
    ptr[caretY] = fontData[fontIndexBase + i];
  }
}

void drawText(int caretY, int caretX, char *text) {
  char chr;
  while ((chr = *text++) != '\0') {
    drawChar(caretY, caretX++, chr);
  }
}

void scene3_entry() {
  __gr_clearScreen();
  drawText(0, 0, "Hello World");
  drawText(1, 0, "+-*/+:;`+@$!?");
  drawText(2, 0, "A quick brown fox jumping over");
  drawText(3, 0, "It's ok.");
  __gr_flush();
  runMainLoop(NULL);
}

//----------------------------------------------------------------------

void main() {
  boardIo_setupLeds(GP25, GP25, false);
  initLcd();
  // scene1_entry();
  // scene2_entry();
  scene3_entry();
}