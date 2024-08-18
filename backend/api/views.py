from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from.serializers import UserSerializer, NoteSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Note

# Create your views here.
class CreareUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny] # solo permitir creación de usuarios sin autenticación
    
class NoteListCreate(generics.ListCreateAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated] # solo permitir crear notas si está autenticado
    
    # esta funcion retorna la busqueda de las notas de un usuario
    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(author=user)
    
    # esta función se encarga de guardar la información de la notas del usuario en la base de datos
    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(author=self.request.user)
        else:
            print(serializer.errors)
#esta clase borra la nota
class NoteDelete(generics.DestroyAPIView):
    queryset = Note.objects.all()
    permission_classes = [IsAuthenticated] # solo permitir borrar notas si está autenticado
    
    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(author=user)