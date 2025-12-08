# Projectback/htp_yolo.py
import sys
import json
from pathlib import Path

import torch
import cv2
import numpy as np  # negative stride 해결용

# ===============================
# 1. 라벨별 해석 정보
# ===============================
ABNORMAL_LABEL_INFO = {
    # ----- 집 (house) -----
    "집전체": "집 전체의 형태와 크기는 현재 생활 전반에 대한 안정감과 자신감을 반영합니다.",
    "지붕": "지붕은 보호받고 싶은 욕구와 가족을 감싸는 역할에 대한 인식을 나타냅니다.",
    "집벽": "집의 벽은 자신을 둘러싼 경계를 상징하며, 벽이 두껍거나 강조되면 방어적 태도를 시사할 수 있습니다.",
    "문": "문은 타인과의 소통 통로입니다. 문이 작거나 닫혀 있으면 대인관계에서의 경계감이 반영될 수 있습니다.",
    "창문": "창문은 외부 세계를 바라보는 시각을 의미합니다. 창문이 적거나 작으면 경험을 제한하려는 경향이 있을 수 있습니다.",
    "굴뚝": "굴뚝은 에너지와 정서를 배출하는 통로로 보며, 강조된 굴뚝은 감정 표출에 대한 욕구를 시사할 수 있습니다.",
    "연기": "연기는 긴장, 스트레스, 불안이 쌓여 있다는 상징으로 해석되기도 합니다.",
    "울타리": "울타리는 타인과의 거리감, 경계심을 반영합니다. 강한 울타리는 사적인 영역을 지키고 싶다는 의미일 수 있습니다.",
    "길": "집으로 이어지는 길은 타인과의 관계 접근 방식을 의미합니다. 뚜렷한 길은 관계를 열어두려는 태도로 볼 수 있습니다.",
    "연못": "집 주변의 연못이나 물은 감정의 깊이와 내면 세계를 상징합니다.",
    "산": "산은 목표, 부담, 혹은 자신에게 주어진 과제를 상징하며 크게 그려지면 책임감이나 압박감을 의미할 수 있습니다.",
    "나무": "집 주변의 나무는 성장 가능성과 활력을 의미합니다.",
    "꽃": "꽃은 정서적 온기와 애정, 미적 감수성을 상징합니다.",
    "잔디": "잔디나 마당은 생활 환경의 여유와 안정감을 반영합니다.",
    "태양": "태양은 에너지, 활력, 보호감을 의미하며, 크게 밝게 그리면 낙관성과 희망을 나타낼 수 있습니다.",

    # ----- 나무 (tree) -----
    "나무전체": "나무 전체는 자기 성장과 에너지, 삶의 흐름을 상징합니다.",
    "기둥": "나무의 기둥은 자존감과 중심축 역할을 합니다. 기둥이 가늘거나 흔들리는 모습이면 자신감 부족을 시사할 수 있습니다.",
    "수관": "수관(나뭇잎이 모인 윗부분)은 생각과 상상, 대인관계의 폭을 의미합니다.",
    "가지": "가지는 활동성, 관계의 확장, 관심이 뻗어 나가는 방향을 상징합니다.",
    "뿌리": "뿌리는 현실적인 안정감과 기반을 상징합니다. 뿌리가 강조되면 안정 추구 욕구가 클 수 있습니다.",
    "나뭇잎": "나뭇잎은 세밀한 감수성과 정서적 에너지를 나타냅니다.",
    "꽃_나무": "나무에 피어난 꽃은 성장과 함께 정서적 풍요, 관계에서의 따뜻함을 반영합니다.",
    "열매": "열매는 성취감, 보상, 결과에 대한 기대를 상징합니다.",
    "그네": "그네는 휴식, 놀이, 양육 경험과 관련된 기억을 시사하기도 합니다.",
    "새": "새는 자유, 이동 욕구, 독립에 대한 동경을 나타낼 수 있습니다.",
    "다람쥐": "다람쥐는 활동성과 에너지, 동시에 산만함이나 긴장감을 의미하기도 합니다.",
    "구름": "구름은 막연한 걱정이나 상상, 변덕스러운 감정을 상징할 수 있습니다.",
    "달": "달은 감수성과 정서적인 민감성을 나타냅니다.",
    "별": "별은 희망, 소망, 이상을 향한 시선을 의미합니다.",

    # ----- 사람 (person) -----
    "사람전체": "사람 전체의 비율과 자세는 자기 이미지와 타인 앞에서의 모습을 반영합니다.",
    "머리": "머리는 사고와 의식의 중심입니다. 머리가 작거나 축소되면 자기 표현의 위축을 시사할 수 있습니다.",
    "얼굴": "얼굴은 대인관계에서 드러나는 자기 표현과 감정을 상징합니다.",
    "눈": "눈은 세상을 바라보는 시각과 관심을 상징합니다. 눈이 강조되면 주변을 경계하거나 관찰하는 경향이 있을 수 있습니다.",
    "코": "코는 자존감과 자기 존재감을 상징하기도 합니다.",
    "입": "입은 의사소통과 감정 표현과 관련이 있으며, 생략되거나 작게 그리면 표현의 어려움을 시사할 수 있습니다.",
    "귀": "귀는 타인의 의견을 듣는 태도와 관련됩니다.",
    "머리카락": "머리카락은 자기 이미지와 매력, 외모에 대한 관심을 반영합니다.",
    "목": "목은 머리와 몸을 이어주는 부분으로, 생각과 행동의 연결을 상징합니다.",
    "상체": "상체는 책임, 부담, 사회적 역할과 관련되기도 합니다.",
    "팔": "팔은 활동성과 대인관계의 확장, 타인에게 다가가는 방식을 나타냅니다.",
    "손": "손은 실제 행동, 능력, 기술을 상징하며, 세밀하게 그릴수록 능력에 대한 관심이 크다고 볼 수 있습니다.",
    "다리": "다리는 앞으로 나아가는 힘, 진로와 방향성을 의미합니다.",
    "발": "발은 현실에 딛고 서는 안정감을 의미합니다.",
    "단추": "단추나 장식은 질서, 통제, 깔끔함에 대한 욕구를 시사할 수 있습니다.",
    "주머니": "주머니는 비밀, 개인적인 욕구나 자원을 숨기고 싶은 마음을 상징할 수 있습니다.",
    "운동화": "운동화는 활동성, 편안함, 자유로운 행동에 대한 선호를 의미합니다.",
    "남자구두": "구두는 사회적 역할, 격식, 책임감과 연관 지어 해석되기도 합니다.",
}

