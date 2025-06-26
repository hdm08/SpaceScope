from django.db import models
import uuid

class ChatThread(models.Model):
    thread_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    user_identifier = models.CharField(max_length=255, null=True, blank=True)  # Optional: tie to user or session
    query = models.TextField()
    response = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=['thread_id']),
            models.Index(fields=['created_at']),
        ]
        ordering = ['created_at']

    def __str__(self):
        return f"Thread {self.thread_id}: {self.query[:50]}..."