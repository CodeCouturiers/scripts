#pip install sf2utils
from sf2utils.sf2parse import Sf2File


def list_soundfont_instruments(sf2_path):
    try:
        # Open the soundfont file
        with open(sf2_path, 'rb') as sf2_file:
            sf2 = Sf2File(sf2_file)

            # Print header information
            print(f"\nSoundFont: {sf2.info.bank_name}")
            print("-" * 50)

            # List all instruments
            print("\nInstruments:")
            for i, instrument in enumerate(sf2.instruments):
                # Skip the EOI (End Of Instruments) marker
                if instrument.name != "EOI":
                    print(f"{i:3d}: {instrument.name}")

            print(f"\nTotal instruments: {len(sf2.instruments) - 1}")  # -1 to exclude EOI

    except FileNotFoundError:
        print(f"Error: Could not find file '{sf2_path}'")
    except Exception as e:
        print(f"Error reading SoundFont file: {str(e)}")


if __name__ == "__main__":
    # Replace with your actual path to the GeneralUser GS-RC.sf2 file
    soundfont_path = r"C:\Users\Public\Documents\RapidComposerV5\Soundfonts\GeneralUser GS-RC.sf2"
    list_soundfont_instruments(soundfont_path)
