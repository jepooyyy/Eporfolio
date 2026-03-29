from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from ultralytics import YOLO
import cv2
import numpy as np
from PIL import Image
import io
import base64

# Load YOLOv8 model (pre-trained on COCO dataset which includes 'person')
model = YOLO('yolov8n.pt')  # Use nano model for speed

@api_view(['POST'])
def detect_persons(request):
    if 'image' not in request.FILES:
        return Response({'error': 'No image file provided'}, status=status.HTTP_400_BAD_REQUEST)

    image_file = request.FILES['image']
    
    try:
        # Read image
        image = Image.open(io.BytesIO(image_file.read())).convert('RGB')
        image_np = np.array(image)
        
        # Run detection
        results = model(image_np, classes=[0])  # 0 is 'person' in COCO
        
        # Count persons
        person_count = len(results[0].boxes) if results[0].boxes is not None else 0
        
        # Annotate image
        annotated_image = results[0].plot()
        if isinstance(annotated_image, Image.Image):
            annotated_image = np.array(annotated_image)

        # Convert to base64 for response
        success, buffer = cv2.imencode('.jpg', annotated_image)
        if not success:
            raise ValueError('Failed to encode annotated image')

        image_base64 = base64.b64encode(buffer).decode('utf-8')

        return Response({
            'person_count': person_count,
            'annotated_image': f'data:image/jpeg;base64,{image_base64}'
        })
    
    except Exception as e:
        import traceback
        traceback_str = traceback.format_exc()
        print('Detection error:', traceback_str)
        return Response({'error': str(e), 'traceback': traceback_str}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
