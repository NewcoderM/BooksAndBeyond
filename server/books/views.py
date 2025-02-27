from .serializers import BookSerializer, CommentSerializer
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import viewsets
from rest_framework import status
from .models import Book, Comment

class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer

    # Optional: Custom action to fetch comments for a specific book
    @action(detail=True, methods=['get'])
    def comments(self, request, pk=None):
        book = self.get_object()
        comments = book.comments.all()
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data)


class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]  # Auth required for POST, GET is public

    def create(self, request, *args, **kwargs):
        """
        Create a comment and associate it with a book.
        """
        try:
            book = Book.objects.get(id=request.data.get('book'))  # Ensure book exists
        except Book.DoesNotExist:
            return Response({'error': 'Book not found'}, status=status.HTTP_404_NOT_FOUND)

        # Initialize serializer with request data
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            serializer.save(customer=request.user, book=book)  # Save with authenticated user
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
