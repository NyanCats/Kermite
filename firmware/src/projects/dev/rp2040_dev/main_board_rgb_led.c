
#include <stdio.h>
#include <stdlib.h>

#include "hardware/clocks.h"

#include "hardware/pio.h"
#include "pico/stdlib.h"
#include "types.h"

//based on
//https://github.com/raspberrypi/pico-examples/blob/master/pio/ws2812/ws2812.c

#define ws2812_wrap_target 0
#define ws2812_wrap 3

#define ws2812_T1 2
#define ws2812_T2 5
#define ws2812_T3 3

static const uint16_t ws2812_program_instructions[] = {
  //     .wrap_target
  0x6221, //  0: out    x, 1            side 0 [2]
  0x1123, //  1: jmp    !x, 3           side 1 [1]
  0x1400, //  2: jmp    0               side 1 [4]
  0xa442, //  3: nop                    side 0 [4]
  //     .wrap
};
static const struct pio_program ws2812_program = {
  .instructions = ws2812_program_instructions,
  .length = 4,
  .origin = -1,
};

static inline pio_sm_config ws2812_program_get_default_config(uint offset) {
  pio_sm_config c = pio_get_default_sm_config();
  sm_config_set_wrap(&c, offset + ws2812_wrap_target, offset + ws2812_wrap);
  sm_config_set_sideset(&c, 1, false, false);
  return c;
}

#include "hardware/clocks.h"
static inline void ws2812_program_init(PIO pio, uint sm, uint offset, uint pin, float freq, bool rgbw) {
  pio_gpio_init(pio, pin);
  pio_sm_set_consecutive_pindirs(pio, sm, pin, 1, true);
  pio_sm_config c = ws2812_program_get_default_config(offset);
  sm_config_set_sideset_pins(&c, pin);
  sm_config_set_out_shift(&c, false, true, rgbw ? 32 : 24);
  sm_config_set_fifo_join(&c, PIO_FIFO_JOIN_TX);
  int cycles_per_bit = ws2812_T1 + ws2812_T2 + ws2812_T3;
  float div = clock_get_hz(clk_sys) / (freq * cycles_per_bit);
  sm_config_set_clkdiv(&c, div);
  pio_sm_init(pio, sm, offset, &c);
  pio_sm_set_enabled(pio, sm, true);
}

static inline void put_pixel(uint32_t pixel_grb) {
  pio_sm_put_blocking(pio0, 0, pixel_grb << 8u);
}

static inline uint32_t urgb_u32(uint8_t r, uint8_t g, uint8_t b) {
  return ((uint32_t)(r) << 8) |
         ((uint32_t)(g) << 16) |
         (uint32_t)(b);
}

const int PIN_TX = 25;

int main() {
  // stdio_init_all();

  // todo get free sm
  PIO pio = pio0;
  int sm = 0;
  uint offset = pio_add_program(pio, &ws2812_program);

  ws2812_program_init(pio, sm, offset, PIN_TX, 800000, true);

  while (1) {
    put_pixel(urgb_u32(0, 10, 0));
    sleep_ms(10);
    put_pixel(0);
    sleep_ms(1000);
  }
}