MODULE_SRCS += pio.c
MODULE_SRCS += debug_uart.c
MODULE_SRCS += KeyMatrixScanner2.c
MODULE_SRCS += usbiocore.c
MODULE_SRCS += configuratorServant.c
MODULE_SRCS += xf_eeprom.c
MODULE_SRCS += generalUtils.c
MODULE_SRCS += ConfigurationMemoryReader.c
MODULE_SRCS += keyboardCoreLogic2_Dual.c
MODULE_SRCS += singlewire3.c

CFLAGS += -DCORELOGIC_KEYSLOTS_NUM=80
CFLAGS += -DSINGLEWIRE_SIGNAL_PIN_PD2

PROJECT_SRCS += main.c
