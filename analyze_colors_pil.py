
from PIL import Image
from collections import Counter

def get_dominant_colors(image_path, num_colors=5):
    try:
        image = Image.open(image_path)
        image = image.convert('RGB')
        # Resize for speed
        image = image.resize((100, 100))
        pixels = list(image.getdata())
        
        # Count colors
        counts = Counter(pixels)
        total_pixels = len(pixels)
        
        sorted_colors = sorted(counts.items(), key=lambda x: x[1], reverse=True)[:num_colors]
        
        hex_colors = []
        for color, count in sorted_colors:
            hex_color = '#{:02x}{:02x}{:02x}'.format(color[0], color[1], color[2])
            print(f"{hex_color}: {count} ({count/total_pixels*100:.2f}%)")
            
    except Exception as e:
        print(f"Error: {e}")

image_path = "C:/Users/ADMIN/.gemini/antigravity/brain/5297ea57-022b-46fc-bc7b-38c03ee76caa/uploaded_media_1769525933676.png"
get_dominant_colors(image_path)
