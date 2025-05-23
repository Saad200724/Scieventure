import os
from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func
from sqlalchemy.orm import sessionmaker

# Create a base class for declarative models
Base = declarative_base()

# Define the ChatMessage model
class ChatMessage(Base):
    __tablename__ = 'chat_messages'
    
    id = Column(Integer, primary_key=True)
    user_message = Column(Text, nullable=False)
    bot_response = Column(Text, nullable=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    is_translated = Column(Boolean, default=False)
    
    def __repr__(self):
        return f"<ChatMessage(id={self.id}, timestamp={self.timestamp})>"

# Define the FileUpload model
class FileUpload(Base):
    __tablename__ = 'file_uploads'
    
    id = Column(Integer, primary_key=True)
    original_filename = Column(String(255), nullable=False)
    stored_filename = Column(String(255), nullable=False)
    file_path = Column(String(512), nullable=False)
    file_type = Column(String(50), nullable=False)
    upload_timestamp = Column(DateTime(timezone=True), server_default=func.now())
    analysis = Column(Text, nullable=True)
    
    def __repr__(self):
        return f"<FileUpload(id={self.id}, original_filename={self.original_filename})>"

# Define the ResearchPaper model
class ResearchPaper(Base):
    __tablename__ = 'research_papers'
    
    id = Column(Integer, primary_key=True)
    title = Column(String(255), nullable=False)
    abstract = Column(Text, nullable=False)
    content = Column(Text, nullable=True)
    analysis = Column(Text, nullable=True)
    submission_timestamp = Column(DateTime(timezone=True), server_default=func.now())
    
    def __repr__(self):
        return f"<ResearchPaper(id={self.id}, title={self.title})>"

# Database connection setup
def init_db():
    # Set the default database URL if environment variable is not available
    database_url = os.environ.get("DATABASE_URL")
    
    if not database_url:
        raise ValueError("Database URL is not set")
    
    # Create an engine
    engine = create_engine(database_url)
    
    # Create all tables
    Base.metadata.create_all(engine)
    
    # Create a session factory
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    
    return engine, SessionLocal