from PIL import Image
import os
import colorsys

def get_dominant_color(image_path):
    """Get the dominant color of an image by averaging pixels"""
    img = Image.open(image_path)
    img = img.convert('RGB')
    img = img.resize((50, 50))  # Resize for faster processing
    
    pixels = list(img.getdata())
    r = sum([p[0] for p in pixels]) / len(pixels)
    g = sum([p[1] for p in pixels]) / len(pixels)
    b = sum([p[2] for p in pixels]) / len(pixels)
    
    return (int(r), int(g), int(b))

def rgb_to_hsv(rgb):
    """Convert RGB to HSV for sorting by hue"""
    r, g, b = [x / 255.0 for x in rgb]
    return colorsys.rgb_to_hsv(r, g, b)

# Directory containing images
img_dir = "statsfm/js"

# Get all PNG files
images = [f for f in os.listdir(img_dir) if f.endswith('.png')]

# Get dominant color for each image
image_colors = []
for img_name in images:
    img_path = os.path.join(img_dir, img_name)
    rgb = get_dominant_color(img_path)
    hsv = rgb_to_hsv(rgb)
    image_colors.append({
        'name': img_name,
        'rgb': rgb,
        'hsv': hsv
    })

# Sort by hue (hsv[0])
image_colors.sort(key=lambda x: (x['hsv'][0], x['hsv'][1], x['hsv'][2]))

# Print sorted results
for item in image_colors:
    rgb = item['rgb']
    print(f'{item["name"]} - RGB({rgb[0]}, {rgb[1]}, {rgb[2]})')
