
import cv2
import numpy as np
from sklearn.cluster import KMeans
from collections import Counter

def get_dominant_colors(image_path, k=5):
    try:
        # Load image
        image = cv2.imread(image_path)
        if image is None:
            print(f"Error: Could not read image at {image_path}")
            return []

        # Convert to RGB
        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        
        # Reshape to list of pixels
        pixels = image.reshape(-1, 3)
        
        # Use KMeans to find dominant colors
        kmeans = KMeans(n_clusters=k)
        kmeans.fit(pixels)
        
        # Count labels to find most common
        count = Counter(kmeans.labels_)
        
        # Get centers (colors)
        centers = kmeans.cluster_centers_
        
        # Sort by count
        sorted_colors = sorted(count.items(), key=lambda x: x[1], reverse=True)
        
        hex_colors = []
        for index, count in sorted_colors:
            color = centers[index]
            hex_color = '#{:02x}{:02x}{:02x}'.format(int(color[0]), int(color[1]), int(color[2]))
            hex_colors.append((hex_color, count))
            
        return hex_colors

    except Exception as e:
        print(f"Error: {e}")
        return []

image_path = "C:/Users/ADMIN/.gemini/antigravity/brain/5297ea57-022b-46fc-bc7b-38c03ee76caa/uploaded_media_1769525933676.png"
colors = get_dominant_colors(image_path)

print("Dominant colors:")
for color, count in colors:
    print(f"{color}: {count}")
