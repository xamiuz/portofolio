from PIL import Image

def remove_white_bg(input_path, output_path, threshold=235):
    try:
        img = Image.open(input_path).convert("RGBA")
        datas = img.getdata()
        newData = []
        for item in datas:
            # If all RGB values are above threshold, it's considered white
            if item[0] >= threshold and item[1] >= threshold and item[2] >= threshold:
                newData.append((255, 255, 255, 0))
            else:
                newData.append(item)
        img.putdata(newData)
        img.save(output_path, "PNG")
        print(f"Processed {input_path}")
    except Exception as e:
        print(f"Error processing {input_path}: {e}")

remove_white_bg("c:/Project/portofolio/static/img/pandu_1.png", "c:/Project/portofolio/static/img/pandu_1.png")
remove_white_bg("c:/Project/portofolio/static/img/pandu_2.png", "c:/Project/portofolio/static/img/pandu_2.png")
