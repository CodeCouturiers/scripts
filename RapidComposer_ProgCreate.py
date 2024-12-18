from openai import OpenAI
import os
from datetime import datetime

# API key
OPENAI_API_KEY = ""

# Initialize the client
client = OpenAI(api_key=OPENAI_API_KEY)
MODEL_NAME = "gpt-4o-mini-2024-07-18"

# Define output directory
OUTPUT_DIR = "dorian_progressions"


def save_progression_to_file(progression):
    # Create output directory if it doesn't exist
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)

    current_time = datetime.now()
    date_str = current_time.strftime("%Y-%m-%d")
    datetime_str = current_time.strftime("%Y-%m-%d %H:%M:%S")

    # Format chords with quotes
    chords_formatted = '","'.join(progression.split(" - "))
    chords_formatted = f'"{chords_formatted}"'

    content = f"""#Chord Progression Database
#format: name=<name>; chords=<list of chords with short names>;
name="{progression}"; chords={chords_formatted}; creationdate={date_str}; creationdatetime={datetime_str};"""

    # Exact filename format as in examples
    file_name = os.path.join(OUTPUT_DIR, f"{progression}.rcCHPR")
    with open(file_name, "w", encoding="utf-8") as file:
        file.write(content)
    return file_name


def main():
    system_prompt = """YOU ARE THE WORLD'S LEADING COMPOSER AND MUSICIAN, INTERNATIONALLY RECOGNIZED AS A MASTER IN MUSICAL THEORY, COMPOSITION, AND ARRANGEMENT. 

Your task is to create Dorian mode chord progressions. Each progression should:
- Use chord symbols like Am7, Bm, Cm7, D, Dmaj7, E7, Fm, Gm7 (do NOT use roman numerals)
- Consist of 4-5 chords
- Follow Dorian mode harmony principles
- End with the tonic minor chord (e.g., Am or Am7)
- Be musically coherent and practical
- Return ONLY the progression in format like "Am7 - Bm7 - Gmaj7 - Am7" without any additional text

Generate one progression per response."""

    user_prompt = "Create a new Dorian mode chord progression."

    total_prompt_tokens = 0
    total_completion_tokens = 0
    total_tokens = 0

    try:
        print(f"Saving progressions to directory: {OUTPUT_DIR}")

        for i in range(50):
            response = client.chat.completions.create(
                model=MODEL_NAME,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ]
            )

            progression = response.choices[0].message.content.strip()
            if "\n" in progression:
                progression = progression.split("\n")[0]

            file_name = save_progression_to_file(progression)

            prompt_tokens = response.usage.prompt_tokens
            completion_tokens = response.usage.completion_tokens
            total_tokens_this_req = response.usage.total_tokens

            total_prompt_tokens += prompt_tokens
            total_completion_tokens += completion_tokens
            total_tokens += total_tokens_this_req

            print(f"Saved: {file_name}")
            print(f"Tokens: {prompt_tokens} prompt, {completion_tokens} completion, {total_tokens_this_req} total")
            print("----------------------------------------")

        print(f"\nTotal tokens: {total_tokens}")
        print(f"Average tokens per request: {total_tokens / 50:.2f}")

    except Exception as e:
        print(f"An error occurred: {e}")


if __name__ == "__main__":
    main()
