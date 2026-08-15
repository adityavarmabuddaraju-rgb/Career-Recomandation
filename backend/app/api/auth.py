from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.auth import SignupRequest, LoginRequest, TokenResponse, UserResponse
from app.models.user import User
from app.database import get_users_collection
from app.auth.password import hash_password, verify_password
from app.auth.jwt_handler import create_access_token, create_refresh_token
from app.auth.dependencies import get_current_user

router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.post("/signup", response_model=TokenResponse)
@router.post("/register", response_model=TokenResponse)
async def signup(request: SignupRequest):
    users_collection = get_users_collection()
    
    # Check if user exists
    existing_user = await users_collection.find_one({"email": request.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
        
    # Create user
    user = User(
        name=request.name,
        email=request.email,
        password=hash_password(request.password)
    )
    user_dict = user.model_dump(by_alias=True, exclude_none=True)
    
    result = await users_collection.insert_one(user_dict)
    user_id = str(result.inserted_id)
    
    # Generate tokens
    access_token = create_access_token({"sub": user_id})
    refresh_token = create_refresh_token({"sub": user_id})
    
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        user=UserResponse(
            id=user_id,
            name=user.name,
            email=user.email,
            created_at=user.created_at
        )
    )

@router.post("/login", response_model=TokenResponse)
async def login(request: LoginRequest):
    users_collection = get_users_collection()
    
    user = await users_collection.find_one({"email": request.email})
    if not user or not verify_password(request.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
        
    user_id = str(user["_id"])
    
    # Generate tokens
    access_token = create_access_token({"sub": user_id})
    refresh_token = create_refresh_token({"sub": user_id})
    
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        user=UserResponse(
            id=user_id,
            name=user["name"],
            email=user["email"],
            created_at=user["created_at"]
        )
    )

@router.get("/me", response_model=UserResponse)
async def get_me(current_user: dict = Depends(get_current_user)):
    return UserResponse(
        id=current_user["id"],
        name=current_user["name"],
        email=current_user["email"],
        created_at=current_user["created_at"]
    )

@router.post("/refresh", response_model=dict)
async def refresh_token(refresh_token: str):
    from app.auth.jwt_handler import decode_token
    payload = decode_token(refresh_token)
    if not payload or payload.get("type") != "refresh":
        raise HTTPException(status_code=401, detail="Invalid refresh token")
        
    user_id = payload.get("sub")
    access_token = create_access_token({"sub": user_id})
    
    return {"access_token": access_token, "token_type": "bearer"}
