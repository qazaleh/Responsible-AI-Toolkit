from fastapi import APIRouter, File, HTTPException, UploadFile

from agent_log.schemas import EvaluationResponse
from agent_log.service import AgentLogEvaluationService


router = APIRouter()
service = AgentLogEvaluationService()


@router.get('/health')
def health() -> dict:
    return service.health()


@router.post('/evaluate', response_model=EvaluationResponse)
async def evaluate(file: UploadFile = File(...)) -> EvaluationResponse:
    if file is None:
        raise HTTPException(status_code=400, detail='A JSONL file upload is required.')

    filename = file.filename or 'uploaded.jsonl'

    try:
        content = await file.read()
        return service.evaluate_jsonl_bytes(content, filename=filename)
    except UnicodeDecodeError as exc:
        raise HTTPException(
            status_code=400,
            detail='Uploaded file must be UTF-8 encoded JSONL.',
        ) from exc
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
