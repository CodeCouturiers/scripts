import os
from svgwrite import Drawing
import subprocess
import logging

logging.basicConfig(level=logging.DEBUG)


class ShutterstockTemplateGenerator:
    def __init__(self, output_dir="templates"):
        self.output_dir = os.path.abspath(output_dir)
        # Обновленные шаблоны в соответствии с требованиями Shutterstock
        self.templates = {
            "square_large": {
                "width": 5000,
                "height": 5000,
                "name": "square_large",
                "description": "Square Large (25MP)",
                "megapixels": 25
            },
            "landscape_4k": {
                "width": 4096,
                "height": 2731,
                "name": "landscape_4k",
                "description": "Landscape 4K (11.2MP)",
                "megapixels": 11.2
            },
            "portrait_standard": {
                "width": 2400,
                "height": 3600,
                "name": "portrait_standard",
                "description": "Portrait Standard (8.6MP)",
                "megapixels": 8.6
            },
            "wide_format": {
                "width": 5000,
                "height": 3000,
                "name": "wide_format",
                "description": "Wide Format (15MP)",
                "megapixels": 15
            },
            "minimal": {
                "width": 2000,
                "height": 2000,
                "name": "minimal",
                "description": "Minimal Size (4MP)",
                "megapixels": 4
            }
        }

    def validate_template(self, template):
        """Проверка соответствия требованиям Shutterstock"""
        megapixels = (template["width"] * template["height"]) / 1000000
        if megapixels < 4:
            raise ValueError(f"Template size too small: {megapixels}MP (minimum 4MP required)")
        if megapixels > 25:
            raise ValueError(f"Template size too large: {megapixels}MP (maximum 25MP allowed)")
        return True

    def create_directory(self):
        if not os.path.exists(self.output_dir):
            os.makedirs(self.output_dir)
            logging.info(f"Created directory: {self.output_dir}")

    def generate_template(self, template_type):
        if template_type not in self.templates:
            raise ValueError(f"Unknown template type: {template_type}")

        template = self.templates[template_type]
        self.validate_template(template)

        width = template["width"]
        height = template["height"]
        megapixels = (width * height) / 1000000

        # Create SVG
        svg_filename = f"{template['name']}_template.svg"
        svg_path = os.path.join(self.output_dir, svg_filename)

        dwg = Drawing(
            filename=svg_path,
            size=(f"{width}px", f"{height}px"),
            profile='full'
        )

        # Add artboard (white background)
        dwg.add(dwg.rect(
            insert=(0, 0),
            size=(width, height),
            fill='white'
        ))

        # Add safe area (90% of dimensions)
        safe_margin = min(width, height) * 0.05
        dwg.add(dwg.rect(
            insert=(safe_margin, safe_margin),
            size=(width - 2 * safe_margin, height - 2 * safe_margin),
            stroke='#0000FF',
            stroke_width=1,
            fill='none',
            stroke_dasharray='5,5'
        ))

        # Add template info
        dwg.add(dwg.text(
            f"Shutterstock Template: {template['description']}",
            insert=(20, 30),
            fill='black',
            font_size=20
        ))
        dwg.add(dwg.text(
            f"Size: {width}x{height}px ({megapixels:.1f}MP)",
            insert=(20, 60),
            fill='black',
            font_size=20
        ))
        dwg.add(dwg.text(
            f"Compatible with AI 8/10",
            insert=(20, 90),
            fill='black',
            font_size=20
        ))

        # Add center lines
        dwg.add(dwg.line(
            start=(width / 2, 0),
            end=(width / 2, height),
            stroke='#CC0000',
            stroke_width=1,
            stroke_dasharray='5,5'
        ))
        dwg.add(dwg.line(
            start=(0, height / 2),
            end=(width, height / 2),
            stroke='#CC0000',
            stroke_width=1,
            stroke_dasharray='5,5'
        ))

        # Rule of Thirds
        for i in range(1, 3):
            dwg.add(dwg.line(
                start=(width * i / 3, 0),
                end=(width * i / 3, height),
                stroke='#0000CC',
                stroke_width=1,
                stroke_dasharray='5,5'
            ))
            dwg.add(dwg.line(
                start=(0, height * i / 3),
                end=(width, height * i / 3),
                stroke='#0000CC',
                stroke_width=1,
                stroke_dasharray='5,5'
            ))

        try:
            dwg.save()
            logging.info(f"SVG file saved: {svg_path}")
            return svg_path
        except Exception as e:
            logging.error(f"Error saving SVG file: {e}")
            return None

    def convert_to_eps(self, svg_path):
        """Convert SVG to EPS using Inkscape with Shutterstock compatibility"""
        if not os.path.exists(svg_path):
            logging.error(f"SVG file not found: {svg_path}")
            return None

        eps_path = svg_path.replace('.svg', '.eps')
        abs_svg_path = os.path.abspath(svg_path)
        abs_eps_path = os.path.abspath(eps_path)

        try:
            inkscape_path = r"C:\Program Files\Inkscape\bin\inkscape.exe"

            if not os.path.exists(inkscape_path):
                raise Exception("Inkscape not found")

            command = [
                inkscape_path,
                abs_svg_path,
                f"--export-filename={abs_eps_path}",
                "--export-type=eps",
                "--export-ps-level=2",  # AI 8/10 совместимость
                "--export-text-to-path",
                "--export-ignore-filters"
            ]

            result = subprocess.run(command, capture_output=True, text=True)

            if result.stdout:
                logging.debug(f"Stdout: {result.stdout}")
            if result.stderr:
                logging.debug(f"Stderr: {result.stderr}")

            if os.path.exists(eps_path):
                # Проверяем размер файла
                file_size = os.path.getsize(eps_path) / (1024 * 1024)  # в МБ
                if file_size > 100:
                    logging.error(f"EPS file too large: {file_size}MB (max 100MB)")
                    return None

                logging.info(f"EPS file created successfully: {eps_path} ({file_size:.1f}MB)")
                return eps_path
            else:
                logging.error(f"EPS file not created: {eps_path}")
                return None

        except Exception as e:
            logging.error(f"Error converting to EPS: {e}")
            return None

    def generate_all_templates(self):
        self.create_directory()
        results = []

        for template_type in self.templates.keys():
            try:
                print(f"\nGenerating {template_type} template...")
                svg_path = self.generate_template(template_type)

                if not svg_path:
                    print(f"Failed to generate SVG for {template_type}")
                    continue

                print(f"SVG file created: {svg_path}")

                eps_path = self.convert_to_eps(svg_path)

                if eps_path:
                    results.append({
                        'type': template_type,
                        'path': eps_path,
                        'size': self.templates[template_type]
                    })
                    print(f"Successfully created {template_type} template")
                else:
                    print(f"Failed to convert {template_type} to EPS")

            except Exception as e:
                print(f"Error generating {template_type} template: {e}")

        return results


def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    output_dir = os.path.join(script_dir, "shutterstock_templates")

    generator = ShutterstockTemplateGenerator(output_dir=output_dir)

    print("\nShutterstock EPS Template Generator")
    print("==================================")
    print("Technical Requirements:")
    print("- Minimum size: 4 MP")
    print("- Maximum size: 25 MP")
    print("- Format: EPS compatible with AI 8/10")
    print("- Maximum file size: 100 MB")
    print("==================================\n")

    try:
        inkscape_path = r"C:\Program Files\Inkscape\bin\inkscape.exe"
        result = subprocess.run(
            [inkscape_path, "--version"],
            capture_output=True,
            text=True
        )
        print(f"Inkscape version: {result.stdout.strip()}")
    except Exception as e:
        print(f"Error getting Inkscape version: {e}")

    results = generator.generate_all_templates()

    print("\nGeneration Summary:")
    print("==================")
    for result in results:
        template = generator.templates[result['type']]
        print(f"\n{template['description']}:")
        print(f"- Dimensions: {template['width']}x{template['height']}px")
        print(f"- Megapixels: {template['megapixels']}MP")
        print(f"- Path: {result['path']}")


if __name__ == "__main__":
    main()
