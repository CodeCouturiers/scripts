import struct
import math
from pathlib import Path
from typing import List, Optional


class ProQ3Preset:
    def __init__(self):
        self.version = 4
        self.bands = []
        self.unknown_parameters = [
                                      0.0, 1.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0,
                                      1.0, -1.0, 1.0, 2.0, 2.0, 3.0, 0.0, 1.0, 1.0, 2.0,
                                      0.0, 0.0
                                  ] + [0.0] * 24  # Adding 24 zeros as per original code

    @staticmethod
    def freq_convert(value: float) -> float:
        """Convert frequency from Hz to FabFilter format"""
        return math.log10(value) / math.log10(2)

    @staticmethod
    def q_convert(value: float) -> float:
        """Convert Q value to FabFilter format"""
        return math.log10(value) * 0.312098175 + 0.5

    def add_band(self, enabled: bool = True, freq: float = 1000.0,
                 gain: float = 0.0, q: float = 1.0,
                 shape: int = 0, slope: int = 3,
                 stereo: int = 2, dynamic_range: float = 0.0,
                 dynamic_threshold: float = 1.0) -> None:
        """Add a new band with specified parameters"""
        self.bands.append({
            'enabled': enabled,
            'freq': freq,
            'gain': gain,
            'q': q,
            'shape': shape,
            'slope': slope,
            'stereo': stereo,
            'dynamic_range': dynamic_range,
            'dynamic_threshold': dynamic_threshold
        })

    def write_ffp(self, filepath: str) -> bool:
        with open(filepath, 'wb') as f:
            # Write header
            f.write(b'FQ3p')
            f.write(struct.pack('<I', self.version))

            # Calculate and write parameter count
            param_count = 24 * 13 + len(self.unknown_parameters)
            f.write(struct.pack('<I', param_count))

            # Write 24 bands (filled with defaults if less bands defined)
            for i in range(24):
                if i < len(self.bands):
                    band = self.bands[i]
                    # Write band parameters
                    f.write(struct.pack('<f', 1.0 if band['enabled'] else 0.0))
                    f.write(struct.pack('<f', 1.0))  # unknown1
                    f.write(struct.pack('<f', self.freq_convert(band['freq'])))
                    f.write(struct.pack('<f', band['gain']))
                    f.write(struct.pack('<f', band['dynamic_range']))
                    f.write(struct.pack('<f', 1.0))  # unknown3
                    f.write(struct.pack('<f', band['dynamic_threshold']))
                    f.write(struct.pack('<f', self.q_convert(band['q'])))
                    f.write(struct.pack('<f', float(band['shape'])))
                    f.write(struct.pack('<f', float(band['slope'])))
                    f.write(struct.pack('<f', float(band['stereo'])))
                    f.write(struct.pack('<f', 1.0))  # unknown5
                    f.write(struct.pack('<f', 0.0))  # unknown6
                else:
                    # Write default disabled band
                    f.write(struct.pack('<f', 0.0))  # disabled
                    f.write(struct.pack('<f', 1.0))  # unknown1
                    f.write(struct.pack('<f', self.freq_convert(1000.0)))
                    f.write(struct.pack('<f', 0.0))  # gain
                    f.write(struct.pack('<f', 0.0))  # dynamic range
                    f.write(struct.pack('<f', 1.0))  # unknown3
                    f.write(struct.pack('<f', 1.0))  # dynamic threshold
                    f.write(struct.pack('<f', self.q_convert(1.0)))
                    f.write(struct.pack('<f', 0.0))  # shape (Bell)
                    f.write(struct.pack('<f', 3.0))  # slope (24dB/oct)
                    f.write(struct.pack('<f', 2.0))  # stereo placement
                    f.write(struct.pack('<f', 1.0))  # unknown5
                    f.write(struct.pack('<f', 0.0))  # unknown6

            # Write remaining parameters
            for param in self.unknown_parameters:
                f.write(struct.pack('<f', param))

        return True


def create_default_preset(filepath: str) -> None:
    """Create a default preset with one enabled band"""
    preset = ProQ3Preset()
    # Add one default band at 1kHz
    preset.add_band(
        enabled=True,
        freq=1000.0,
        gain=0.0,
        q=1.0,
        shape=0,  # Bell
        slope=3,  # 24dB/oct
        stereo=2  # Stereo
    )
    preset.write_ffp(filepath)


if __name__ == "__main__":
    create_default_preset("default_preset.ffp")
