from sqlalchemy.orm import Session
from app.models.user import User
import bcrypt
import time


def _hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def _verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))


# Backward-compatible shim so seed_data.py can still call pwd_context.hash(...)
class _PwdContext:
    def hash(self, password: str) -> str:
        return _hash_password(password)

    def verify(self, plain: str, hashed: str) -> bool:
        return _verify_password(plain, hashed)


pwd_context = _PwdContext()


class UserRepository:
    @staticmethod
    def get_by_username(db: Session, username: str) -> User:
        return db.query(User).filter(User.username.ilike(username)).first()

    @staticmethod
    def get_by_id(db: Session, user_id: str) -> User:
        return db.query(User).filter(User.id == user_id).first()

    @staticmethod
    def create(db: Session, username: str, password: str, name: str = None, email: str = None, role: str = "Patient") -> User:
        user_id = f"U-{int(time.time() * 1000)}"
        db_user = User(
            id=user_id,
            username=username,
            name=name or username,
            email=email or f"{username}@meditrack.org",
            role=role,
            password_hash=_hash_password(password)
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user

    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        return _verify_password(plain_password, hashed_password)

