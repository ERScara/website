import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import Conversation, Message
from .serializers import MessageSerializer

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope["user"]

        if self.user.is_anonymous:
            await self.close()
            return
        
        self.user_group_name = f"user_{self.user.id}"

        await self.channel_layer.group_add (
            self.user_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        if hasattr(self, 'user_group_name'):
            await self.channel_layer.group_discard(
                self.user_group_name,
                self.channel_name
            )
    async def receive(self, text_data):
        data = json.loads(text_data)
        message_type = data.get('type')

        if message_type == 'send_message':
            user = self.scope['user']
            await self.handle_send_message(data)

    async def handle_send_message(self, data):
        try:
            conversation_id = data.get('conversation_id')
            text = data.get('text')

            message = await self.create_message(conversation_id, text)

            if message:
                participants_ids = await self.get_conversation_participants(conversation_id)

                for participant_id in participants_ids:
                    await self.channel_layer.group_send(
                        'user_{}'.format(participant_id),
                        {
                            'type':'chat_message',
                            'message': message
                        }
                    )
        except Exception as ex:
            print("Error creando mensaje".format(repr(ex)))
    async def chat_message(self, event):
        message = event['message']
        serializer = MessageSerializer(message, context={'request': self.scope})
        
        await self.send(text_data=json.dumps({
            'type':'new_message',
            'message': serializer.data
        }))

    @database_sync_to_async
    def create_message(self, conversation_id, text):
        try:
            conversation = Conversation.objects.get(id=conversation_id)
            message = Message.objects.create(
                conversation=conversation,
                sender=self.user,
                text=text
            )
        except Exception as ex:
            print('Error creando mensaje {}'.format(repr(ex)))
            return None
    
    @database_sync_to_async
    def get_conversation_participants(self, conversation_id):
        conversation = Conversation.objects.get(id=conversation_id)
        return list(conversation.participants.values_list('id',flat=True))
    

