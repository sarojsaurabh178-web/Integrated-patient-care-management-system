import logging
from datetime import datetime

logging.basicConfig(
    level=logging.INFO,
    format="[%(levelname)s] [%(asctime)s] %(message)s"
)
logger = logging.getLogger("meditrack")