# ===============================
# 2. YOLOv5 경로 설정
# ===============================
FILE = Path(__file__).resolve()          # .../Projectback/htp_yolo.py
ROOT = FILE.parent / "yolov5"           # .../Projectback/yolov5

if str(ROOT) not in sys.path:
    sys.path.append(str(ROOT))

from models.common import DetectMultiBackend
from utils.torch_utils import select_device
from utils.augmentations import letterbox
from utils.general import non_max_suppression


# ===============================
# 3. 단일 모델 실행 함수
# ===============================
def run_single_model(image_path: str, weights_path: Path, category: str):
    """
    YOLOv5 모델 1개로 객체 탐지 수행.
    category: "house" / "tree" / "person"
    """
    device = select_device("cpu")
    model = DetectMultiBackend(str(weights_path), device=device)
    stride = int(model.stride)
    names = model.names  # 클래스 id -> 라벨 이름

    img0 = cv2.imread(image_path)
    if img0 is None:
        raise ValueError(f"이미지를 불러올 수 없습니다: {image_path}")

    # 리사이즈 + 패딩
    img = letterbox(img0, 640, stride=stride)[0]

    # BGR -> RGB, HWC -> CHW + negative stride 방지
    img = img[:, :, ::-1].transpose(2, 0, 1).copy()

    img = torch.from_numpy(img).to(device).float() / 255.0
    if img.ndimension() == 3:
        img = img.unsqueeze(0)

    # 추론
    with torch.no_grad():
        pred = model(img)

    # NMS
    pred = non_max_suppression(pred, 0.25, 0.45)[0]

    detections = []
    if pred is not None and len(pred):
        for *xyxy, conf, cls in pred:
            x1, y1, x2, y2 = map(float, xyxy)
            label_id = int(cls.item())
            label = names[label_id]
            confidence = float(conf.item())

            detections.append(
                {
                    "category": category,  # house / tree / person
                    "label": label,        # 위 ABNORMAL_LABEL_INFO key와 동일한 문자열
                    "confidence": confidence,
                    "bbox": {
                        "x1": x1,
                        "y1": y1,
                        "x2": x2,
                        "y2": y2,
                    },
                }
            )

    return detections


