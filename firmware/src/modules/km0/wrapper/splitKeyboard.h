#ifndef __SPLIT_KEYBOARD_H__

#include "km0/types.h"

void splitKeyboard_setBoardConfigCallback(void (*callback)(uint8_t side));
void splitKeyboard_start();

#endif