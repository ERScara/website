from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Conversation, Message
from .serializers import ConversationSerializer, MessageSerializer

class ConversationViewSet(viewsets.ModelViewSet):
    serializer_class = ConversationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """ Retorna solo las conversaciones del usuario activo. """
        return Conversation.objects.filter(participants=self.request.user).order_by('-updated_at')
    
    @action(detail=True, methods=['get'])
    def messages(self,request, pk=None):
        queryset = Message.objects.filter(conversation_id=pk).order_by('created_at')
        print("Mensajes encontrados: {}".format(queryset.count()))
        serializer = MessageSerializer(queryset, many=True, context={'request': request})
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def send_message(self, request, pk=None):
        conversation = self.get_object()

        text = request.data.get('text')
        if not text:
            return Response({"error": "No puedes enviar un mensaje vacío."}, status=400)
        
        message = Message.objects.create(
            conversation=conversation,
            sender=request.user,
            text=text
        )

        conversation.save()
        serializer = MessageSerializer(message, context={'request': request})
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['post'])
    def mark_as_read(self, request, pk=None):
        """ Considera los mensajes marcados como leídos. """
        conversation = self.get_object()
        conversation.messages.filter(is_read=False).exclude(sender=request.user).update(is_read=True)

        return Response({'status': 'Mensajes markado como leídos'}, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['post'])
    def start(self, request):
        target_user_id = request.data.get('user_id')
        conv = Conversation.objects.filter(participants=request.user).filter(participants__id=target_user_id).first()

        if not conv:
            conv = Conversation.objects.create()
            conv.participants.add(request.user, target_user_id)
            conv.save()

        serializer = self.get_serializer(conv)
        return Response(serializer.data)
    
    

    @action(detail=False, methods=['post'])
    def get_or_create_chat(self, request):
        target_user_id = request.data.get('user_id')
        if not target_user_id:
            return Response (status=400)
            
        conversations = Conversation.objects.filter(participants=request.user).filter(participants__id=target_user_id)

        if conversations.exists():
            conversation = conversations.first()
        else:
            conversation = Conversation.objects.create()
            conversation.participants.add(request.user, target_user_id)
        
        serializer = self.get_serializer(conversation)
        return Response(serializer.data)
