#include "keyCodeTranslator.h"
#include "keyCodes.h"

enum HidKey {
  KU_RESERVED = 0,
  KU_A = 4,
  KU_B,
  KU_C,
  KU_D,
  KU_E,
  KU_F,
  KU_G,
  KU_H,
  KU_I,
  KU_J,
  KU_K,
  KU_L,
  KU_M,
  KU_N,
  KU_O,
  KU_P,
  KU_Q,
  KU_R,
  KU_S,
  KU_T,
  KU_U,
  KU_V,
  KU_W,
  KU_X,
  KU_Y,
  KU_Z,

  KU_Num1 = 30,
  KU_Num2,
  KU_Num3,
  KU_Num4,
  KU_Num5,
  KU_Num6,
  KU_Num7,
  KU_Num8,
  KU_Num9,
  KU_Num0,

  KU_Enter = 40,
  KU_Escape,
  KU_BackSpace,
  KU_Tab,
  KU_Space,

  KU_CapsLock = 57,

  KU_F1 = 58,
  KU_F2,
  KU_F3,
  KU_F4,
  KU_F5,
  KU_F6,
  KU_F7,
  KU_F8,
  KU_F9,
  KU_F10,
  KU_F11,
  KU_F12,

  KU_PrintScreen = 70,
  KU_ScrollLock = 71,
  KU_Pause = 72,
  KU_Insert = 73,
  KU_Home = 74,
  KU_PageUp = 75,
  KU_Delete = 76,
  KU_End = 77,
  KU_PageDown = 78,
  KU_RightArrow = 79,
  KU_LeftArrow,
  KU_DownArrow,
  KU_UpArrow,
  KU_NumLock = 83,

  KU_KeyPad_Slash = 84,
  KU_KeyPad_Asterisk,
  KU_KeyPad_Minus,
  KU_KeyPad_Plus,
  KU_KeyPad_Enter,
  KU_KeyPad_1,
  KU_KeyPad_2,
  KU_KeyPad_3,
  KU_KeyPad_4,
  KU_KeyPad_5,
  KU_KeyPad_6,
  KU_KeyPad_7,
  KU_KeyPad_8,
  KU_KeyPad_9,
  KU_KeyPad_0,
  KU_KeyPad_Dot,
  KU_KeyPad_Equal = 103,

  KU_F13 = 104,
  KU_F14,
  KU_F15,
  KU_F16,
  KU_F17,
  KU_F18,
  KU_F19,
  KU_F20,
  KU_F21,
  KU_F22,
  KU_F23,
  KU_F24,

  KU_Menu = 118,

  KU_KeyPad_00 = 176,
  KU_KeyPad_BackSpace = 187,

  KU_LCtrl = 224,
  KU_LShift,
  KU_LAlt,
  KU_LGui,
  KU_RCtrl,
  KU_RShift,
  KU_RAlt,
  KU_RGui,

  KU_Ctrl = 224,
  KU_Shift,
  KU_Alt,
  KU_Gui,
};

enum HidKeyUS {
  KU_US_Num1_Exclamation = 30,
  KU_US_Num2_Atmark,
  KU_US_Num3_Sharp,
  KU_US_Num4_Dollars,
  KU_US_Num5_Percent,
  KU_US_Num6_Circumflex,
  KU_US_Num7_Ampersand,
  KU_US_Num8_Asterisk,
  KU_US_Num9_LeftParenthesis,
  KU_US_Num0_RightParenthesis,

  KU_US_Minus_Undersocre = 45,
  KU_US_Equal_Plus = 46,
  KU_US_LeftSquareBracket_LeftCurlyBrace = 47,
  KU_US_RightSquareBracket_RightCurlyBrace = 48,
  KU_US_Backslash_Verticalbar = 49,
  KU_US_Sharp_Tilde = 50,
  KU_US_Semicolon_Colon = 51,
  KU_US_SingleQuote_DoubleQuote = 52,
  KU_US_BackQuote_Tilde = 53,
  KU_US_Comma_LessThan = 54,
  KU_US_Dot_GreaterThan = 55,
  KU_US_Slash_Question = 56,
};

