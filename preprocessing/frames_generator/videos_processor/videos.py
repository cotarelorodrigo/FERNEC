import gc
import cv2
from tqdm import tqdm

from face_detector.detector import detect_faces
from images_processor.images import get_pixels
from utils import save_image_into_file


def get_frames_from_video(video_path, frames_path, batch_size, thumbnail_size, frames_order_magnitude):
    cap = cv2.VideoCapture(video_path)
    frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    raw_frames = []
    processed_count = 0

    for i in tqdm(range(frame_count), desc=f"Processing {frame_count} frames..."):
        if i % 100 == 0:
            gc.collect()

        success, frame = cap.read()
        if not success:
            break

        raw_frames.append(frame)
        if (len(raw_frames) == batch_size) or (i == frame_count - 1):
            boxes = detect_faces(raw_frames)
            for j, (frame, box) in enumerate(zip(raw_frames, boxes)):
                _, image = get_pixels(frame, box, thumbnail_size, return_image=True)
                save_image_into_file(image, frames_path +
                                     f"{str(processed_count + j + 1).zfill(frames_order_magnitude)}.jpg")
            processed_count += len(raw_frames)
            raw_frames = []

    cap.release()
    return processed_count
