import os
import logging
from pydub import AudioSegment
from multiprocessing import Pool

logging.basicConfig(level=logging.DEBUG)


def convert_audio(input_wav, quality, category, fmt, bit_depth='16', sample_rate='44100'):
    logging.debug(f"Converting {input_wav} to {fmt} with {quality} quality, {bit_depth}bit, {sample_rate}Hz")

    # Handle different input formats
    if input_wav.lower().endswith('.wav'):
        audio = AudioSegment.from_wav(input_wav)
    elif input_wav.lower().endswith('.mp3'):
        audio = AudioSegment.from_mp3(input_wav)
    elif input_wav.lower().endswith('.ogg'):
        audio = AudioSegment.from_ogg(input_wav)
    elif input_wav.lower().endswith('.flac'):
        audio = AudioSegment.from_file(input_wav, 'flac')
    else:
        raise ValueError(f"Unsupported input format: {input_wav}")

    # Convert sample rate and bit depth
    audio = audio.set_frame_rate(int(sample_rate))
    audio = audio.set_sample_width(3 if bit_depth == '24' else 2)

    base_filename = os.path.splitext(os.path.basename(input_wav))[0]
    path = os.path.join(os.path.dirname(os.path.dirname(input_wav)), 'music', fmt, f"{bit_depth}bit_{sample_rate}")
    os.makedirs(path, exist_ok=True)
    output_file = os.path.join(path, f"{base_filename}.{fmt}")

    quality_settings = {
        'high': {
            'ogg': ['-acodec', 'libvorbis', '-b:a', '320k', '-q:a', '10'],
            'mp3': ['-b:a', '320k', '-codec', 'libmp3lame', '-q:a', '0'],
            'flac': ['-compression_level', '12']
        },
        'medium': {
            'ogg': ['-acodec', 'libvorbis', '-b:a', '256k', '-q:a', '7'],
            'mp3': ['-b:a', '256k', '-codec', 'libmp3lame', '-q:a', '2'],
            'flac': ['-compression_level', '8']
        },
        'low': {
            'ogg': ['-acodec', 'libvorbis', '-b:a', '128k', '-q:a', '4'],
            'mp3': ['-b:a', '128k', '-codec', 'libmp3lame', '-q:a', '4'],
            'flac': ['-compression_level', '5']
        }
    }

    export_params = ['-ar', str(sample_rate)]
    export_params.extend(quality_settings[quality][fmt])

    logging.debug(f"Exporting to {output_file}")
    audio.export(output_file, format=fmt, parameters=export_params)


def batch_convert_directory(directory, quality='high', bit_depth='16', sample_rate='44100'):
    pool = Pool()
    tasks = []

    logging.debug(f"Walking directory {directory}")
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.lower().endswith('.wav'):  # Only process WAV files
                file_path = os.path.join(root, file)
                for fmt in ['ogg', 'mp3', 'flac']:  # Convert to each format
                    tasks.append((file_path, quality, 'music', fmt, bit_depth, sample_rate))

    logging.debug(f"Starting {len(tasks)} conversion tasks")
    try:
        pool.starmap(convert_audio, tasks)
    except Exception as e:
        logging.error(f"Conversion error: {e}")
    finally:
        pool.close()
        pool.join()

if __name__ == '__main__':
    input_directory = r"C:\Users\user\Downloads\примерный кит"
    batch_convert_directory(input_directory, 'low', '24', '44100')
