from app.models.document import Document


def create_document(
    db,
    user_id,
    file_name,
    file_path,
    file_type
):

    document = Document(

        user_id=user_id,

        file_name=file_name,

        file_path=file_path,

        file_type=file_type,

        processing_status="PENDING"

    )

    db.add(document)

    db.commit()

    db.refresh(document)

    return document