import struct
from enum import IntEnum
from dataclasses import dataclass
import math
from pathlib import Path


class ProQ3Shape(IntEnum):
    Bell = 0
    LowShelf = 1
    LowCut = 2
    HighShelf = 3
    HighCut = 4
    Notch = 5
    BandPass = 6
    TiltShelf = 7
    FlatTilt = 8


class ProQ3Slope(IntEnum):
    Slope6dB_oct = 0
    Slope12dB_oct = 1
    Slope18dB_oct = 2
    Slope24dB_oct = 3
    Slope30dB_oct = 4
    Slope36dB_oct = 5
    Slope48dB_oct = 6
    Slope72dB_oct = 7
    Slope96dB_oct = 8
    SlopeBrickwall = 9


class ProQ3StereoPlacement(IntEnum):
    Left = 0
    Right = 1
    Stereo = 2
    Mid = 3
    Side = 4


@dataclass
class ProQ3Band:
    enabled: bool = False
    frequency: float = 1000.0  # 10.0 -> 30000.0 Hz
    gain: float = 0.0  # dB
    dynamic_range: float = 0.0  # dB
    dynamic_threshold: float = 1.0  # 1 = auto, or value in dB
    q: float = 1.0  # 0.025 -> 40.00
    shape: ProQ3Shape = ProQ3Shape.Bell
    slope: ProQ3Slope = ProQ3Slope.Slope24dB_oct
    stereo_placement: ProQ3StereoPlacement = ProQ3StereoPlacement.Stereo

    def __str__(self):
        status = "On" if self.enabled else "Off"
        return f"[{status:3}] {self.shape.name}: {self.frequency:.2f} Hz, {self.gain:.2f} dB, Q: {self.q:.2f}, {self.slope.name}, {self.stereo_placement.name}"


class FabfilterProQ3Reader:
    def __init__(self):
        self.version = 4
        self.parameter_count = 334
        self.bands = []
        self.unknown_parameters = []

    @staticmethod
    def freq_convert_back(value: float) -> float:
        """Convert frequency value from FabFilter format to Hz"""
        return math.pow(2, value)

    @staticmethod
    def q_convert_back(value: float) -> float:
        """Convert Q value from FabFilter format to actual Q"""
        return math.pow(10, (value - 0.5) / 0.312098175)

    def read_ffp(self, filepath: str) -> bool:
        path = Path(filepath)
        if not path.exists():
            raise FileNotFoundError(f"File not found: {filepath}")

        with open(filepath, 'rb') as f:
            header = f.read(4).decode('ascii')
            if header != "FQ3p":
                return False

            self.version = struct.unpack('<I', f.read(4))[0]
            self.parameter_count = struct.unpack('<I', f.read(4))[0]

            # Read 24 bands
            self.bands = []
            for _ in range(24):
                band = ProQ3Band()

                # Read band parameters
                enabled = struct.unpack('<f', f.read(4))[0]
                band.enabled = enabled == 1

                _ = struct.unpack('<f', f.read(4))[0]  # unknown1

                freq = struct.unpack('<f', f.read(4))[0]
                band.frequency = self.freq_convert_back(freq)

                band.gain = struct.unpack('<f', f.read(4))[0]
                band.dynamic_range = struct.unpack('<f', f.read(4))[0]

                _ = struct.unpack('<f', f.read(4))[0]  # unknown3

                band.dynamic_threshold = struct.unpack('<f', f.read(4))[0]

                q = struct.unpack('<f', f.read(4))[0]
                band.q = self.q_convert_back(q)

                shape = struct.unpack('<f', f.read(4))[0]
                band.shape = ProQ3Shape(int(shape))

                slope = struct.unpack('<f', f.read(4))[0]
                band.slope = ProQ3Slope(int(slope))

                placement = struct.unpack('<f', f.read(4))[0]
                band.stereo_placement = ProQ3StereoPlacement(int(placement))

                # Skip unknown parameters
                _ = struct.unpack('<f', f.read(4))[0]  # unknown5
                _ = struct.unpack('<f', f.read(4))[0]  # unknown6

                self.bands.append(band)

            # Read remaining parameters
            remaining_count = self.parameter_count - 13 * len(self.bands)
            self.unknown_parameters = []
            for _ in range(remaining_count):
                value = struct.unpack('<f', f.read(4))[0]
                self.unknown_parameters.append(value)

            return True

    def __str__(self):
        output = []
        output.append("Bands:")
        for band in self.bands:
            if band.enabled:
                output.append(str(band))
        return "\n".join(output)


def main():
    import sys
    if len(sys.argv) != 2:
        print("Usage: python fabfilter_reader.py <preset.ffp>")
        return

    reader = FabfilterProQ3Reader()
    if reader.read_ffp(sys.argv[1]):
        print(reader)
    else:
        print("Failed to read FFP file")


if __name__ == "__main__":
    main()
