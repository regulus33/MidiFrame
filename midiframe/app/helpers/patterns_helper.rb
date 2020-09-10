module PatternsHelper
  CHANNEL_COLORS = [
    "#d88c98",
    "#d2d0a9",
    "#e3c7a7",
    "#99c1b9",
    "#8e7dbe",
    "#b53e54",
    "#e19238",
    "#cf9e66",
    "#5a9287",
    "#5b488f",
    "#d88c98",
    "#d2d0a9",
    "#e3c7a7",
    "#99c1b9",
    "#8e7dbe",
    "#b53e54",
  ]

  NUMBERS_TO_NAME = {
    1000000 => "million",
    1000 => "thousand",
    100 => "hundred",
    90 => "ninety",
    80 => "eighty",
    70 => "seventy",
    60 => "sixty",
    50 => "fifty",
    40 => "forty",
    30 => "thirty",
    20 => "twenty",
    19 => "nineteen",
    18 => "eighteen",
    17 => "seventeen",
    16 => "sixteen",
    15 => "fifteen",
    14 => "fourteen",
    13 => "thirteen",
    12 => "twelve",
    11 => "eleven",
    10 => "ten",
    9 => "nine",
    8 => "eight",
    7 => "seven",
    6 => "six",
    5 => "five",
    4 => "four",
    3 => "three",
    2 => "two",
    1 => "one",
  }

  def in_words(int)
    str = ""
    NUMBERS_TO_NAME.each do |num, name|
      if int == 0
        return str
      elsif int.to_s.length == 1 && int / num > 0
        return str + "#{name}"
      elsif int < 100 && int / num > 0
        return str + "#{name}" if int % num == 0
        return str + "#{name} " + in_words(int % num)
      elsif int / num > 0
        return str + in_words(int / num) + " #{name} " + in_words(int % num)
      end
    end
  end

  def channel_color(channel)
    CHANNEL_COLORS[channel - 1]
  end
end
