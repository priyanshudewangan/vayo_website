import os
from PIL import Image

def remove_background(image_path, output_path, tolerance=25):
    if not os.path.exists(image_path):
        print(f"Error: {image_path} does not exist.")
        return

    # Open image and convert to RGBA
    img = Image.open(image_path).convert("RGBA")
    width, height = img.size
    pixels = img.load()

    # Get sample background color from top-left pixel
    bg_color = pixels[0, 0][:3]
    print(f"Sampled background color at (0,0): {bg_color}")

    # Create a mask for background pixels (initially all False)
    bg_mask = [[False for _ in range(height)] for _ in range(width)]

    # Flood fill starting from top-left and top-right corners
    start_points = [(0, 0), (width - 1, 0)]
    queue = list(start_points)
    
    # Mark start points as visited
    for x, y in start_points:
        bg_mask[x][y] = True

    # Color distance check function
    def is_bg(color):
        return (
            abs(color[0] - bg_color[0]) <= tolerance and
            abs(color[1] - bg_color[1]) <= tolerance and
            abs(color[2] - bg_color[2]) <= tolerance
        )

    # Standard BFS flood fill
    dx = [0, 0, 1, -1]
    dy = [1, -1, 0, 0]
    
    steps = 0
    while queue:
        x, y = queue.pop(0)
        steps += 1
        
        # Check neighbors
        for i in range(4):
            nx, ny = x + dx[i], y + dy[i]
            if 0 <= nx < width and 0 <= ny < height:
                if not bg_mask[nx][ny]:
                    color = pixels[nx, ny][:3]
                    if is_bg(color):
                        bg_mask[nx][ny] = True
                        queue.append((nx, ny))

    print(f"Flood fill completed in {steps} steps.")

    # Apply transparency to all marked background pixels
    for x in range(width):
        for y in range(height):
            if bg_mask[x][y]:
                # Set pixel to fully transparent
                pixels[x, y] = (0, 0, 0, 0)
            else:
                # Keep original pixel, but let's smooth any rough edges by blending alpha slightly at the border
                # If a non-background pixel is adjacent to a background pixel, we can feather it a bit if wanted,
                # but standard transparency will work great if tolerance is set well.
                pass

    # Save to the output path
    img.save(output_path, "PNG")
    print(f"Saved transparent image to: {output_path}")

if __name__ == "__main__":
    src = "public/vayo_hero_girl.png"
    dest = "public/vayo_hero_girl_transparent.png"
    # We will try a tolerance of 28 to capture the slight shadows in the background
    remove_background(src, dest, tolerance=28)
