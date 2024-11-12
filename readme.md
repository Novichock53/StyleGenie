# Flask Image Editing API

这个项目提供了一个 Flask API，可以接受图像并通过 OpenAI 的图像编辑功能进行编辑。你可以通过传递图像字节流、生日、性别、出席场合等参数来生成编辑后的图像。



## 安装依赖

1. 克隆此仓库：

   ```bash
   git clone <your-repository-url>
   cd StyleGenie
   pip install -r requirements.txt
    ```

## 使用说明

1. 在 app.py 中设置你的 OpenAI API 密钥：

   ```
   bopenai.api_key = 'your-openai-api-key'
    ```

 2. 运行 Flask 应用程序：

   ```
   python gen_img.py
```

默认情况下，应用程序将启动在 http://127.0.0.1:5000/。
   


   curl -X POST http://127.0.0.1:5000/edit-image \
-F "image=@path_to_your_image.jpg" \
-F "gender=男" \
-F "occasion=晚宴" \
-F "birthday=1990-05-15" \
-F "style=rafSimons"