# ===============================
# 4-A. 라벨당 1개만 남기기 (탐지 중복 제거)
# ===============================
def deduplicate_detections_by_label(detections):
    """
    같은 라벨이 여러 번 탐지되면,
    '처음 등장한 것 하나만' 남기고 나머지는 버린다.
    (라벨당 1개 탐지로 정리)
    """
    seen = set()
    result = []
    for d in detections:
        label = d.get("label")
        if label in seen:
            continue
        seen.add(label)
        result.append(d)
    return result


# ===============================
# 4-B. 라벨별 해석(중복 설명 제거)
# ===============================
def build_abnormal_findings(detections):
    """
    탐지된 라벨의 설명은 라벨당 한 번만 생성.
    """
    seen = set()
    abnormal = []
    for det in detections:
        label = det["label"]
        if label in seen:
            continue
        seen.add(label)

        desc = ABNORMAL_LABEL_INFO.get(label)
        if desc:
            abnormal.append(
                {
                    "label": label,
                    "category": det["category"],
                    "description": desc,
                }
            )
    return abnormal


# ===============================
# 5. 전체 추론 함수 (집/나무/사람 모두)
# ===============================
def run_inference(image_path: str):
    base_dir = Path(__file__).resolve().parent
    models_dir = base_dir / "models"

    model_paths = {
        "house": models_dir / "house_best.pt",
        "tree": models_dir / "tree_best.pt",
        "person": models_dir / "male_best.pt",
    }

    all_detections = []

    for category, mpath in model_paths.items():
        if not mpath.exists():
            # 해당 모델 파일 없으면 스킵
            continue

        dets = run_single_model(image_path, mpath, category)
        all_detections.extend(dets)

    # ✅ 라벨당 1개만 남기기
    unique_detections = deduplicate_detections_by_label(all_detections)

    # ✅ 설명도 라벨당 1번만
    abnormal = build_abnormal_findings(unique_detections)

    return {
        "success": True,
        "imagePath": str(Path(image_path).resolve()),
        "detections": unique_detections,
        "abnormalFindings": abnormal,
    }


# ===============================
# 6. CLI 진입점 (Node에서 호출)
# ===============================
def main():
    try:
        if len(sys.argv) < 2:
            raise ValueError(
                "이미지 경로 인자가 없습니다. (usage: python htp_yolo.py <image_path>)"
            )

        image_path = sys.argv[1]
        result = run_inference(image_path)
        print(json.dumps(result, ensure_ascii=False))

    except Exception as e:
        import traceback

        error_res = {
            "success": False,
            "error": str(e),
            "trace": traceback.format_exc(),
        }
        # 에러도 stdout에 JSON으로 출력
        print(json.dumps(error_res, ensure_ascii=False))
        # exit code는 0으로 두고, Node는 JSON 내용을 보고 판단


if __name__ == "__main__":
    main()