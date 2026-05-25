import os
import json
from pathlib import Path

# For Vercel serverless deployment of Django
# This is a simplified detection endpoint using YOLO

def handler(request):
    """Vercel serverless function handler for bird detection"""
    if request.method == 'POST':
        try:
            # Parse multipart form data
            files = request.files
            if 'image' not in files:
                return {
                    'statusCode': 400,
                    'body': json.dumps({'error': 'No image provided'})
                }
            
            # Import heavy dependencies only when needed
            from ultralytics import YOLO
            import cv2
            import numpy as np
            from io import BytesIO
            import base64
            
            image_file = files['image']
            image_bytes = image_file.read()
            
            # Convert bytes to OpenCV image
            nparr = np.frombuffer(image_bytes, np.uint8)
            img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            
            # Load YOLOv8 model (cached after first load)
            model = YOLO('yolov8n.pt')
            
            # Run inference
            results = model(img)
            
            # Extract detections
            detections = []
            bird_count = 0
            
            for result in results:
                for box in result.boxes:
                    # Assuming class 14 is bird in COCO dataset
                    # Adjust based on your model
                    class_id = int(box.cls[0])
                    confidence = float(box.conf[0])
                    
                    # Get box coordinates (normalized 0-100)
                    x1, y1, x2, y2 = box.xyxy[0]
                    height, width = img.shape[:2]
                    
                    x = (float(x1) / width) * 100
                    y = (float(y1) / height) * 100
                    w = ((float(x2) - float(x1)) / width) * 100
                    h = ((float(y2) - float(y1)) / height) * 100
                    
                    detections.append({
                        'id': len(detections) + 1,
                        'x': x,
                        'y': y,
                        'w': w,
                        'h': h,
                        'label': 'Bird',
                        'confidence': confidence * 100
                    })
                    bird_count += 1
            
            # Annotate image
            annotated_img = results[0].plot()
            
            # Convert to JPEG and encode as base64
            _, buffer = cv2.imencode('.jpg', annotated_img)
            img_base64 = base64.b64encode(buffer).decode('utf-8')
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json'},
                'body': json.dumps({
                    'bird_count': bird_count,
                    'detections': detections,
                    'annotated_image': f'data:image/jpeg;base64,{img_base64}'
                })
            }
        
        except Exception as e:
            return {
                'statusCode': 500,
                'body': json.dumps({'error': str(e), 'traceback': str(e)})
            }
    
    else:
        return {
            'statusCode': 405,
            'body': json.dumps({'error': 'Method not allowed'})
        }
