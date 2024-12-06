from fabfilter_creator import ProQ3Preset


def create_premium_eq_preset(filepath: str):
    preset = ProQ3Preset()

    # Low cut to remove rumble
    preset.add_band(
        freq=20.0,
        gain=0.0,
        q=0.7,
        shape=2,  # LowCut
        slope=3  # 24dB/oct
    )

    # Low shelf for warmth
    preset.add_band(
        freq=100.0,
        gain=1.5,
        q=0.7,
        shape=1  # LowShelf
    )

    # Cut muddy frequencies
    preset.add_band(
        freq=250.0,
        gain=-2.0,
        q=1.2,
        shape=0  # Bell
    )

    # Low-mid clarity
    preset.add_band(
        freq=400.0,
        gain=1.0,
        q=1.4,
        shape=0  # Bell
    )

    # Mid presence
    preset.add_band(
        freq=1800.0,
        gain=1.5,
        q=1.0,
        shape=0  # Bell
    )

    # Air and brilliance
    preset.add_band(
        freq=12000.0,
        gain=2.0,
        q=0.7,
        shape=3  # HighShelf
    )

    # Safety high cut
    preset.add_band(
        freq=19000.0,
        gain=0.0,
        q=0.7,
        shape=4,  # HighCut
        slope=3  # 24dB/oct
    )

    preset.write_ffp(filepath)


if __name__ == "__main__":
    create_premium_eq_preset("premium_preset.ffp")
