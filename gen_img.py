import openai
import requests
from io import BytesIO
from PIL import Image
from flask import Flask, request, jsonify, send_file

# 设置 API 密钥
openai.api_key = "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"

app = Flask(__name__)

def convert_to_png(image_bytes):
    """
    将任何图像字节流转换为 PNG 格式，并返回字节流。
    """
    try:
        image = Image.open(BytesIO(image_bytes))
        png_image = BytesIO()
        image.convert("RGBA").save(png_image, format="PNG")
        png_image.seek(0)  # 重置读取位置
        return png_image
    except Exception as e:
        print(f"图像转换失败: {e}")
        return None

def generate_prompt(gender, occasion, birthday, style):
    """
    根据输入的参数生成动态的图像编辑提示
    """
    return f"请你根据这张单品照片，结合我的星座特点、每日运势和出席场合 生成一张符合一线大牌穿搭的3d形象照片: 性别 {gender} 出席场合 {occasion} 生日 {birthday} 风格 {style}"

def upload_and_edit_image(image_bytes, prompt, size="1024x1024"):
    """
    上传图像字节流并根据提示词进行编辑生成新图像
    """
    try:
        # 将图像字节流转换为 PNG 格式
        png_image = convert_to_png(image_bytes)
        if png_image is None:
            return None

        # 使用 PNG 图像进行编辑
        response = openai.Image.create_edit(
            image=png_image,
            prompt=prompt,
            n=1,
            size=size,
            response_format="url"
        )

        # 下载生成的图像
        image_url = response['data'][0]['url']
        image_response = requests.get(image_url)
        edited_image = Image.open(BytesIO(image_response.content))
        
        # 将编辑后的图像转为字节流
        img_byte_arr = BytesIO()
        edited_image.save(img_byte_arr, format="PNG")
        img_byte_arr.seek(0)

        return img_byte_arr

    except Exception as e:
        print(f"图像生成失败: {e}")
        return None

@app.route('/generate_image', methods=['POST'])
def generate_image():
    try:
        # 获取 POST 请求中的 JSON 数据
        data = request.get_json()

        # 获取所需参数
        gender = data.get('gender')
        occasion = data.get('occasion')
        birthday = data.get('birthday')
        style = data.get('style')
        image_bytes = data.get('image')  # 接收字节流数据

        # 确保所有参数都已提供
        if not all([gender, occasion, birthday, style, image_bytes]):
            return jsonify({"error": "缺少必需的参数"}), 400

        # 生成图像编辑提示
        prompt = generate_prompt(gender, occasion, birthday, style)

        # 生成编辑后的图像
        edited_image_bytes = upload_and_edit_image(image_bytes, prompt)

        if edited_image_bytes:
            # 返回图像字节流
            return send_file(edited_image_bytes, mimetype='image/png', as_attachment=True, download_name='edited_image.png')
        else:
            return jsonify({"error": "图像生成失败"}), 500

    except Exception as e:
        return jsonify({"error": f"发生错误: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(debug=True)
