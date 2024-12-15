import os
from collections import Counter
import re
import chardet

# Important configuration settings
INCLUDED_EXTENSIONS = ['.js', '.json', '.lua']  # File extensions to include
EXCLUDED_DIRS = ['node_modules', '.vscode', '.github']  # Directories to exclude
EXCLUDED_FILE_PATTERN = re.compile(r'\.pyi$|\.pyc$|\.pyo$', re.IGNORECASE)  # Files to exclude by pattern
MERGE_DIRECTORIES = [r'C:\Users\user\Desktop\u-he-preset-randomizer-main']  # Directories to merge files from
OUTPUT_FILE = r'C:\Users\user\Desktop\u-he-preset-randomizer-main\code.txt'  # Output file path
DELIMITER = '--- END OF FILE ---'  # Delimiter between merged files


def get_file_extensions(directories):
    """
    Analyze the file extensions in the given directories and return a sorted list of extension counts.
    """
    extensions = []

    # Walk through the directories recursively
    for directory in directories:
        for root, dirs, files in os.walk(directory):
            for file in files:
                # Extract the file extension and make it lowercase
                ext = os.path.splitext(file)[1].lower()
                if ext:  # Add the extension if it exists
                    extensions.append(ext)

    # Count each extension's occurrence
    extension_count = Counter(extensions)

    # Sort extensions by frequency
    sorted_extension_count = sorted(extension_count.items(), key=lambda x: x[1], reverse=True)

    return sorted_extension_count


def detect_encoding(file_path):
    """
    Detect the encoding of a file using the chardet library.
    Reads a portion of the file to determine the most likely encoding.
    """
    try:
        with open(file_path, 'rb') as f:
            raw_data = f.read(10000)  # Read a portion of the file (first 10,000 bytes)
        result = chardet.detect(raw_data)
        return result['encoding']
    except Exception as e:
        print(f"Error detecting encoding for {file_path}: {e}")
        return 'utf-8'  # Fallback to utf-8 if detection fails


def clean_lines(content):
    """
    Clean content by removing specific comment lines and Byte Order Mark (BOM).
    This function removes unnecessary comments and BOM from the content to prepare it for merging.
    """
    # Remove BOM (Byte Order Mark, U+FEFF)
    content = content.replace('\ufeff', '')

    # Regex patterns for lines to remove
    patterns = [
    ]

    # Apply the patterns to remove the unwanted lines
    for pattern in patterns:
        content = pattern.sub('', content)

    return content


def merge_files(directories, output_file, extensions=INCLUDED_EXTENSIONS, delimiter=DELIMITER):
    """
    Merges all files with specific extensions from specified directories into a single output file.
    Skips certain directories like 'node_modules', '.vscode', and '.github', and merges files with the given extensions.
    """
    try:
        with open(output_file, 'w', encoding='utf-8') as outfile:
            # Loop through each directory and process files
            for directory in directories:
                for root, dirs, files in os.walk(directory):
                    # Exclude specified directories
                    dirs[:] = [d for d in dirs if d not in EXCLUDED_DIRS]

                    for filename in files:
                        # Include files with specified extensions and not matching the exclusion pattern
                        if any(filename.lower().endswith(ext) for ext in
                               extensions) and not EXCLUDED_FILE_PATTERN.search(filename):
                            file_path = os.path.join(root, filename)
                            outfile.write(f"--- Start of {file_path} ---\n")

                            try:
                                encoding = detect_encoding(file_path)
                                with open(file_path, 'r', encoding=encoding, errors='replace') as infile:
                                    content = infile.read()
                                    cleaned_content = clean_lines(content)
                                    outfile.write(cleaned_content)
                            except Exception as e:
                                print(f"Error reading file {file_path}: {e}. Skipping.")

                            outfile.write(f"\n{delimiter}\n")
    except Exception as e:
        print(f"Error opening output file {output_file}: {e}")


# Main flow

# Step 1: Analyze file extensions before merging (from directories in MERGE_DIRECTORIES)
sorted_extensions = get_file_extensions(MERGE_DIRECTORIES)

print("Список расширений файлов, отсортированный по количеству:")
for ext, count in sorted_extensions:
    print(f"{ext}: {count}")

# Step 2: Merge files from the directories based on extensions
merge_files(MERGE_DIRECTORIES, OUTPUT_FILE)
