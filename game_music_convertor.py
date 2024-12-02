import os
import logging
from pydub import AudioSegment
from multiprocessing import Pool

logging.basicConfig(level=logging.DEBUG)


def convert_audio(input_wav, quality, category, fmt):
    logging.debug(f"Converting {input_wav} to {fmt} with {quality} quality")

    audio = AudioSegment.from_wav(input_wav)
    base_filename = os.path.splitext(os.path.basename(input_wav))[0]

    quality_settings = {
        'high': {'ogg': {'bitrate': '192k'}, 'mp3': {'bitrate': '320k'}, 'flac': {}},
        'medium': {'ogg': {'bitrate': '128k'}, 'mp3': {'bitrate': '192k'}, 'flac': {}},
        'low': {'ogg': {'bitrate': '96k'}, 'mp3': {'bitrate': '128k'}, 'flac': {}}
    }

    path = os.path.join(os.path.dirname(input_wav), category, fmt)
    os.makedirs(path, exist_ok=True)

    output_file = os.path.join(path, f"{base_filename}.{fmt}")
    logging.debug(f"Exporting to {output_file}")

    if fmt == 'mp3':
        audio.export(output_file, format=fmt, bitrate=quality_settings[quality][fmt]['bitrate'])
    elif fmt == 'ogg':
        audio.export(output_file, format=fmt, bitrate=quality_settings[quality][fmt]['bitrate'], codec='libvorbis')
    else:
        audio.export(output_file, format=fmt)


def batch_convert_directory(directory, quality='high'):
    pool = Pool()
    tasks = []

    logging.debug(f"Walking directory {directory}")
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.lower().endswith(('.wav', '.mp3', '.ogg', '.flac')):
                logging.debug(f"Adding {file} to task list")
                file_path = os.path.join(root, file)
                for category in ['music']:
                    for fmt in ['ogg', 'mp3', 'flac']:
                        tasks.append((file_path, quality, category, fmt))

    logging.debug(f"Starting {len(tasks)} conversion tasks")
    pool.starmap(convert_audio, tasks)
    pool.close()
    pool.join()


if __name__ == '__main__':
    input_directory = r"C:\Users\user\Downloads\kit"
    batch_convert_directory(input_directory, quality='high')