enum HidKeyJA {
  KU_JA_Num1_Exclamation = 30,
  KU_JA_Num2_DoubleQuote,
  KU_JA_Num3_Sharp,
  KU_JA_Num4_Dollars,
  KU_JA_Num5_Percent,
  KU_JA_Num6_Ampersand,
  KU_JA_Num7_SingleQuote,
  KU_JA_Num8_LeftParenthesis,
  KU_JA_Num9_RightParenethesis,
  KU_JA_Num0,

  KU_JA_Minus_Equal = 45,
  KU_JA_Circumflex_Tilde,
  KU_JA_Atmark_BackQuote,

  KU_JA_LeftSquareBracket_LeftCurlyBrace = 48,
  KU_JA_RightSquareBracket_RightCurlyBrace = 49,
  KU_JA_Semicolon_Plus = 51,
  KU_JA_Colon_Asterisk = 52,

  KU_HankakuZenkaku = 53,

  KU_JA_Comma_LessThan = 54,
  KU_JA_Dot_GreaterThan = 55,
  KU_JA_Slash_Question = 56,

  KU_JA_BackSlash_Underscore = 135,
  KU_KatakanaHiragana = 136,
  KU_JA_Yen_VertiacalBar = 137,
  KU_Henkan = 138,
  KU_Muhenkan = 139,
  KU_Lang1Kana = 144,
  KU_Lang2Eisu = 145,
};

#define Shifted 0x100
#define NoShift 0x200

typedef struct {
  uint8_t logicalKey; //logical key code
  char *text;
  uint16_t hidKeyPrimary;   //hid keycode with shift (us mapping)
  uint16_t hidKeySecondary; //hid keycode with shift (jis mapping)
} LogicalKeyItem;

