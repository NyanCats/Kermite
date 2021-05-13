#ifndef __BOARD_IO_H__
#define __BOARD_IO_H__

#include "km0/types.h"

void boardIo_setupLeds(int8_t pin1, int8_t pin2, bool invert) __attribute__((weak));
void boardIo_setupLedsRgb(int8_t pin) __attribute__((weak));
void boardIo_writeLed1(bool value);
void boardIo_writeLed2(bool value);
void boardIo_toggleLed1();
void boardIo_toggleLed2();

void boardIo_setupLeds_proMicroAvr() __attribute__((weak));
void boardIo_setupLeds_proMicroRp() __attribute__((weak));
void boardIo_setupLeds_rpiPico() __attribute__((weak));

#endif