__flash static const LogicalKeyItem logicalKeyItems[] = {
  { LK_A, "A", KU_A },
  { LK_B, "B", KU_B },
  { LK_C, "C", KU_C },
  { LK_D, "D", KU_D },
  { LK_E, "E", KU_E },
  { LK_F, "F", KU_F },
  { LK_G, "G", KU_G },
  { LK_H, "H", KU_H },
  { LK_I, "I", KU_I },
  { LK_J, "J", KU_J },
  { LK_K, "K", KU_K },
  { LK_L, "L", KU_L },
  { LK_M, "M", KU_M },
  { LK_N, "N", KU_N },
  { LK_O, "O", KU_O },
  { LK_P, "P", KU_P },
  { LK_Q, "Q", KU_Q },
  { LK_R, "R", KU_R },
  { LK_S, "S", KU_S },
  { LK_T, "T", KU_T },
  { LK_U, "U", KU_U },
  { LK_V, "V", KU_V },
  { LK_W, "W", KU_W },
  { LK_X, "X", KU_X },
  { LK_Y, "Y", KU_Y },
  { LK_Z, "Z", KU_Z },
  { LK_Num_0, "0", KU_Num0 | NoShift },
  { LK_Num_1, "1", KU_Num1 | NoShift },
  { LK_Num_2, "2", KU_Num2 | NoShift },
  { LK_Num_3, "3", KU_Num3 | NoShift },
  { LK_Num_4, "4", KU_Num4 | NoShift },
  { LK_Num_5, "5", KU_Num5 | NoShift },
  { LK_Num_6, "6", KU_Num6 | NoShift },
  { LK_Num_7, "7", KU_Num7 | NoShift },
  { LK_Num_8, "8", KU_Num8 | NoShift },
  { LK_Num_9, "9", KU_Num9 | NoShift },
  { LK_Escape, "Esc", KU_Escape },
  { LK_Space, "Space", KU_Space },
  { LK_Enter, "Enter", KU_Enter },
  { LK_Tab, "Tab", KU_Tab },
  { LK_BackSpace, "BS", KU_BackSpace },
  { LK_F1, "F1", KU_F1 },
  { LK_F2, "F2", KU_F2 },
  { LK_F3, "F3", KU_F3 },
  { LK_F4, "F4", KU_F4 },
  { LK_F5, "F5", KU_F5 },
  { LK_F6, "F6", KU_F6 },
  { LK_F7, "F7", KU_F7 },
  { LK_F8, "F8", KU_F8 },
  { LK_F9, "F9", KU_F9 },
  { LK_F10, "F10", KU_F10 },
  { LK_F11, "F11", KU_F11 },
  { LK_F12, "F12", KU_F12 },
  { LK_Shift, "Shift", KU_Shift },
  { LK_Ctrl, "Ctrl", KU_Ctrl },
  { LK_Alt, "Alt", KU_Alt },
  { LK_Gui, "GUI", KU_Gui },
  { LK_LShift, "LShift", KU_LShift },
  { LK_LCtrl, "LCtrl", KU_LCtrl },
  { LK_LAlt, "LAlt", KU_LAlt },
  { LK_LGui, "LGUI", KU_LGui },
  { LK_RShift, "RShift", KU_RShift },
  { LK_RCtrl, "RCtrl", KU_RCtrl },
  { LK_RAlt, "RAlt", KU_RAlt },
  { LK_RGui, "RGUI", KU_RGui },
  { LK_Home, "Home", KU_Home },
  { LK_End, "End", KU_End },
  { LK_Insert, "Insert", KU_Insert },
  { LK_Delete, "Delete", KU_Delete },
  { LK_PageUp, "PageUp", KU_PageUp },
  { LK_PageDn, "PageDn", KU_PageDown },
  { LK_LeftArrow, "Left", KU_LeftArrow },
  { LK_RightArrow, "Right", KU_RightArrow },
  { LK_UpArrow, "Up", KU_UpArrow },
  { LK_DownArrow, "Down", KU_DownArrow },
  { LK_HankakuZenkaku, "Han/Zen", KU_HankakuZenkaku },
  { LK_KatakanaHiragana, "Kata/Hira", KU_KatakanaHiragana },
  { LK_Henkan, "Henkan", KU_Henkan },
  { LK_Muhenkan, "Muhen", KU_Muhenkan },
  { LK_Dot, ".", KU_US_Dot_GreaterThan | NoShift, KU_JA_Dot_GreaterThan | NoShift },
  { LK_Comma, ",", KU_US_Comma_LessThan | NoShift, KU_JA_Comma_LessThan | NoShift },
  { LK_Exclamation, "!", KU_US_Num1_Exclamation | Shifted, KU_JA_Num1_Exclamation | Shifted },
  { LK_Question, "?", KU_US_Slash_Question | Shifted, KU_JA_Slash_Question | Shifted },
  { LK_Colon, ":", KU_US_Semicolon_Colon | Shifted, KU_JA_Colon_Asterisk | NoShift },
  { LK_Semicolon, ";", KU_US_Semicolon_Colon | NoShift, KU_JA_Semicolon_Plus | NoShift },
  { LK_Underscore, "_", KU_US_Minus_Undersocre | Shifted, KU_JA_BackSlash_Underscore | Shifted },
  { LK_Plus, "+", KU_US_Equal_Plus | Shifted, KU_JA_Semicolon_Plus | Shifted },
  { LK_Minus, "-", KU_US_Minus_Undersocre | NoShift, KU_JA_Minus_Equal | NoShift },
  { LK_Asterisk, "*", KU_US_Num8_Asterisk | Shifted, KU_JA_Colon_Asterisk | Shifted },
  { LK_Slash, "/", KU_US_Slash_Question | NoShift, KU_JA_Slash_Question | NoShift },
  { LK_Equal, "=", KU_US_Equal_Plus | NoShift, KU_JA_Minus_Equal | Shifted },
  { LK_Ampersand, "&", KU_US_Num7_Ampersand | Shifted, KU_JA_Num6_Ampersand | Shifted },
  { LK_VerticalBar, "|", KU_US_Backslash_Verticalbar | Shifted, KU_JA_Yen_VertiacalBar | Shifted },
  { LK_Hat, "^", KU_US_Num6_Circumflex | Shifted, KU_JA_Circumflex_Tilde | NoShift },
  { LK_Tilde, "~", KU_US_BackQuote_Tilde | Shifted, KU_JA_Circumflex_Tilde | Shifted },
  { LK_AtMark, "@", KU_US_Num2_Atmark | Shifted, KU_JA_Atmark_BackQuote | NoShift },
  { LK_Sharp, "#", KU_US_Num3_Sharp | Shifted, KU_JA_Num3_Sharp | Shifted },
  { LK_Dollar, "$", KU_US_Num4_Dollars | Shifted, KU_JA_Num4_Dollars | Shifted },
  { LK_Yen, "¥", KU_US_Backslash_Verticalbar | NoShift, KU_JA_Yen_VertiacalBar | NoShift },
  { LK_Percent, "%", KU_US_Num5_Percent | Shifted, KU_JA_Num5_Percent | Shifted },
  { LK_BackSlash, "\\", KU_US_Backslash_Verticalbar | NoShift, KU_JA_BackSlash_Underscore | NoShift },
  { LK_SingleQuote, "'", KU_US_SingleQuote_DoubleQuote | NoShift, KU_JA_Num7_SingleQuote | Shifted },
  { LK_DoubleQuote, "\"", KU_US_SingleQuote_DoubleQuote | Shifted, KU_JA_Num2_DoubleQuote | Shifted },
  { LK_BackQuote, "`", KU_US_BackQuote_Tilde | NoShift, KU_JA_Atmark_BackQuote | Shifted },
  { LK_LeftParenthesis, "(", KU_US_Num9_LeftParenthesis | Shifted, KU_JA_Num8_LeftParenthesis | Shifted },
  { LK_RightParenthesis, ")", KU_US_Num0_RightParenthesis | Shifted, KU_JA_Num9_RightParenethesis | Shifted },
  { LK_LeftSquareBracket, "{", KU_US_LeftSquareBracket_LeftCurlyBrace | NoShift, KU_JA_LeftSquareBracket_LeftCurlyBrace | NoShift },
  { LK_RightSquareBracket, "}", KU_US_RightSquareBracket_RightCurlyBrace | NoShift, KU_JA_RightSquareBracket_RightCurlyBrace | NoShift },
  { LK_LeftCurlyBrace, "{", KU_US_LeftSquareBracket_LeftCurlyBrace | Shifted, KU_JA_LeftSquareBracket_LeftCurlyBrace | Shifted },
  { LK_RightCurlyBrace, "}", KU_US_RightSquareBracket_RightCurlyBrace | Shifted, KU_JA_RightSquareBracket_RightCurlyBrace | Shifted },
  { LK_LessThan, "<", KU_US_Comma_LessThan | Shifted, KU_JA_Comma_LessThan | Shifted },
  { LK_GreaterThan, ">", KU_US_Dot_GreaterThan | Shifted, KU_JA_Dot_GreaterThan | Shifted },
  { LK_Lang1Kana, "Kana", KU_Lang1Kana },
  { LK_Lang2Eisu, "Eisu", KU_Lang2Eisu }
};

#define SizeLogicalKeyItem sizeof(LogicalKeyItem)
#define NumLogicalKeyItems sizeof(logicalKeyItems) / sizeof(LogicalKeyItem)

__flash static const LogicalKeyItem *getLogicalKeyItem(uint8_t logicalKey) {
  for (int i = 0; i < NumLogicalKeyItems; i++) {
    if (logicalKeyItems[i].logicalKey == logicalKey) {
      return &logicalKeyItems[i];
    }
  }
  return 0;
}

uint16_t keyCodeTranslator_mapLogicalKeyToHidKeyCode(uint8_t logicalKey, bool isSecondaryLayout) {
  __flash const LogicalKeyItem *item = getLogicalKeyItem(logicalKey);
  if (item) {
    if (isSecondaryLayout && item->hidKeySecondary != 0) {
      return item->hidKeySecondary;
    }
    return item->hidKeyPrimary;
  }
  return 0;
}

char *keyCodeTranslator_mapLogicalKeyToKeyText(uint8_t logicalKey) {
  __flash const LogicalKeyItem *item = getLogicalKeyItem(logicalKey);
  if (item) {
    return item->text;
  }
  return 0;
}
